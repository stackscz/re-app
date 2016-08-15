import _ from 'lodash';
import dereferenceSchema from './dereferenceSchema';

export default function getIdPropertyName(schema) {
	const dereferencedSchema = dereferenceSchema(schema);
	const idPropertyName = _.get(dereferencedSchema, 'x-idPropertyName');
	if (idPropertyName) {
		return idPropertyName;
	}
	const allOf = _.get(dereferencedSchema, 'allOf');
	if (allOf) {
		return _.reduce(allOf, (currentIdPropertyName, partialSchema) => {
			if (currentIdPropertyName) {
				return currentIdPropertyName;
			}
			return getIdPropertyName(partialSchema);
		}, undefined);
	}
	return undefined;
}
