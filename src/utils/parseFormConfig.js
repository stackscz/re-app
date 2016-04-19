import validate from 'validate.js';
import dot from 'dot-object';

export default function parseFormConfig(config) {

	const internalConfig = config ? {...config} : {};
	//if (!internalConfig.form) {
	//	internalConfig.form = Math.random().toString();
	//}

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
	const fieldNames = internalConfig.fields.map((field) => {
		if (_.isObject(field)) {
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
	internalConfig.fieldNames = fieldNames;

	return internalConfig;
}
