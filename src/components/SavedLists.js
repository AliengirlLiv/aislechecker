import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

export default class SavedLists extends Component {
	render() {

		console.log("LISTS", this.props.lists);

		return(
			<div>
				{Object.keys(this.props.lists).map((name) => {
					return(
						<div>
							<Button onClick={(e) => this.goToShopView(name)}>{name}</Button><br/>
						</div>
					);
				})}
			</div>
		)
	}

	goToShopView(place) {
		this.props.history.push('/shopping-list/' + place);
	}

}