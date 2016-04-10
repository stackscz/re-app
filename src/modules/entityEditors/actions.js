export const LOAD_ENTITY = 're-app/entityEditors/LOAD_ENTITY';
export const LOAD_ENTITY_SUCCESS = 're-app/entityEditors/LOAD_ENTITY_SUCCESS';
export const LOAD_ENTITY_FAILURE = 're-app/entityEditors/LOAD_ENTITY_FAILURE';

export function loadEntity(collectionName, entityId) {
	return {type: LOAD_ENTITY, payload: {collectionName, entityId}};
}

export function loadEntitySuccess(collectionName, entityId, entity) {
	return {type: LOAD_ENTITY_SUCCESS, payload: {collectionName, entityId, entity}};
}

export function loadEntityFailure(collectionName, entityId) {
	return {type: LOAD_ENTITY_FAILURE, payload: {collectionName, entityId}};
}
