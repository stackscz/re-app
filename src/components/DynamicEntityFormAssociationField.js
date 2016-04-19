/* eslint-disable */
import React from 'react';
import Select from 're-app/components/Select';
import _ from 'lodash';

export default class DynamicEntityFormAssociationField extends React.Component {

	static propTypes = {
		schema: React.PropTypes.object.isRequired,
		options: React.PropTypes.object,
		controlProps: React.PropTypes.object.isRequired
	};

	_renderFieldControl() {
		const { schema, associationSchema, options, controlProps } = this.props;
		let associationOptions = options ? _.values(options) : [];
		return (
			<Select {...controlProps} multiple={schema.isMultiple}
									  options={associationOptions}
									  optionIdProp={associationSchema.idFieldName}
									  optionLabelProp={associationSchema.displayFieldName}
									  optionValueProp={associationSchema.idFieldName}/>
		);
	}

	render() {

		const { schema } = this.props;

		return (
			<div>
				<label>
					<div>
						{schema.label}
					</div>
					<div>
						{this._renderFieldControl()}
					</div>
				</label>
			</div>
		);
	}
}
