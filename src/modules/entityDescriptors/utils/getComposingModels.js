import _ from 'lodash';

export default function getComposingModels(schema) {
	const modelName = _.get(schema, 'x-model');
	const result = modelName ? [modelName] : [];
	const allOf = _.get(schema, 'allOf');
	if (allOf) {
		return _.reduce(
			allOf,
			(currentModels, partialSchema) =>
				[...currentModels, ...getComposingModels(partialSchema)],
			result
		);
	}
	return result;
}
