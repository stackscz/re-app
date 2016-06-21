import React, { PropTypes as T } from 'react';
import container from 're-app/lib/decorators/container';
import Link from 're-app/lib/components/Link';

@container(
	(state, ownProps) => {
		const username = ownProps.routeParams.username;
		return {
			username,
			menuItems: [
				{
					title: 'Basic Info',
					location: { name: 'profile_basic_info', params: { username } },
				},
				{
					title: 'Sessions',
					location: { name: 'profile_sessions', params: { username } },
				},
			],
		};
	}
)
export default class Profile extends React.Component {

	static propTypes = {
		username: T.string,
		menuItems: T.array,
		children: T.node,
	};

	render() {
		const { username, menuItems, children } = this.props;
		return (
			<div className="Profile">
				<h1>Profile</h1>
				<pre>{JSON.stringify(username, null, 2)}</pre>
				<nav>
					<ul>
						{menuItems.map((item, idx) => (
							<li key={idx}>
								<Link to={item.location}>{item.title}</Link>
							</li>
						))}
					</ul>
				</nav>
				{children}
			</div>
		);
	}
}
