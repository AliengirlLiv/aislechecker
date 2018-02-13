import React, { Component } from 'react';
import { Button,
			FormGroup, 
			FormControl, 
			ControlLabel } from 'react-bootstrap'
import * as firebase from 'firebase'

export default class AllItems extends Component {

	constructor(props) {
		super();
		this.state = {
			items: props.allItems,
			saved: false};
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
								<FormControl placeholder="Store" value={item[0]} onChange={(e) => this.updateItem(e, 0, index)} />
								<FormControl placeholder="Aisle" value={item[1]} onChange={(e) => this.updateItem(e, 1, index)} />
								<FormControl placeholder="Bin" value={item[2]} onChange={(e) => this.updateItem(e, 2, index)} />
								<FormControl placeholder="Item" value={item[3]} onChange={(e) => this.updateItem(e, 3, index)} />
							</FormGroup>
							<Button onClick={() => this.removeItem(index)}>X</Button>
						</div>
					);
				})}
				<br/>
				<br/>
				<br/>
				<br/>
				<div className="bottom-fixed">
					<Button onClick={() => this.addItem()}>+</Button>
					<br/>
					<Button bsStyle={this.state.saved ? "success" : "default"} onClick={() => this.save()}>Save</Button>
				</div>
			</div>
		)
	}

	save() {
		firebase.database().ref('items').set({
			items: this.state.items,
  		}).then(function() {
  			this.setState({saved: true});
  		}.bind(this));
	}

	removeItem(index) {
		var items = this.state.items;
		items.splice(index, 1);
		this.setState({
			items: items,
			saved: false});
	}

	updateItem(e, fieldIndex, index) {
		var items = this.state.items;
		items[index][fieldIndex] = e.target.value;
		this.setState({
			items: items,
			saved: false});
	}

	addItem() {
		var items = this.state.items;
		items.push(["", "", "", ""]);
		this.setState({
			items: items,
			saved: false});
	}
}