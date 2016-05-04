import React from 'react';

import Markdown from 're-app-examples/Markdown';

export default class ExamplesHomeScreen extends React.Component {

	render() {
		return (
			<div className="container-fluid">
				<Markdown content={require('!!raw!./README.md')} />
			</div>
		);
	}
}
