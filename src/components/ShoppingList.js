import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import '../App.css';

export default class ShoppingList extends Component {

	render() {

		var list = this.getList(this.props.match.params.name);

		return(
			<div>
				{list.map((store, index) => {
					return(
						<div>
							<h2>{store.key}</h2>
							{store.val.map((aisle, index) => {
								return(
									<div>
										<h3>{aisle.key}</h3>
										{aisle.val.map((item, index) => {
											return(
												<div>
													<Button onClick={(e) => this.handleClick(e)} className="red">{item}</Button><br/>
												</div>
											);
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

	handleClick(e) {
		e.target.classList.toggle("red");
		e.target.classList.toggle("green");
	}

	getList(name) {
		if (this.props.lists[name]) {
			return this.props.lists[name];
		}
		return [];
	}
}