export const ENSURE_ENTITY_INDEX = 're-app/entityIndexes/ENSURE_ENTITY_INDEX';
export const ENSURE_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_SUCCESS';
export const ENSURE_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_FAILURE';

export const FETCH_ENTITY_INDEX = 're-app/entityIndexes/FETCH_ENTITY_INDEX';
export const FETCH_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/FETCH_ENTITY_INDEX_SUCCESS';
export const FETCH_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/FETCH_ENTITY_INDEX_FAILURE';
export const RECEIVE_ENTITY_INDEX = 're-app/entityIndexes/RECEIVE_ENTITY_INDEX';

export const ENSURE_ENTITY = 're-app/entityIndexes/ENSURE_ENTITY';
export const ENSURE_ENTITY_SUCCESS = 're-app/entityIndexes/ENSURE_ENTITY_SUCCESS';
export const ENSURE_ENTITY_FAILURE = 're-app/entityIndexes/ENSURE_ENTITY_FAILURE';

export const FETCH_ENTITY = 're-app/entityIndexes/FETCH_ENTITY';
export const FETCH_ENTITY_SUCCESS = 're-app/entityIndexes/FETCH_ENTITY_SUCCESS';
export const FETCH_ENTITY_FAILURE = 're-app/entityIndexes/FETCH_ENTITY_FAILURE';

export const MERGE_ENTITY = 're-app/entityIndexes/MERGE_ENTITY';
export const MERGE_ENTITY_SUCCESS = 're-app/entityIndexes/MERGE_ENTITY_SUCCESS';
export const MERGE_ENTITY_FAILURE = 're-app/entityIndexes/MERGE_ENTITY_FAILURE';


// entity index
export function ensureEntityIndex(collectionName, filter) {
	return {type: ENSURE_ENTITY_INDEX, payload: {collectionName, filter}};
}

export function ensureEntityIndexSuccess(indexHash) {
	return {type: ENSURE_ENTITY_INDEX_SUCCESS, payload: {indexHash}};
}

export function ensureEntityIndexFailure(indexHash) {
	return {type: ENSURE_ENTITY_INDEX_FAILURE, payload: {indexHash}};
}

export function fetchEntityIndex(indexHash) {
	return {type: FETCH_ENTITY_INDEX, payload: {indexHash}};
}

export function fetchEntityIndexSuccess(indexHash, entityMapping, existingCount, entities) {
	return {
		type: FETCH_ENTITY_INDEX_SUCCESS,
		payload: {indexHash, entityMapping, existingCount, entities}
	};
}

export function fetchEntityIndexFailure(indexHash, errors) {
	return {type: FETCH_ENTITY_INDEX_FAILURE, payload: {indexHash, errors}};
}

// single entity
export function ensureEntity(collectionName, entityId) {
	return {type: ENSURE_ENTITY, payload: {collectionName, entityId}};
}

export function ensureEntitySuccess(collectionName, entityId, entity) {
	return {type: ENSURE_ENTITY_SUCCESS, payload: {collectionName, entityId, entity}};
}

export function ensureEntityFailure(collectionName, entityId) {
	return {type: ENSURE_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

export function fetchEntity(collectionName, entityId) {
	return {type: FETCH_ENTITY, payload: {collectionName, entityId}};
}

export function fetchEntitySuccess(collectionName, entityId, entityMapping, entity) {
	return {type: FETCH_ENTITY_SUCCESS, payload: {collectionName, entityId, entityMapping, entity}};
}

export function fetchEntityFailure(collectionName, entityId) {
	return {type: FETCH_ENTITY_FAILURE, payload: {collectionName, entityId}};
}
