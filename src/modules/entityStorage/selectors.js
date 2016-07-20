import { getEntitySchemas } from 'modules/entityDescriptors/selectors';
import denormalize from 'modules/entityDescriptors/utils/denormalize';

export const getEntityGetter = (collectionName, id) => (state) => {
	const collection = state.entityStorage.collections[collectionName];
	if (!collection) {
		return undefined;
	}
	return collection[id];
};
export const getDenormalizedEntitySelector = (collectionName, id, maxLevel = 1) =>
	(state) => {
		const entityDictionary = state.entityStorage.collections;
		const entity = _.get(entityDictionary, [collectionName, id]);
		if (!collectionName || !id || !entity) {
			return undefined;
		}
		return denormalize(
			id,
			collectionName,
			entityDictionary,
			getEntitySchemas(state),
			maxLevel
		);
	}

export const getDenormalizedEntitiesSelector = (collectionName, entities, maxLevel = 1) =>
	(state) => {
		if (!entities) {
			return undefined;
		}
		return denormalize(
			entities,
			collectionName,
			state.entityStorage.collections,
			getEntitySchemas(state),
			maxLevel
		);
	};


export const getEntityStatusGetter = (collectionName, id) => (state) => {
	const statusesCollection = state.entityStorage.statuses[collectionName];
	if (!statusesCollection) {
		return undefined;
	}
	return statusesCollection[id];
};
