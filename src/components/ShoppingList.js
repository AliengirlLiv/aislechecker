import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import '../App.css';

export default class ShoppingList extends Component {

	render() {
		var list = this.getList(this.props.match.params.name);
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
														return(
															<div>
																<Button onClick={(e) => this.handleClick(e)} className="red">{item + " (Bin " + bin.key + ")"}</Button><br/>
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
				})}
			</div>
		)
	}


	keySort(a, b) {
		console.log("keysorgint!!!");
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