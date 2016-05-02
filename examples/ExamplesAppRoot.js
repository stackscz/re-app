import React from 'react';

import Link from 're-app/components/Link';

export default class ExamplesAppRoot extends React.Component {

	render() {
		const { children } = this.props;
		return (
			<div>
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<Link to={{name: 'home'}} className="navbar-brand">
								<code>re-app</code> examples
							</Link>
						</div>
						<ul className="nav navbar-nav">
							<li><Link to={{name: 'example_group', params: {group: 'utils'}}}>Utils and Factories</Link></li>
							<li><Link to={{name: 'example_group', params: {group: 'components'}}}>Components</Link></li>
							<li><Link to={{name: 'example_group', params: {group: 'decorators'}}}>Decorators</Link></li>
							<li><Link to={{name: 'example_group', params: {group: 'modules'}}}>Modules</Link></li>
						</ul>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<a href="https://github.com/stackscz/re-app" target="_blank">
									<i className="fa fa-github"/>&nbsp;Browse code on GitHub
								</a>
							</li>
						</ul>
					</div>
				</nav>
				<div className="container-fluid">
					{children}
				</div>
			</div>
		);
	}
}
