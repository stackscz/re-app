export const getEntitySchemas = (state) => state.entityDescriptors.schemas;
export const getEntityFieldsets = (state) => state.entityDescriptors.fieldsets;
export const getEntitySchemaGetter = (collectionName) => (state) => state.entityDescriptors.schemas[collectionName];
export const getEntityMappingGetter = (collectionName) => (state) => state.entityDescriptors.mappings[collectionName];
