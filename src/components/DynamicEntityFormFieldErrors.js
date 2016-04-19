/* eslint-disable */
import React from 'react';
import Select from 're-app/components/Select';

export default class DynamicEntityFormFieldErrors extends React.Component {

	static propTypes = {
		data: React.PropTypes.array
	};

	static defaultProps = {
		data: []
	};

	render() {
		const { data } = this.props;
		return data.length ? (
			<pre>
				{data.map((error) => (<div key={error}>{error}</div>))}
			</pre>
		) : null;
	}
}
