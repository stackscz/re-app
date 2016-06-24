import React, { PropTypes as T } from 'react';
import Inspector from 'react-json-inspector';
import 'react-json-inspector/json-inspector.css';

export default class JsonInspector extends React.Component {

	static propTypes = {
		data: T.any.isRequired,
	};

	render() {
		return (
			<Inspector data={this.props.data} />
		);
	}
}
