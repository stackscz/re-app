import { denormalize } from 'denormalizr';
import { trimSchema } from 're-app/utils';
import { getEntityMappingGetter } from 're-app/modules/entityDescriptors/selectors';

export const getEntityGetter = (collectionName, id) => (state) => {
	const collection = state.entityStorage.collections[collectionName];
	if (!collection) {
		return undefined;
	}
	return collection[id];
};
export const getDenormalizedEntityGetter = (collectionName, id, maxLevel) => {
	return (state) => {
		const entityDictionary = state.entityStorage.collections[collectionName];
		const entityMapping = getEntityMappingGetter(collectionName)(state);
		let finalMapping = entityMapping;
		if (typeof maxLevel !== 'undefined') {
			finalMapping = trimSchema(entityMapping, maxLevel);
		}
		return (entityDictionary && entityDictionary[id]) ? denormalize(entityDictionary[id], state.entityStorage.collections, finalMapping) : null;
	};
};
export const getEntityStatusGetter = (collectionName, id) => (state) => {
	const statusesCollection = state.entityStorage.statuses[collectionName];
	if (!statusesCollection) {
		return undefined;
	}
	return statusesCollection[id];
};
