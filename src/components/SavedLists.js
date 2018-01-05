import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap'
import * as firebase from 'firebase'

export default class SavedLists extends Component {
	
	constructor() {
		super();
		this.state={};		
	}

	render() {

		return(
			<div>
				{Object.keys(this.props.lists).map((name) => {
					return(
						<div key={name}>
							<Button onClick={(e) => this.goToShopView(name)}>{name}</Button>
							<Button onClick={(e) => this.goToEditView(name)}>Edit</Button>
							<Button onClick={() => this.setState({deleteList: name})}>X</Button><br/>
						</div>
					);
				})}
				<Modal show={this.state.deleteList != null} onHide={this.closePopup.bind(this)}>
					<Modal.Header closeButton />
					<Modal.Body>
						<Button onClick={(e) => this.deleteList(this.state.deleteList)}>Delete List</Button>
					</Modal.Body>
				</Modal>
			</div>
		)
	}

	closePopup() {
		this.setState({deleteList: null});
	}

	deleteList(name) {
		var delList = {};
		delList[name] = null;
		firebase.database().ref("lists/" ).update(delList);
	}

	goToShopView(place) {
		this.props.history.push('/shopping-list/' + place);
	}

	goToEditView(place) {
		this.props.history.push('/make-list/' + place);
	}

}