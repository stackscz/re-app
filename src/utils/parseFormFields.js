/* eslint-disable */
import validatejs from 'validate.js';
import dot from 'dot-object';
import { typeInvariant } from 're-app/utils';
import t from 'tcomb';
import type FormField from 'types/FormField';

export default function parseFormFields(fields) {
	typeInvariant(fields, t.list(FormField));

	const internalConfig = {};
	var fieldValidationsConstraints = {};
	internalConfig.fields = fields.map((field) => {
		if (_.isObject(field)) {
			if (field.validations) {
				fieldValidationsConstraints[field.name] = field.validations;
			}
			return field.name;
		} else {
			return field;
		}
	});

	internalConfig.validate = values => {
		var errors = validatejs(values, fieldValidationsConstraints);
		if (errors) {
			dot.object(errors);
		}
		return errors || {};
	};

	return internalConfig;
}
