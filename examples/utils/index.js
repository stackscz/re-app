import React, { PropTypes as T } from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';

export default class UtilsExamples extends React.Component {

	static propTypes = {
		children: T.node,
	}

	render() {
		const { children } = this.props;
		return (
			<div className="container-fluid">
				<h1>Utils and Factories</h1>
				<Markdown content={require('!!raw!./README.md')} />
				<ExampleGroup tabLinks={[]}>
					{children}
				</ExampleGroup>
			</div>
		);
	}
}
