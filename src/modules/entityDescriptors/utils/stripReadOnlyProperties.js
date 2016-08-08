import _ from 'lodash';

export default function stripReadOnlyProperties(entity, definition) {
	return _.pickBy(entity, (fieldValue, fieldName) => {
		const field = _.get(definition, ['properties', fieldName]);
		return field && !field.readOnly;
	});
}
