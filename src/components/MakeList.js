import React, { Component } from 'react';
import { Button,
			FormGroup, 
			FormControl, 
			ControlLabel } from 'react-bootstrap'
import Autosuggest from 'react-autosuggest'
import * as firebase from 'firebase'


export default class MakeList extends Component {

	constructor() {
		super();
		this.state = {
			value: "",
			list: [],
			suggestions: [],
			formattedList: [],
			name: ""
		}
	}

	render() {
		const value = this.state.value;
		const inputProps = {
			placeholder: "Type an item",
			value,
			onChange: this.updateSearch.bind(this)
		}
		return (
			<div>
				<Autosuggest
					suggestions={this.state.suggestions}//
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}//
					onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}//
					getSuggestionValue={this.getSuggestionValue.bind(this)}//
					renderSuggestion={this.renderSuggestion}//
					inputProps={inputProps}//
				/>
				<h1>Current List</h1>
				{this.displayCurrentList()}
				<FormGroup>
					<ControlLabel>List Name</ControlLabel>
					<FormControl value={this.state.name} onChange={(e) => this.updateName(e)} />
				</FormGroup>
				{this.state.name && <Button onClick={() => this.saveList()}>Save as New List</Button>}
				<br/>
				<Button onClick={() => this.goToShopView()}>Use This List (must save changes first)</Button>
			</div>
		)
	}

	saveList() {
		var obj = {};
		obj[this.state.name] = this.state.formattedList;
		firebase.database().ref("lists").update(obj);
	}


	displayCurrentList() {
		var list = this.state.formattedList;
		list.sort(this.keySort);
		return(
			<div>
				{list.map((store, index) => {
					store.val.sort(this.keySort);
					return(
						<div>
							<h2>{"Store: " + store.key}</h2>
							{store.val.map((aisle, index) => {
								aisle.val.sort(this.keySort);
								return(
									<div>
										<h3>{"Aisle " + aisle.key}</h3>
										{aisle.val.map((bin, index) => {
											bin.val.sort();
											return(
												<div>
												{bin.val.map((item, index) => {
													return(<div>{item + " (Bin " + bin.key + ")"}<br/></div>);
												})}
												</div>
											)
										})}
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
		)
	}

	keySort(a, b) {
		const first = a.key.toLowerCase();
		const second = b.key.toLowerCase();
		if (first < second) {
			return -1;
		}
		if (first > second) {
			return 1;
		}
		return 0;
	}

	updateName(e) {
		this.setState({name: e.target.value});
	}

	onSuggestionsFetchRequested(e) {
		const inputValue = e.value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const suggestions = inputLength === 0 ? [] : this.props.allItems.filter(item =>
			item[3].toLowerCase().slice(0, inputLength) === inputValue
		);

		this.setState({suggestions: suggestions});
	}

	getSuggestionValue(suggestion) {
		this.addToList(suggestion);
		return suggestion[3];
	}

	addToList(item) {
		var store = item[0];
		var aisle = item[1];
		var bin = item[2];
		var name = item[3];
		var list = this.state.list;
		for (var s of list) {
			var foundStore = false;
			if (s.key === store) {
				foundStore = true;
				var foundAisle = false;
				for (var a of s.val) {
					if (a.key === aisle) {
						foundAisle = true;
						var foundBin = false;
						for (var b of a.val) {
							if (b.key === bin) {
								foundBin = true;
								b.val.push(name);
								break;
							}
						}
						if (!foundBin) {
							a.val.push({key: bin, val:[name]});
						}	
						break;
					}
				}
				if (!foundAisle) {
					s.val.push({key: aisle, val: [{key: bin, val:[name]}]});
				}
				break;
			}
		}
		if (!foundStore) {
			list.push({key: store, val: [{key: aisle, val: [{key: bin, val: [name]}]}]});
		}
		console.log("FORMATTED LIST", list);
		this.setState({formattedList: list});
	}

	renderSuggestion(suggestion) {
		return(
			<Button>
				{suggestion[3] + " (" + suggestion[0] + ")"}
			</Button>
		)
	}

	updateSearch(e, {newValue}) {
		this.setState({value: newValue});
	}

	onSuggestionsClearRequested() {
		this.setState({suggestions: []});
	}

	goToShopView(place) {
		this.props.history.push('/shopping-list/' + this.state.name);
	}


}