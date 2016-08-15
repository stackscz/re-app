import _ from 'lodash';
import getComposingModels from './getComposingModels';

export default function getDependentModels(modelName, definitions) {
	const result = [];

	_.each(definitions, (definition) => {
		const otherModelName = _.get(definition, 'x-model');
		if (otherModelName) {
			const composingModels = getComposingModels({
				$ref: `#/definitions/${otherModelName}`,
				definitions,
			});
			if (_.includes(composingModels, modelName)) {
				result.push(otherModelName);
			}
		}
	});

	return result;
}
