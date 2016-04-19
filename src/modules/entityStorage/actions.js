export const ENSURE_ENTITY = 're-app/entityStorage/ENSURE_ENTITY';
export const CONFIRM_ENTITY = 're-app/entityStorage/CONFIRM_ENTITY';
export const RECEIVE_ENSURE_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_ENSURE_ENTITY_FAILURE';

export const FETCH_ENTITY = 're-app/entityStorage/FETCH_ENTITY';
export const RECEIVE_ENTITIES = 're-app/entityStorage/RECEIVE_ENTITIES';
export const RECEIVE_FETCH_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_FETCH_ENTITY_FAILURE';

export const MERGE_ENTITY = 're-app/entityStorage/MERGE_ENTITY';
export const CONFIRM_ENTITY_MERGED = 're-app/entityStorage/CONFIRM_ENTITY_MERGED';
export const RECEIVE_ENTITY_MERGE_FAILURE = 're-app/entityStorage/RECEIVE_ENTITY_MERGE_FAILURE';

export const PERSIST_ENTITY = 're-app/entityStorage/PERSIST_ENTITY';
export const RECEIVE_PERSIST_ENTITY_SUCCESS = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_SUCCESS';
export const RECEIVE_PERSIST_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_FAILURE';

/**
 * Load entity into storage from remote when needed.
 *
 * @param collectionName
 * @param entityId
 */
export function ensureEntity(collectionName, entityId) {
	return {type: ENSURE_ENTITY, payload: {collectionName, entityId}};
}

/**
 * Requested entity is now present in storage
 *
 * @param collectionName
 * @param entityId
 * @returns {{type: string, payload: {collectionName: *, entityId: *}}}
 */
export function confirmEntity(collectionName, entityId) {
	return {type: CONFIRM_ENTITY, payload: {collectionName, entityId}};
}

/**
 * Error occurred when ensuring entity
 */
export function receiveEnsureEntityFailure(collectionName, entityId) {
	return {type: RECEIVE_ENSURE_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

/**
 * Request single entity from remote
 */
export function fetchEntity(collectionName, entityId) {
	return {type: FETCH_ENTITY, payload: {collectionName, entityId}};
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
export function receiveEntities(normalizedEntities, validAtTime) {
	return {type: RECEIVE_ENTITIES, payload: {normalizedEntities, validAtTime}};
}

/**
 * Receive error response
 */
export function receiveFetchEntityFailure(collectionName, entityId) {
	return {type: RECEIVE_FETCH_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

/**
 * Create or update persistent entity, actor is responsible for providing non-colliding entityId
 *
 * - merge data to collection store
 * - set status to transient: true when entity does not contain idField
 */
export function mergeEntity(collectionName, entityId, data) {
	return {type: MERGE_ENTITY, payload: {collectionName, entityId, data}};
}

/**
 * Entity merged and available in store
 *
 */
export function confirmEntityMerged(collectionName, entityId, transientVersionEntityId) {
	return {type: CONFIRM_ENTITY_MERGED, payload: {collectionName, entityId, transientVersionEntityId}};
}

/**
 * Entity merge failed
 *
 */
export function receiveEntityMergeFailure(collectionName, entityId) {
	return {type: RECEIVE_ENTITY_MERGE_FAILURE, payload: {collectionName, entityId}};
}

/**
 * Request remote for entity persistence
 */
export function persistEntity(collectionName, entityId) {
	return {type: PERSIST_ENTITY, payload: {collectionName, entityId}};
}

/**
 * Acknowledge that entity was successfully persisted to remote and receive resulting entities
 *
 * - replace transient entity id in storage
 * - set status to transient: false
 */
export function receivePersistEntitySuccess(collectionName, entityId, normalizedEntities, transientEntityId, validAtTime) {
	return {
		type: RECEIVE_PERSIST_ENTITY_SUCCESS,
		payload: {collectionName, entityId, normalizedEntities, transientEntityId, validAtTime}
	};
}

/**
 * Acknowledge that request for entity persistence failed
 *
 * - set entity status, errors
 */
export function receivePersistEntityFailure(collectionName, entityId, errors) {
	return {type: RECEIVE_PERSIST_ENTITY_FAILURE, payload: {collectionName, entityId, errors}};
}
