import React from 'react';
import {container} from 're-app/decorators';

@container((state, props)=> {
	return {
		username: props.params.username
	};
})
export default class BasicInfo extends React.Component {

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
