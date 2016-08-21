import _, { get as g } from 'lodash';
import getComposingModels from './getComposingModels';

export default function getDependentModels(modelName, definitions) {
	const result = [];

	_.each(definitions, (definition) => {
		const otherModelName = _.get(definition, 'x-model');
		if (otherModelName) {
			const composingModels = getComposingModels(g(definitions, otherModelName));
			if (_.includes(composingModels, modelName)) {
				result.push(otherModelName);
			}
		}
	});

	return result;
}
