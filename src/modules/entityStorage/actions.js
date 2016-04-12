export const STORE_ENTITIES = 're-app/entityStorage/STORE_ENTITIES';

export const ENSURE_ENTITY = 're-app/entityStorage/ENSURE_ENTITY';
export const ENSURE_ENTITY_SUCCESS = 're-app/entityStorage/ENSURE_ENTITY_SUCCESS';
export const ENSURE_ENTITY_FAILURE = 're-app/entityStorage/ENSURE_ENTITY_FAILURE';

export const FETCH_ENTITY = 're-app/entityStorage/FETCH_ENTITY';
export const FETCH_ENTITY_SUCCESS = 're-app/entityStorage/FETCH_ENTITY_SUCCESS';
export const FETCH_ENTITY_FAILURE = 're-app/entityStorage/FETCH_ENTITY_FAILURE';

export const MERGE_ENTITY = 're-app/entityStorage/MERGE_ENTITY';

export const PERSIST_ENTITY = 're-app/entityStorage/PERSIST_ENTITY';
export const PERSIST_ENTITY_SUCCESS = 're-app/entityStorage/PERSIST_ENTITY_SUCCESS';
export const PERSIST_ENTITY_FAILURE = 're-app/entityStorage/PERSIST_ENTITY_FAILURE';


export function storeEntities(normalizedEntities) {
	return {type: STORE_ENTITIES, payload: {normalizedEntities}};
}

// single entity
export function ensureEntity(collectionName, entityId) {
	return {type: ENSURE_ENTITY, payload: {collectionName, entityId}};
}

export function ensureEntitySuccess(collectionName, entityId) {
	return {type: ENSURE_ENTITY_SUCCESS, payload: {collectionName, entityId}};
}

export function ensureEntityFailure(collectionName, entityId) {
	return {type: ENSURE_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

export function fetchEntity(collectionName, entityId) {
	return {type: FETCH_ENTITY, payload: {collectionName, entityId}};
}

export function fetchEntitySuccess(collectionName, entityId) {
	return {type: FETCH_ENTITY_SUCCESS, payload: {collectionName, entityId}};
}

export function fetchEntityFailure(collectionName, entityId) {
	return {type: FETCH_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

export function mergeEntity(collectionName, entity) {
	return {type: MERGE_ENTITY, payload: {collectionName, entity}};
}

export function persistEntity(entitySchema, data) {
	return {type: PERSIST_ENTITY, payload: {entitySchema, data}};
}

export function persistEntitySuccess(collectionName, entity) {
	return {type: PERSIST_ENTITY_SUCCESS, payload: {collectionName, entity}};
}

export function persistEntityFailure(collectionName, entity) {
	return {type: PERSIST_ENTITY_FAILURE, payload: {collectionName, entity}};
}
