import React, { PropTypes as T } from 'react';
import JsonInspector from 're-app/lib/components/JsonInspector';

export default function LabeledJsonInspector(props) {
	const {
		title,
		data,
		} = props;
	return (
		<div className="LabeledArea panel panel-default">
			<div className="panel-heading">
				{title}
			</div>
			<div className="panel-body">
				<JsonInspector data={data} />
			</div>
		</div>
	);
}

LabeledJsonInspector.propTypes = {
	title: T.string.isRequired,
	data: T.any.isRequired,
};
