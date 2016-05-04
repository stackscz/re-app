import React from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';
import generateTabLinks from '../generateTabLinks';

export default class DecoratorsExamples extends React.Component {

	render() {
		const { children } = this.props;
		return (
			<div className="container-fluid">
				<h1>Decorators</h1>
				<Markdown content={require('!!raw!./README.md')}/>
				<ExampleGroup
					tabLinks={generateTabLinks('decorators', ['app', 'container', 'router', 'blissComponent'])}>
					{ children }
				</ExampleGroup>
			</div>
		);
	}
}
