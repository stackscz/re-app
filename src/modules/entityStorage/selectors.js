import _ from 'lodash';
import { getEntityDefinitions } from 'modules/entityDescriptors/selectors';
import denormalize from 'modules/entityDescriptors/utils/denormalize';

export const getEntitySelector = (modelName, id) => (state) => {
	const collection = state.entityStorage.collections[modelName];
	if (!collection) {
		return undefined;
	}
	return collection[id];
};
export const getDenormalizedEntitySelector = (modelName, id, maxLevel = 1) =>
	(state) => {
		const entityDictionary = state.entityStorage.collections;
		const entity = _.get(entityDictionary, [modelName, id]);
		if (!modelName || !id || !entity) {
			return undefined;
		}
		return denormalize(
			id,
			modelName,
			entityDictionary,
			getEntityDefinitions(state),
			maxLevel
		);
	};

export const getDenormalizedEntitiesSelector = (modelName, entities, maxLevel = 1) =>
	(state) => {
		if (!entities) {
			return undefined;
		}
		return denormalize(
			entities,
			modelName,
			state.entityStorage.collections,
			getEntityDefinitions(state),
			maxLevel
		);
	};


export const getEntityStatusGetter = (modelName, id) => (state) => {
	const statusesCollection = state.entityStorage.statuses[modelName];
	if (!statusesCollection) {
		return undefined;
	}
	return statusesCollection[id];
};
