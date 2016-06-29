import React, { PropTypes as T } from 'react';
import BackBtn from 're-app/lib/components/BackBtn';
import Link from 're-app/lib/components/Link';

import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app-examples/DevTools';

const menuItems = [
	{
		title: 'Dashboard',
		location: { name: 'dashboard', query: { param: 'foo' } },
	},
	{
		title: 'Profile',
		location: {
			name: 'profile_basic_info',
			params: { username: 'foobar' },
			query: { param: 'bar' },
		},
	},
	{
		title: 'Listing',
		location: { name: 'listing' },
	},
];

export default class Layout extends React.Component {

	static propTypes = {
		children: T.node,
	};

	static contextTypes = {
		store: T.object,
	};

	render() {
		const state = this.context.store.getState();
		const locationBeforeTransitions = state.reduxRouting.locationBeforeTransitions;
		const url = `${locationBeforeTransitions.pathname}${locationBeforeTransitions.search}`;
		return (
			<div className="Layout">
				<div className="form-group">
					<div className="input-group">
						<span className="input-group-addon">current path:</span>
						<input
							type="text"
							className="form-control"
							disabled
							value={url}
						/>
					</div>
				</div>
				<div className="panel panel-default">
					<div className="panel-body">
						<h1>My Awesome App</h1>
						<nav>
							<ul>
								<li>
									<BackBtn className="btn btn-xs btn-default">
										<i className="fa fa-arrow-left" />
										Back
									</BackBtn>
								</li>
								{menuItems.map((item, idx) => (
									<li key={idx}>
										<Link to={item.location} onlyActiveOnIndex={idx === 0}>{item.title}</Link>
									</li>
								))}
							</ul>
						</nav>
						<div>
							{this.props.children}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<LabeledArea title="Complete app state">
							<pre>{JSON.stringify(this.context.store.getState(), null, 2)}</pre>
						</LabeledArea>
					</div>
					<div className="col-xs-6">
						<LabeledArea title="Redux action log">
							<DevTools />
						</LabeledArea>
					</div>
				</div>
			</div>
		);
	}
}
