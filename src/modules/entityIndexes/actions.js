export const ENSURE_ENTITY_INDEX = 're-app/entityIndexes/ENSURE_ENTITY_INDEX';
export const ENSURE_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_SUCCESS';
export const ENSURE_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_FAILURE';

export const FETCH_ENTITY_INDEX = 're-app/entityIndexes/FETCH_ENTITY_INDEX';
export const FETCH_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/FETCH_ENTITY_INDEX_SUCCESS';
export const FETCH_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/FETCH_ENTITY_INDEX_FAILURE';

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

export function ensureEntityIndexSuccess(collectionName, filter, entities) {
	return {type: ENSURE_ENTITY_INDEX_SUCCESS, payload: {collectionName, filter, entities}};
}

export function ensureEntityIndexFailure(collectionName, filter) {
	return {type: ENSURE_ENTITY_INDEX_FAILURE, payload: {collectionName, filter}};
}

export function fetchEntityIndex(collectionName, filter) {
	return {type: FETCH_ENTITY_INDEX, payload: {collectionName, filter}};
}

export function fetchEntityIndexSuccess(collectionName, filter, indexHash, entityMapping, existingCount, entities) {
	return {
		type: FETCH_ENTITY_INDEX_SUCCESS,
		payload: {collectionName, filter, indexHash, entityMapping, existingCount, entities}
	};
}

export function fetchEntityIndexFailure(collectionName, filter) {
	return {type: FETCH_ENTITY_INDEX_FAILURE, payload: {collectionName, filter}};
}


// single entity
export function ensureEntity(collectionName, id) {
	return {type: ENSURE_ENTITY, payload: {collectionName, id}};
}

export function ensureEntitySuccess(collectionName, id, entity) {
	return {type: ENSURE_ENTITY_SUCCESS, payload: {collectionName, id, entity}};
}

export function ensureEntityFailure(collectionName, id) {
	return {type: ENSURE_ENTITY_FAILURE, payload: {collectionName, id}};
}

export function fetchEntity(collectionName, id) {
	return {type: FETCH_ENTITY, payload: {collectionName, id}};
}

export function fetchEntitySuccess(collectionName, id, entityMapping, entity) {
	return {type: FETCH_ENTITY_SUCCESS, payload: {collectionName, id, entityMapping, entity}};
}

export function fetchEntityFailure(collectionName, id) {
	return {type: FETCH_ENTITY_FAILURE, payload: {collectionName, id}};
}
