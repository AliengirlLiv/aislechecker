import React, { Component } from 'react';
import { Button,
			ButtonGroup,
			DropdownButton,
			MenuItem,
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
			suggestions: [],
			formattedList: [],
			name: "",
			isSearch: true,
			allItems: []
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
		this.structureAllItems(props.allItems);
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
				<br/>
				<ButtonGroup bsSize="large">
					<Button bsStyle={this.state.isSearch ? "primary" : "default"} onClick={() => this.setState({isSearch: true})}>Search Bar</Button>
					<Button bsStyle={this.state.isSearch ? "default" : "primary"} onClick={() => this.setState({isSearch: false})}>List </Button>
				</ButtonGroup>
				<br/>

				{this.state.isSearch &&
					<div>
						<br/>
						<Autosuggest
							suggestions={this.state.suggestions}
							onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
							onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
							getSuggestionValue={this.getSuggestionValue.bind(this)}
							renderSuggestion={this.renderSuggestion}
							inputProps={inputProps}
						/>
					</div>
				}
				{!this.state.isSearch &&
					<div>
						<br/>
						{this.getAllItems()}
					</div>
				}
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

	getAllItems() {
		var itemsList = [];
		for (var store of this.state.allItems) {
			if (store.key === this.state.store) {
				itemsList = this.alphabeticalSort(store);
			}
		}
		return(
			<div>
				<DropdownButton bsStyle="warning" title={this.state.store ? this.state.store : "Select Store"} id="select-store-dropdown">
					{this.state.allItems.map((item) => {
						return(
						<MenuItem key={item.key} onSelect={() => this.setState({store: item.key})}>{item.key}</MenuItem>
						);
					})}
				</DropdownButton>
				<br/>
				<ButtonGroup vertical>
					{itemsList.map((item) => {
						return(
							<Button key={item} onClick={() => this.toggleItem(item, !item[4])} bsStyle={item[4] ? "success" : "default"}>{item[3]}, Aisle {item[1]}, Bin {item[2]}</Button>
						)
					})}
				</ButtonGroup>
			</div>
		)
	}


	toggleItem(item, shouldAdd) {
		if (shouldAdd) {
			this.addToList(item, this.state.formattedList);
		} else {
			this.deleteItem(item);
		}
		this.selectItem(item);
	}

	selectItem(itemData) {
		var item = itemData[3];
		var bin = itemData[2];
		var aisle = itemData[1];
		var store = itemData[0];
		var list = this.state.allItems;
		for (var storeObj of list) {
			if (storeObj.key === store) {
				for (var aisleObj of storeObj.val) {
					if (aisleObj.key === aisle) {
						for (var binObj of aisleObj.val) {
							if (binObj.key === bin) {
								for (var itemObj of binObj.val) {
									if (itemObj.key === item) {
										itemObj.val = !itemObj.val
									}
								}
								this.setState({allItems: list});
								return;
							}
						}
					}
				}
			}
		}
	}

	//TODO: At some point, don't keep sorting literally every time you re-render the page.
	alphabeticalSort(store) {
		var alphaList = [];
		for (var aisle of store.val) {
			for (var bin of aisle.val) {
				for (var item of bin.val) {
					alphaList.push([store.key, aisle.key, bin.key, item.key, item.val]);
				}
			}
		}
		alphaList.sort(this.alphaSort);
		return alphaList;
	}

	alphaSort(a, b) {
		if (a[3] < b[3]) {
			return -1;
		}
		if (a[3] > b[3]) {
			return 1;
		}
		return 0;
	}

	structureAllItems(allItems) {
		var newAllItems = [];
		allItems.map(function(item) {
			this.addToList(item, newAllItems);
		}.bind(this));
		this.setState({allItems: newAllItems});
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
													return(<div key={index}>{item.key + " (Bin " + bin.key + ")"}<Button onClick={() => this.toggleItem([store.key, aisle.key, bin.key, item.key], false)}>x</Button><br/></div>);
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

	deleteItem(itemData) {
		const item = itemData[3];
		const bin = itemData[2];
		const aisle = itemData[1];
		const store = itemData[0];
		var list = this.state.formattedList;
		for (var storeObj of list) {
			if (storeObj.key === store) {
				for (var aisleObj of storeObj.val) {
					if (aisleObj.key === aisle) {
						for (var binObj of aisleObj.val) {
							if (binObj.key === bin) {
								for (var itemObj of binObj.val) {
									if (itemObj.key === item) {
										const itemIndex = binObj.val.indexOf(itemObj);
										binObj.val.splice(itemIndex, 1);
									}
								}
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
		this.toggleItem(suggestion, true);
		return suggestion[3];
	}

	addToList(item, list) {
		var store = item[0];
		var aisle = item[1];
		var bin = item[2];
		var name = item[3];
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
								b.val.push({key:name, val: false});
								break;
							}
						}
						if (!foundBin) {
							a.val.push({key: bin, val:[{key:name, val: false}]});
						}	
						break;
					}
				}
				if (!foundAisle) {
					s.val.push({key: aisle, val: [{key: bin, val:[{key:name, val: false}]}]});
				}
				break;
			}
		}
		if (!foundStore) {
			list.push({key: store, val: [{key: aisle, val: [{key: bin, val: [{key:name, val: false}]}]}]});
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