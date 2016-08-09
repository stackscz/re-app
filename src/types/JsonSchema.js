// @flow

import { $Refinement } from 'tcomb';
import { Validator } from 'jsonschema';
import metaschema from 'jsonschema/schema/draft-04/schema.json';
const v = new Validator;
v.addSchema(metaschema);

const isJSONSchema = (x) => { // eslint-disable-line
	// TODO validate JSON Schema
	const errors = [];
	// const errors = v.validate(x, metaschema).errors;
	if (errors.length) {
		const errorMessage = errors.map(
			(error, key) =>
				`${key + 1}: ${error.property} = ${JSON.stringify(error.instance)} ${error.message}`
		).join('\n\n');
		throw new TypeError(`Type validation failed: \n\n${errorMessage}`);
	}
	return true;
};

export type JsonSchema = Object & $Refinement<typeof isJSONSchema>;
