import _ from 'lodash';
import dereferenceSchema from './dereferenceSchema';

export default function getIdPropertyName(schema) {
	const idPropertyName = _.get(dereferenceSchema(schema), 'x-idPropertyName');
	if (idPropertyName) {
		return idPropertyName;
	}
	const allOf = _.get(schema, 'allOf');
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
