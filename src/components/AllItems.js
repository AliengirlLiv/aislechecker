import React, { Component } from 'react';
import { Button,
			FormGroup, 
			FormControl, 
			ControlLabel } from 'react-bootstrap'
import * as firebase from 'firebase'

export default class AllItems extends Component {

	constructor(props) {
		super();
		this.state = {items: props.allItems};
	}

	render() {
		return (
			<div>
			Format: Store, Aisle, Bin, Item
				{this.state.items.map((item, index) => {
					return( 
						<div key={index}>
							<FormGroup>
								<ControlLabel>New Item</ControlLabel>
								<FormControl value={item[0]} onChange={(e) => this.updateItem(e, 0, index)} />
								<FormControl value={item[1]} onChange={(e) => this.updateItem(e, 1, index)} />
								<FormControl value={item[2]} onChange={(e) => this.updateItem(e, 2, index)} />
								<FormControl value={item[3]} onChange={(e) => this.updateItem(e, 3, index)} />
							</FormGroup>
							<Button onClick={() => this.removeItem(index)}>X</Button>
						</div>
					);
				})}
				<br/>
				<Button onClick={() => this.addItem()}>+</Button>
				<br/>
				<Button onClick={() => this.save()}>Save</Button>
			</div>
		)
	}

	save() {
		firebase.database().ref('items').set({
			items: this.state.items
  		});
	}

	removeItem(index) {
		var items = this.state.items;
		items.splice(index, 1);
		this.setState({items:items});
	}

	updateItem(e, fieldIndex, index) {
		var items = this.state.items;
		items[index][fieldIndex] = e.target.value;
		this.setState({items:items});
	}

	addItem() {
		var items = this.state.items;
		items.push(["", "", "", ""]);
		this.setState({items:items});
	}
}