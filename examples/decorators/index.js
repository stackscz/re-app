import React, { PropTypes as T } from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';
import generateTabLinks from '../generateTabLinks';

export default class DecoratorsExamples extends React.Component {

	static propTypes = {
		children: T.node,
	}

	render() {
		const { children } = this.props;
		const tabLinks = generateTabLinks('decorators', [
			'app',
			'container',
			'router',
			'blissComponent',
			'form',
		]);
		return (
			<div className="container-fluid">
				<h1>Decorators</h1>
				<Markdown content={require('!!raw!./README.md')} />
				<ExampleGroup tabLinks={tabLinks}>
					{children}
				</ExampleGroup>
			</div>
		);
	}
}
