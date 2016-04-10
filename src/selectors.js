import { denormalize } from 'denormalizr';

export const getApiService = state => state.apiService;
export const getAuthContext = state => state.auth;
export const getUser = state => state.auth.user;
export const getEntityIndexGetter = (indexHash) => (state) => state.entityIndexes.indexes[indexHash];
export const getEntityGetter = (collectionName, id) => (state) => state.entityIndexes.entities[collectionName][id];
export const getDenormalizedEntityGetter = (collectionName, id) => {
	return (state) => {
		const entityDictionary = state.entityIndexes.entities[collectionName];
		const entityMapping = state.entityDescriptors.mappings[collectionName];
		return (entityDictionary && entityDictionary[id]) ? denormalize(entityDictionary[id], state.entityIndexes.entities, entityMapping) : null;
	};
};
export const getEntitySchemas = (state) => state.entityDescriptors.schemas;
export const getEntitySchemaGetter = (collectionName) => (state) => state.entityDescriptors.schemas[collectionName];
export const getEntityMappingGetter = (collectionName) => (state) => state.entityDescriptors.mappings[collectionName];
