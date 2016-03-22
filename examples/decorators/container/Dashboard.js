import React from 'react';
import {container} from 're-app/decorators';

@container(
	state => ({data: state.someDataSlice}),
	dispatch => ({
		addItem: () => dispatch({type: 'ADD_ITEM'})
	})
)
export default class Dashboard extends React.Component {

	render() {
		return (
			<div className="Dashboard">
				<h1>My awesome app</h1>
				<button onClick={this.props.addItem.bind(this)}>Add item</button>
				<pre>{JSON.stringify(this.props.data, null, 2)}</pre>
			</div>
		);
	}
}
