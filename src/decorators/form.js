import React from 'react';
import { reduxForm } from 'redux-form';
import jsonSchemaDefaults from 'json-schema-defaults';
import validateByJsonSchema from 'utils/validateByJsonSchema';
import mergeWithArrays from 'utils/mergeWithArrays';

/**
 * Wraps component with redux-form enhanced with JSON schema validation
 *
 */
export default function form({
	schema = {},
	errorMessages = {},
	validate: userValidate,
	initialValues: userInitialValues,
	...config,
} = {}) {
	const initialValues = mergeWithArrays({}, jsonSchemaDefaults(schema), userInitialValues);
	const validate = (values, props) => {

		const {
			schema: propsSchema,
			errorMessages: propsErrorMessages,
		} = props;

		const validateJsonSchemaErrors = validateByJsonSchema(
			values,
			propsSchema || schema,
			propsErrorMessages || errorMessages
		);
		const userValidateErrors = userValidate ?
			userValidate(values, props) : {};

		return mergeWithArrays({}, validateJsonSchemaErrors, userValidateErrors);
	};

	return function wrapWithForm(WrappedComponent) {
		@reduxForm({ ...config, validate, initialValues })
		class FormContainer extends React.Component {
			render() {
				return (
					<WrappedComponent {...this.props} />
				);
			}
		}
		return FormContainer;
	};
}
