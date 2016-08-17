export const ENSURE_ENTITY_INDEX = 're-app/entityIndexes/ENSURE_ENTITY_INDEX';
export function ensureEntityIndex(modelName, filter, force = false) {
	return { type: ENSURE_ENTITY_INDEX, payload: { modelName, filter, force } };
}

export const ATTEMPT_FETCH_ENTITY_INDEX = 're-app/entityIndexes/ATTEMPT_FETCH_ENTITY_INDEX';
export function attemptFetchEntityIndex(indexHash) {
	return { type: ATTEMPT_FETCH_ENTITY_INDEX, payload: { indexHash } };
}

export const RECEIVE_ENTITY_INDEX = 're-app/entityIndexes/RECEIVE_ENTITY_INDEX';
export function receiveEntityIndex(indexHash, content, existingCount, validAtTime) {
	return {
		type: RECEIVE_ENTITY_INDEX,
		payload: { indexHash, content, existingCount, validAtTime },
	};
}

export const RECEIVE_FETCH_ENTITY_INDEX_FAILURE =
	're-app/entityIndexes/RECEIVE_FETCH_ENTITY_INDEX_FAILURE';
export function fetchEntityIndexFailure(indexHash, error) {
	return { type: RECEIVE_FETCH_ENTITY_INDEX_FAILURE, payload: { indexHash, error } };
}

export const SET_LIMIT = 're-app/entityIndexes/SET_LIMIT';
export function setLimit(limit) {
	return { type: SET_LIMIT, payload: { limit } };
}
