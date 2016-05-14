/* eslint-disable */
import React from 'react';
import Select from 're-app/components/Select';
import _ from 'lodash';
import { container } from 're-app/decorators';

@container(
	(state, props) => {
		const { schema } = props;
		const associationSchema = state.entityDescriptors.schemas[schema.collectionName];
		const options = state.entityStorage.collections[schema.collectionName];
		return {
			options: options ? _.values(options):[],
			schema,
			associationSchema
		}
	}
)
export default class DynamicEntityFormAssociationField extends React.Component {

	static propTypes = {
		schema: React.PropTypes.object.isRequired,
		options: React.PropTypes.array,
		associationSchema: React.PropTypes.object.isRequired
	};

	static defaultProps = {
		options: []
	};

	_renderFieldControl() {
		const { schema, associationSchema, options, ...controlProps } = this.props;
		//let associationOptions = options ? _.values(options) : [];
		return (
			<Select {...controlProps} multiple={schema.isMultiple}
									  options={options}
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
