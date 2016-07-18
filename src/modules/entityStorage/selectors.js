import { getEntitySchemas } from 'modules/entityDescriptors/selectors';
import denormalize from 'modules/entityDescriptors/utils/denormalize';

export const getEntityGetter = (collectionName, id) => (state) => {
	const collection = state.entityStorage.collections[collectionName];
	if (!collection) {
		return undefined;
	}
	return collection[id];
};
export const getDenormalizedEntityGetter = (collectionName, id, maxLevel) =>
	(state) =>
		denormalize(
			id,
			collectionName,
			state.entityStorage.collections,
			getEntitySchemas(state),
			maxLevel
		);

export const getDenormalizedEntitiesSelector = (collectionName, entities, maxLevel = 1) =>
	(state) => {
		if (typeof entities === 'undefined') {
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
