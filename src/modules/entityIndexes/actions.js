export const STORE_ENTITY_INDEX = 're-app/entityIndexes/STORE_ENTITY_INDEX';

export const ENSURE_ENTITY_INDEX = 're-app/entityIndexes/ENSURE_ENTITY_INDEX';
export const ENSURE_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_SUCCESS';
export const ENSURE_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_FAILURE';

export const FETCH_ENTITY_INDEX = 're-app/entityIndexes/FETCH_ENTITY_INDEX';
export const FETCH_ENTITY_INDEX_SUCCESS = 're-app/entityIndexes/FETCH_ENTITY_INDEX_SUCCESS';
export const FETCH_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/FETCH_ENTITY_INDEX_FAILURE';

export function storeEntityIndex(indexHash, index) {
	return {type: STORE_ENTITY_INDEX, payload: {indexHash, index}};
}

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

export function fetchEntityIndexSuccess(indexHash, index, existingCount) {
	return {
		type: FETCH_ENTITY_INDEX_SUCCESS,
		payload: {indexHash, index, existingCount}
	};
}

export function fetchEntityIndexFailure(indexHash, errors) {
	return {type: FETCH_ENTITY_INDEX_FAILURE, payload: {indexHash, errors}};
}
