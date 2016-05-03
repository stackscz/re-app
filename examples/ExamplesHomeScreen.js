import React from 'react';

import { container } from 're-app/lib/decorators';

@container((state) => ({repository: state.repository}))
export default class ExamplesHomeScreen extends React.Component {

	render() {
		const { repository } = this.props;
		return (
			<div className="container-fluid">
				<p>
					<code>re-app</code> integrates several killer libraries into opinionated, terribly evil framework,
					to provide base needed for modern web application development.
				</p>
				<p>
					This website features usage examples of <code>re-app</code> library in form of sample applications.
					This very website itself is example of routing setup and can be found in <code>examples/ExamplesRouter.js</code>.
					Appception!
				</p>
				<p>Some integrated libs:</p>
				<ul>
					<li>
						<code>axios</code> for http
					</li>
					<li>
						<code>normalizr</code> and <code>denormalizr</code> for data normalization and denormalization
					</li>
					<li>
						<code>react</code> for view
					</li>
					<li>
						<code>react-router</code> for routing
					</li>
					<li>
						<code>redux</code> for app state
					</li>
					<li>
						<code>redux-saga</code> for side effects
					</li>
					<li>
						<a href={repository.rootUrl + 'package.json'} target="_blank">package.json</a>
					</li>
				</ul>
			</div>
		);
	}
}
