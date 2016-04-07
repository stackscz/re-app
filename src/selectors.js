export const getApiService = state => state.apiService;
export const getAuthContext = state => state.auth;
export const getUser = state => state.auth.user;
export const getEntityIndexGetter = (indexHash) => (state) => state.entityIndexes.indexes[indexHash];
export const getEntityGetter = (id) => (state) => state.entityIndexes.entities[id];
export const getEntitySchemas = (state) => state.entityDescriptors.schemas;
export const getEntitySchemaGetter = (collectionName) => (state) => state.entityDescriptors.schemas[collectionName];
export const getEntityMappingGetter = (collectionName) => (state) => state.entityDescriptors.mappings[collectionName];
