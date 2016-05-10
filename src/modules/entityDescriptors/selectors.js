import _ from 'lodash';

export const getEntitySchemas = (state) => state.entityDescriptors ? state.entityDescriptors.schemas : undefined;
export const getEntityFieldsets = (state) => state.entityDescriptors ? state.entityDescriptors.fieldsets : undefined;
export const getEntitySchemaGetter = (collectionName) => (state) => {
	return _.get(state, ['entityDescriptors', 'schemas', collectionName]);
};
export const getEntityMappingGetter = (collectionName) => (state) => {
	return _.get(state, ['entityDescriptors', 'mappings', collectionName]);
};
