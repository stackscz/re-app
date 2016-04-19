/* eslint-disable */
import _ from 'lodash';
import React from 'react';
import { reduxForm } from 'redux-form';
import DynamicEntityFormField from 're-app/components/DynamicEntityFormField';
import DynamicEntityFormAssociationField from 're-app/components/DynamicEntityFormAssociationField';
import DynamicEntityFormFieldErrors from 're-app/components/DynamicEntityFormFieldErrors';
import JsonInspector from 're-app/components/JsonInspector';
import parseFormConfig from 're-app/utils/parseFormConfig';

export default class DynamicEntityForm extends React.Component {

	static propTypes = {
		fields: React.PropTypes.array.isRequired,
		entitySchema: React.PropTypes.object.isRequired,
		entitySchemas: React.PropTypes.object.isRequired,
		entityCollections: React.PropTypes.object.isRequired,
		onSubmit: React.PropTypes.func.isRequired,
		initialValue: React.PropTypes.object
	};

	static defaultProps = {
		initialValue: {}
	};

	render() {
		const { fields, initialValue, ...formProps } = this.props;
		const {fieldNames, ...reduxConfig} = parseFormConfig({fields});
		return (
			<Form {...reduxConfig} {...formProps} fieldNames={fieldNames} initialValues={initialValue}/>
		);
	}
}

@reduxForm({form: 'foo'})
class Form extends React.Component {

	render() {
		//const {fields: formFields, fieldNames, handleSubmit} = this.props;
		const {
			entitySchema,
			entitySchemas,
			entityCollections,
			fields,
			fieldNames,
			handleSubmit,
			submitFailed,
			remoteErrors
			} = this.props;


		return (
			<form onSubmit={handleSubmit}>
				{fieldNames.map((fieldName) => {
					const fieldSchema = entitySchema.fields[fieldName];
					const fieldErrors = fields[fieldName].error || [];
					const fieldRemoteErrors = remoteErrors[fieldName] || [];
					if (fieldSchema.type === 'association') {
						return (
							<div key={fieldName}>
								<DynamicEntityFormAssociationField schema={entitySchema.fields[fieldName]}
																   options={entityCollections[fieldSchema.collectionName]}
																   associationSchema={entitySchemas[fieldSchema.collectionName]}
																   controlProps={fields[fieldName]}/>
								{submitFailed && <DynamicEntityFormFieldErrors data={fieldErrors}/>}
								<DynamicEntityFormFieldErrors data={fieldRemoteErrors}/>
							</div>
						);
					} else {
						return (
							<div key={fieldName}>
								<DynamicEntityFormField schema={entitySchema.fields[fieldName]}
														controlProps={fields[fieldName]}/>
								{submitFailed && <DynamicEntityFormFieldErrors data={fieldErrors}/>}
								<DynamicEntityFormFieldErrors data={fieldRemoteErrors}/>
							</div>
						);
					}
				})}
				<button type="submit">Save</button>
			</form>
		)
	}
}
