import _ from 'lodash';

export default function stripReadOnlyProperties(entity, schema) {
	return _.pickBy(entity, (fieldValue, fieldName) => {
		const field = _.get(schema, ['fields', fieldName]);
		return field && !field.readOnly;
	});
}
