export const LOAD_ENTITY = 're-app/entityEditors/LOAD_ENTITY';
export const LOAD_ENTITY_SUCCESS = 're-app/entityEditors/LOAD_ENTITY_SUCCESS';
export const LOAD_ENTITY_FAILURE = 're-app/entityEditors/LOAD_ENTITY_FAILURE';

export const MERGE_ENTITY = 're-app/entityEditors/MERGE_ENTITY';

export function loadEntity(collectionName, entityId) {
	return {type: LOAD_ENTITY, payload: {collectionName, entityId}};
}

export function loadEntitySuccess(collectionName, entityId, entity) {
	return {type: LOAD_ENTITY_SUCCESS, payload: {collectionName, entityId, entity}};
}

export function loadEntityFailure(collectionName, entityId) {
	return {type: LOAD_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

export function mergeEntity(collectionName, data) {
	return {type: MERGE_ENTITY, payload: {collectionName, data}};
}
