import React from 'react';
import { JsonInspector } from 're-app/lib/components';

export default class LabeledJsonInspector extends React.Component {

	static propTypes = {
		title: React.PropTypes.string.isRequired,
		data: React.PropTypes.any.isRequired
	};

	render() {
		const { title, data } = this.props;
		return (
			<div className="LabeledArea panel panel-default">
				<div className="panel-heading">
					{ title }
				</div>
				<div className="panel-body">
					<JsonInspector data={data} />
				</div>
			</div>
		);
	}
}
