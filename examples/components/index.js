import React, { PropTypes as T } from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';

export default class ComponentsExamples extends React.Component {

	static propTypes = {
		children: T.node,
		groupLinks: T.any,
	}

	render() {
		const { children, groupLinks } = this.props;
		return (
			<div className="container-fluid">
				<h1>Components</h1>
				<Markdown content={require('!!raw!./README.md')} />
				<ExampleGroup tabLinks={groupLinks}>
					{children}
				</ExampleGroup>
			</div>
		);
	}
}
