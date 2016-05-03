import React from 'react';
import {container} from 're-app/lib/decorators';
import {Link} from 're-app/lib/components';

@container((state, props)=> {
	const username = props.routeParams.username;
	return {
		username,
		menuItems: [
			{
				title: 'Basic Info',
				location: {name: 'profile_basic_info', params: {username}}
			},
			{
				title: 'Sessions',
				location: {name: 'profile_sessions', params: {username}}
			}
		]
	};
})
export default class Profile extends React.Component {

	render() {
		const { username, menuItems, children } = this.props;
		return (
			<div className="Profile">
				<h1>Profile</h1>
				<pre>{JSON.stringify(username, null, 2)}</pre>
				<nav>
					<ul>
						{menuItems.map((item, idx) => {
							return (
								<li key={idx}>
									<Link to={item.location}>{item.title}</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				{children}
			</div>
		);
	}
}
