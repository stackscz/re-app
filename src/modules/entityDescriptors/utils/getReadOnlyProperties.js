/* eslint-disable no-param-reassign */
import _ from 'lodash';
import dereferenceSchema from './dereferenceSchema';

function visitSchema(schema, readOnlyProperties) {
	const properties = _.get(schema, 'properties');
	const schemaReadOnlyProperties = _.pickBy(properties, (prop) => prop.readOnly);
	_.each(schemaReadOnlyProperties, (prop, propName) => {
		readOnlyProperties[propName] = true;
	});
	const allOf = _.get(schema, 'allOf');
	if (allOf) {
		_.each(allOf, (partialSchema) => {
			visitSchema(partialSchema, readOnlyProperties);
		});
	}
}

export default function getReadOnlyProperties(schemaWithReferences) {
	const schema = dereferenceSchema(schemaWithReferences);
	const readOnlyProperties = {};
	visitSchema(schema, readOnlyProperties);
	return _.keys(readOnlyProperties);
}
