import React from 'react';
import {Link, Btn, BackBtn, DevTools} from 're-app/components';

var menuItems = [
	{
		title: 'Dashboard',
		location: {name: 'dashboard', query: {param: 'foo'}}
	},
	{
		title: 'Profile',
		location: {name: 'profile_basic_info', params: {username: 'foobar'}, query: {param: 'bar'}}
	},
	{
		title: 'Listing',
		location: {name: 'listing'}
	}
];

export default class Layout extends React.Component {

	static contextTypes = {
		store: React.PropTypes.object
	};

	render() {
		return (
			<div className="Layout">
				<h1>My Awesome App</h1>
				<nav>
					<ul>
						<li><BackBtn>Back</BackBtn></li>
						{menuItems.map((item, idx) => {
							return (
								<li key={idx}>
									<Link to={item.location} onlyActiveOnIndex={idx === 0}>{item.title}</Link>
								</li>
							)
						})}
					</ul>
				</nav>
				<div>
					{this.props.children}
				</div>
				<pre>{JSON.stringify(this.context.store.getState(), null, 2)}</pre>
				<DevTools />
			</div>
		);
	}
}
