import React from 'react';
import {container} from 're-app/lib/decorators';

@container((state, props)=> {
	return {
		username: props.params.username
	};
})
export default class Sessions extends React.Component {

	render() {
		return (
			<div className="Sessions">
				<h1>Sessions</h1>
				<pre>sessions content</pre>
			</div>
		);
	}
}
