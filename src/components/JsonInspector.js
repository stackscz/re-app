import React from 'react';
import Inspector from 'react-json-inspector';
import 'react-json-inspector/json-inspector.css';

export default class JsonInspector extends React.Component {

	static propTypes = {
		data: React.PropTypes.any.isRequired
	};

	render() {
		return (
			<Inspector data={this.props.data}/>
		);
	}
}
