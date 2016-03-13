import React from 'react';
import {container} from 're-app/decorators';

export default class Listing extends React.Component {

	render() {
		return (
			<div className="Listing">
				<h1>Listing</h1>
				<pre>{JSON.stringify(this.props, null, 2)}</pre>
			</div>
		);
	}
}
