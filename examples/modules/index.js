import React from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';
import generateTabLinks from '../generateTabLinks';

export default class ModulesExamples extends React.Component {

	render() {
		const { children } = this.props;
		return (
			<div className="container-fluid">
				<h1>Modules</h1>
				<Markdown content={require('!!raw!./README.md')} />
				<ExampleGroup tabLinks={generateTabLinks('modules', ['api', 'auth'])}>
					{ children }
				</ExampleGroup>
			</div>
		);
	}
}
