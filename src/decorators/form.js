/* eslint-disable */
import React from 'react';
import {reduxForm} from 'redux-form';
import validate from 'validate.js';
import dot from 'dot-object';

/**
 * Wraps component with redux-form enhanced with validation
 *
 */
export default function form(config, mapStateToProps, mapDispatchToProps, mergeProps, options) {

	const internalConfig = config ? {...config} : {};
	if (!internalConfig.form) {
		internalConfig.form = Math.random().toString();
	}

	// TODO parse validation

	var fieldValidationsConstraints = {};
	internalConfig.fields = internalConfig.fields.map((field) => {
		if (_.isObject(field)) {
			if (field.validations) {
				fieldValidationsConstraints[field.name] = field.validations;
			}
			return field.name;
		} else {
			return field;
		}
	});

	const reduxFormValidate = values => {
		var errors = validate(values, fieldValidationsConstraints);
		if (errors) {
			dot.object(errors);
		}
		return errors || {};
	};
	internalConfig.validate = reduxFormValidate;


	return function wrapWithForm(WrappedComponent) {
		@reduxForm(internalConfig, mapStateToProps, mapDispatchToProps, mergeProps, options)
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
