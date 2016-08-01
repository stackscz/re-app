import React, { PropTypes as T } from 'react';

import ExampleGroup from '../ExampleGroup';
import Markdown from 're-app-examples/Markdown';
import CodeArea from 're-app-examples/CodeArea';
import generateTabLinks from '../generateTabLinks';

export default class ModulesExamples extends React.Component {

	static propTypes = {
		children: T.node,
	}

	render() {
		const { children } = this.props;
		const tabLinks = generateTabLinks('modules', [
			'routing',
			'api',
			'entityDescriptors',
			'entityStorage',
			'entityIndexes',
			'auth',
		]);
		return (
			<div className="container-fluid">
				<h1>Modules</h1>
				<Markdown content={require('!!raw!./README.md')} />
				<ExampleGroup tabLinks={tabLinks}>
					{
						children ||
						(
							<div className="panel">
								<div className="panel-body">
									<CodeArea title="Module structure" code={require('!!raw!./module-structure')} />
									<CodeArea
										title="Using module in app"
										code={require('!!raw!./module-usage-example')}
									/>
								</div>
							</div>
						)
					}
				</ExampleGroup>
			</div>
		);
	}
}
