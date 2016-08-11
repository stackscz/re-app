/* eslint-disable max-len */
/**
 * Load entity into storage from remote when needed.
 *
 * @param modelName
 * @param entityId
 */
export const ENSURE_ENTITY = 're-app/entityStorage/ENSURE_ENTITY';
export function ensureEntity(modelName, where) {
	return { type: ENSURE_ENTITY, payload: { modelName, where } };
}

/**
 * Request single entity from remote
 */
export const ATTEMPT_FETCH_ENTITY = 're-app/entityStorage/ATTEMPT_FETCH_ENTITY';
export function attemptFetchEntity(modelName, where) {
	return { type: ATTEMPT_FETCH_ENTITY, payload: { modelName, where } };
}

/**
 * Receive error response
 *
 */
export const RECEIVE_FETCH_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_FETCH_ENTITY_FAILURE';
export function receiveFetchEntityFailure(modelName, where, error) {
	return { type: RECEIVE_FETCH_ENTITY_FAILURE, payload: { modelName, where, error } };
}

/**
 * Receive normalized entities from remote
 *
 * @example
 *
 *    receiveEntities(
 *      {
 * 			posts: {
 * 				1: {
 * 					title: 'Title 1'
 *		 		},
 * 				2: {
 * 					title: 'Title 2'
 *	 			},
 *	 		},
 *	 		tags: {
 * 				5: {
 * 					title: 'Tag 5'
 *	 			}
 *		 	}
 * 		},
 *        "2016-07-14T00:00:00.000+02:00"
 *    )
 *
 * @param {object} normalizedEntities
 * @param {string} validAtTime
 *
 * @type {object}
 */
export const RECEIVE_ENTITIES = 're-app/entityStorage/RECEIVE_ENTITIES';
export function receiveEntities(refs, normalizedEntities, validAtTime) {
	return { type: RECEIVE_ENTITIES, payload: { refs, normalizedEntities, validAtTime } };
}

/**
 * Create or update persistent entity in specified collection
 *
 * - merge data to collection store
 * - set status to transient: true when entity does not exist in storage or is transient
 */
export const MERGE_ENTITY = 're-app/entityStorage/MERGE_ENTITY';
export function mergeEntity(modelName, where, data, noInteraction = false) {
	return { type: MERGE_ENTITY, payload: { modelName, where, data, noInteraction } };
}

/**
 * Request remote for entity persistence, actor is responsible for providing non-colliding entityId
 */
export const PERSIST_ENTITY = 're-app/entityStorage/PERSIST_ENTITY';
export function persistEntity(modelName, entityId, where, entity, noInteraction = false) {
	return { type: PERSIST_ENTITY, payload: { modelName, entityId, where, entity, noInteraction } };
}

/**
 * Acknowledge that entity was successfully persisted to remote and receive resulting entities
 *
 * - replace transient entity id in storage
 * - set status to transient: false
 */
export const RECEIVE_PERSIST_ENTITY_SUCCESS = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_SUCCESS';
export function receivePersistEntitySuccess(modelName, entityId, normalizedEntities, transientEntityId, validAtTime) {
	return {
		type: RECEIVE_PERSIST_ENTITY_SUCCESS,
		payload: { modelName, entityId, normalizedEntities, transientEntityId, validAtTime },
	};
}

/**
 * Acknowledge that request for entity persistence failed
 *
 * - set entity status, errors
 */
export const RECEIVE_PERSIST_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_FAILURE';
export function receivePersistEntityFailure(modelName, entityId, error) {
	return {
		type: RECEIVE_PERSIST_ENTITY_FAILURE,
		payload: { modelName, entityId, error },
	};
}

/**
 * Request entity removal from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export const DELETE_ENTITY = 're-app/entityStorage/DELETE_ENTITY';
export function deleteEntity(modelName, entityId) {
	return { type: DELETE_ENTITY, payload: { modelName, entityId } };
}

/**
 * Acknowledge that entity was deleted from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export const RECEIVE_DELETE_ENTITY_SUCCESS = 're-app/entityStorage/RECEIVE_DELETE_ENTITY_SUCCESS';
export function receiveDeleteEntitySuccess(modelName, entityId) {
	return { type: RECEIVE_DELETE_ENTITY_SUCCESS, payload: { modelName, entityId } };
}

/**
 * Acknowledge that entity could not be deleted from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export const RECEIVE_DELETE_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_DELETE_ENTITY_FAILURE';
export function receiveDeleteEntityFailure(modelName, entityId) {
	return { type: RECEIVE_DELETE_ENTITY_FAILURE, payload: { modelName, entityId } };
}

/**
 * Remove entity from storage
 */
export const FORGET_ENTITY = 're-app/entityStorage/FORGET_ENTITY';
export function forgetEntity(modelName, entityId) {
	return { type: FORGET_ENTITY, payload: { modelName, entityId } };
}
