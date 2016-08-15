import _ from 'lodash';
import dereferenceSchema from './dereferenceSchema';

export default function getComposingModels(schema) {
	const dereferencedSchema = dereferenceSchema(schema);
	const modelName = _.get(dereferencedSchema, 'x-model');
	const result = modelName ? [modelName] : [];
	const allOf = _.get(dereferencedSchema, 'allOf');
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
