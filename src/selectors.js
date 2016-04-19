import { denormalize } from 'denormalizr';
import { trimSchema } from 're-app/utils';

export const getApiService = state => state.apiService;
export const getAuthContext = state => state.auth;
export const getUser = state => state.auth.user;

export const getEntityIndexGetter = (indexHash) => (state) => state.entityIndexes.indexes[indexHash];

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
		const entityMapping = state.entityDescriptors.mappings[collectionName];
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


export const getEntitySchemas = (state) => state.entityDescriptors.schemas;
export const getEntitySchemaGetter = (collectionName) => (state) => state.entityDescriptors.schemas[collectionName];
export const getEntityMappingGetter = (collectionName) => (state) => state.entityDescriptors.mappings[collectionName];
export const getEntityEditorGetter = (editorHash) => (state) => state.entityEditors.editors[editorHash];
//export const getCurrentRouteGetter = (location) => (state) => state.entityEditors.editors[editorHash];
