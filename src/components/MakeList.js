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

	componentWillReceiveProps(props) {
		const name = props.match.params.name;
		if (this.state && this.state.formattedList.length === 0 && name) {
			if (props.lists[name]) {
				this.setState({
					name: name,
					formattedList: props.lists[name]
				});
			}
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
					suggestions={this.state.suggestions}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
					getSuggestionValue={this.getSuggestionValue.bind(this)}
					renderSuggestion={this.renderSuggestion}
					inputProps={inputProps}
				/>
				<h1>Current List</h1>
				{this.displayCurrentList()}
				<FormGroup>
					<ControlLabel>List Name</ControlLabel>
					<FormControl value={this.state.name} onChange={(e) => this.updateName(e)} />
				</FormGroup>
				{this.state.name && <Button onClick={() => this.saveList()}>{(this.props.match.params.name && this.props.match.params.name === this.state.name) ? "Save as Updated List" : "Save as New List"}</Button>}
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
						<div key={store.key}>
							<h2>{"Store: " + store.key}</h2>
							{store.val.map((aisle, index) => {
								aisle.val.sort(this.keySort);
								return(
									<div key={aisle.key}>
										<h3>{"Aisle " + aisle.key}</h3>
										{aisle.val.map((bin, index) => {
											bin.val.sort();
											return(
												<div key={bin.key}>
												{bin.val.map((item, index) => {
													return(<div key={index}>{item + " (Bin " + bin.key + ")"}<Button onClick={() => this.deleteItem(store.key, aisle.key, bin.key, item)}>x</Button><br/></div>);
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

	deleteItem(store, aisle, bin, item) {
		var list = this.state.formattedList;
		for (var storeObj of list) {
			if (storeObj.key === store) {
				for (var aisleObj of storeObj.val) {
					if (aisleObj.key === aisle) {
						for (var binObj of aisleObj.val) {
							if (binObj.key === bin) {
								const itemIndex = binObj.val.indexOf(item);
								binObj.val.splice(itemIndex, 1);
								if (binObj.val.length === 0) {
									const binIndex = aisleObj.val.indexOf(binObj);
									aisleObj.val.splice(binIndex, 1);
									if (aisleObj.val.length === 0) {
										const aisleIndex = storeObj.val.indexOf(aisleObj);
										storeObj.val.splice(aisleIndex, 1);
										if (storeObj.val.length === 0) {
											const storeIndex = list.indexOf(storeObj);
											list.splice(storeIndex, 1);
										}
									}
								}
								this.setState({formattedList: list});
								return;
							}
						}
					}
				}
			}
		}
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
		var list = this.state.formattedList;
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