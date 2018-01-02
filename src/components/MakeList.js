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
		return(
			<div>
				{this.state.formattedList.map((store, index) => {
					return(
						<div>
							<h2>{store.key}</h2>
							{store.val.map((aisle, index) => {
								return(
									<div>
										<h3>{aisle.key}</h3>
										{aisle.val.map((item, index) => {
											return(<div>{item}<br/></div>);
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

	updateName(e) {
		this.setState({name: e.target.value});
	}

	onSuggestionsFetchRequested(e) {
		const inputValue = e.value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const suggestions = inputLength === 0 ? [] : this.props.allItems.filter(item =>
			item[2].toLowerCase().slice(0, inputLength) === inputValue
		);

		this.setState({suggestions: suggestions});
	}

	getSuggestionValue(suggestion) {
		this.addToList(suggestion);
		return suggestion[2];
	}

	addToList(item) {
		var store = item[0];
		var aisle = item[1];
		var name = item[2];
		var list = this.state.list;
		for (var s of list) {
			var foundStore = false;
			if (s.key === store) {
				foundStore = true;
				for (var a of s.val) {
					var foundAisle = false;
					if (a.key === aisle) {
						a.val.push(name);
						foundAisle = true;
						break;
					}
					if (!foundAisle) {
						s.push([{key: aisle, val: [name]}]);
					}
				}
				break;
			}
		}
		if (!foundStore) {
			list.push({key: store, val: [{key: aisle, val: [name]}]});
		}
		this.setState({formattedList: list});
	}

	renderSuggestion(suggestion) {
		return(
			<Button>
				{suggestion[2] + "(" + suggestion[0] + ")"}
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