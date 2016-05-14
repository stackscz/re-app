/* eslint-disable */
import _ from 'lodash';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import DynamicEntityFormField from 're-app/components/DynamicEntityFormField';
import DynamicEntityFormAssociationField from 're-app/components/DynamicEntityFormAssociationField';
import DynamicEntityFormFieldErrors from 're-app/components/DynamicEntityFormFieldErrors';
import JsonInspector from 're-app/components/JsonInspector';
import parseFormFields from 're-app/utils/parseFormFields';

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
		const { fields: fieldDefinitions, initialValue, ...formProps } = this.props;
		const {fields, validate} = parseFormFields(fieldDefinitions);
		return (
			<Form fields={fields} validate={validate} initialValues={initialValue} {...formProps}/>
		);
	}
}

@reduxForm()
class Form extends React.Component {

	render() {
		//const {fields: formFields, fieldNames, handleSubmit} = this.props;
		const {
			entitySchema,
			fields,
			handleSubmit,
			submitFailed,
			remoteErrors
			} = this.props;

		return (
			<form onSubmit={handleSubmit}>
				{fields.map((fieldName) => {
					const fieldSchema = entitySchema.fields[fieldName];
					//const fieldErrors = fields[fieldName].error || [];
					//const fieldRemoteErrors = remoteErrors[fieldName] || [];
					if (fieldSchema.type === 'association') {

						return (
							<Field name={fieldName}
								   key={fieldName}
								   component={DynamicEntityFormAssociationField}
								   schema={entitySchema.fields[fieldName]}
							/>
						);

						//return (
						//	<div key={fieldName}>
						//		<DynamicEntityFormAssociationField schema={entitySchema.fields[fieldName]}
						//										   options={entityCollections[fieldSchema.collectionName]}
						//										   associationSchema={entitySchemas[fieldSchema.collectionName]}
						//										   controlProps={fields[fieldName]}/>
						//	</div>
						//);
					} else {
						return (
							<Field name={fieldName} key={fieldName} component={(fieldProps) => {
								return (
									<DynamicEntityFormField schema={entitySchema.fields[fieldName]}
															controlProps={fieldProps}/>
								);
							}}/>
						);

						//return (
						//	<div key={fieldName}>
						//		<DynamicEntityFormField schema={entitySchema.fields[fieldName]}
						//								controlProps={fields[fieldName]}/>
						//	</div>
						//);
					}
				})}
				<button className="btn btn-success" type="submit">Save</button>
			</form>
		)
	}
}


//{submitFailed && <DynamicEntityFormFieldErrors data={fieldErrors}/>}
//<DynamicEntityFormFieldErrors data={fieldRemoteErrors}/>

//		{submitFailed && <DynamicEntityFormFieldErrors data={fieldErrors}/>}
//		<DynamicEntityFormFieldErrors data={fieldRemoteErrors}/>
