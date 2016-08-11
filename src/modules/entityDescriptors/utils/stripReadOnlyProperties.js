import _ from 'lodash';
import getReadOnlyProperties from './getReadOnlyProperties';

export default function stripReadOnlyProperties(entity, schema) {
	return _.omit(entity, getReadOnlyProperties(schema));
	// return _.pickBy(entity, (fieldValue, fieldName) => {
	// 	const field = _.get(schema, ['properties', fieldName]);
	// 	return field && !field.readOnly;
	// });
}
