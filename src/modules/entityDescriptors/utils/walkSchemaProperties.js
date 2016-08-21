import { each, get as g } from 'lodash';

export default function walkSchemaProperties(schema, iteratee) {
	const properties = g(schema, 'properties', {});
	each(properties, iteratee);
	const allOf = g(schema, 'allOf');
	if (allOf) {
		each(allOf, (subSchema) => {
			walkSchemaProperties(subSchema, iteratee);
		});
	}
}
