import React, { PropTypes as T } from 'react';
import { container } from 're-app/lib/decorators';

@container(
	(state, ownProps) => ({
		username: ownProps.params.username,
	})
)
export default class BasicInfo extends React.Component {

	static propTypes = {
		username: T.string,
	};

	render() {
		const { username } = this.props;
		return (
			<div className="BasicInfo">
				<h1>BasicInfo</h1>
				<pre>Username: {JSON.stringify(username, null, 2)}</pre>
			</div>
		);
	}
}
