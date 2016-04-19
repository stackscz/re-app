export const ENSURE_ENTITY_INDEX = 're-app/entityIndexes/ENSURE_ENTITY_INDEX';
export const CONFIRM_ENTITY_INDEX = 're-app/entityIndexes/CONFIRM_ENTITY_INDEX';
export const ENSURE_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/ENSURE_ENTITY_INDEX_FAILURE';

export const FETCH_ENTITY_INDEX = 're-app/entityIndexes/FETCH_ENTITY_INDEX';
export const RECEIVE_ENTITY_INDEX = 're-app/entityIndexes/RECEIVE_ENTITY_INDEX';
export const FETCH_ENTITY_INDEX_FAILURE = 're-app/entityIndexes/FETCH_ENTITY_INDEX_FAILURE';

// entity index
export function ensureEntityIndex(collectionName, filter) {
	return {type: ENSURE_ENTITY_INDEX, payload: {collectionName, filter}};
}

export function confirmEntityIndex(indexHash) {
	return {type: CONFIRM_ENTITY_INDEX, payload: {indexHash}};
}

export function ensureEntityIndexFailure(indexHash) {
	return {type: ENSURE_ENTITY_INDEX_FAILURE, payload: {indexHash}};
}

export function fetchEntityIndex(indexHash) {
	return {type: FETCH_ENTITY_INDEX, payload: {indexHash}};
}

export function receiveEntityIndex(indexHash, index, existingCount, validAtTime) {
	return {
		type: RECEIVE_ENTITY_INDEX,
		payload: {indexHash, index, existingCount, validAtTime}
	};
}

export function fetchEntityIndexFailure(indexHash, errors) {
	return {type: FETCH_ENTITY_INDEX_FAILURE, payload: {indexHash, errors}};
}
