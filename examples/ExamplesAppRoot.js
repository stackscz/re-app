import React, { PropTypes as T } from 'react';

import Link from 're-app/lib/components/Link';

const exampleGroups = ['utils', 'components', 'decorators', 'modules'];

export default class ExamplesAppRoot extends React.Component {

	static propTypes = {
		children: T.node,
	}

	render() {
		const { children } = this.props;
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container-fluid">
						<div className="navbar-header">
							<Link to={{ name: 'home' }} className="navbar-brand">
								<code>re-app</code> examples
							</Link>
						</div>
						<ul className="nav navbar-nav">
							{exampleGroups.map((group) => (
								<li key={group}>
									<Link onlyActiveOnIndex={false} to={{ name: 'example_group', params: { group } }}>
										{group}
									</Link>
								</li>
							))}
							<li><Link to={{ name: 'api_service_example' }}>ApiService</Link></li>
						</ul>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<a href="https://github.com/stackscz/re-app" target="_blank">
									<i className="fa fa-github" />&nbsp;Browse code on GitHub
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
