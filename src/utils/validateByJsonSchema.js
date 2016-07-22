import jsonschema from 'jsonschema';
import jsonSchemaDefaults from 'json-schema-defaults';
import dot from 'dot-object';
import mergeWithArrays from 'utils/mergeWithArrays';
import type { JsonSchema } from 'types/JsonSchema';
import type { FormErrorMessages } from 'types/FormErrorMessages.js';

export default function (
	values,
	schema: JsonSchema = {},
	errorMessages: FormErrorMessages = {},
) {
	const defaultValues = jsonSchemaDefaults(schema);
	const dataToValidate = mergeWithArrays({}, defaultValues, values);
	const validate = jsonschema.validate(dataToValidate, schema);
	const errors = validate.valid ?
		{}
		:
		dot.object(
			validate.errors.reduce((allErrs, err) => {
				const errorPath = (err.name === 'required' ?
					`${err.property}.${err.argument}`
					:
					err.property
				).replace('instance.', '');
				const errorMessage = dot.pick(`${errorPath}.${err.name}`, errorMessages)
					|| `Error: ${err.name}`;

				return mergeWithArrays(
					{},
					allErrs,
					{
						[errorPath]: [errorPath].errorMessage ?
							`${[errorPath].errorMessage} ${errorMessage}`
							:
							errorMessage,
					}
				);
			}, {})
		);

	return errors;
}
