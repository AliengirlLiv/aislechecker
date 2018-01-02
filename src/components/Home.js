import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class Home extends Component {

	render() {
		return (
			<div>
				<Link to='/all-items'>All Items</Link>
				<br/>
				<Link to='/make-list'>Make List</Link>
				<br/>
				<Link to='/saved-lists'>Saved Lists</Link>
			</div>
		)
	}
}