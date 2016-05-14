export const ENSURE_ENTITY = 're-app/entityStorage/ENSURE_ENTITY';
export const CONFIRM_ENTITY = 're-app/entityStorage/CONFIRM_ENTITY';
export const RECEIVE_ENSURE_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_ENSURE_ENTITY_FAILURE';

export const ATTEMPT_FETCH_ENTITY = 're-app/entityStorage/ATTEMPT_FETCH_ENTITY';
export const RECEIVE_ENTITY = 're-app/entityStorage/RECEIVE_ENTITY';
export const RECEIVE_ENTITIES = 're-app/entityStorage/RECEIVE_ENTITIES';
export const RECEIVE_FETCH_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_FETCH_ENTITY_FAILURE';

export const MERGE_ENTITY = 're-app/entityStorage/MERGE_ENTITY';
export const CONFIRM_ENTITY_MERGED = 're-app/entityStorage/CONFIRM_ENTITY_MERGED';
export const RECEIVE_ENTITY_MERGE_FAILURE = 're-app/entityStorage/RECEIVE_ENTITY_MERGE_FAILURE';

export const PERSIST_ENTITY = 're-app/entityStorage/PERSIST_ENTITY';
export const RECEIVE_PERSIST_ENTITY_SUCCESS = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_SUCCESS';
export const RECEIVE_PERSIST_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_PERSIST_ENTITY_FAILURE';

export const DELETE_ENTITY = 're-app/entityStorage/DELETE_ENTITY';
export const RECEIVE_DELETE_ENTITY_SUCCESS = 're-app/entityStorage/RECEIVE_DELETE_ENTITY_SUCCESS';
export const RECEIVE_DELETE_ENTITY_FAILURE = 're-app/entityStorage/RECEIVE_DELETE_ENTITY_FAILURE';

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
export function receiveEnsureEntityFailure(collectionName, entityId, error) {
	return {type: RECEIVE_ENSURE_ENTITY_FAILURE, payload: {collectionName, entityId, error}};
}

/**
 * Request single entity from remote
 */
export function attemptFetchEntity(collectionName, entityId) {
	return {type: ATTEMPT_FETCH_ENTITY, payload: {collectionName, entityId}};
}

export function receiveEntity(collectionName, entityId, normalizedEntities, validAtTime) {
	return {type: RECEIVE_ENTITY, payload: {collectionName, entityId, normalizedEntities, validAtTime}};
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
 * Create or update persistent entity, actor is responsible for ensuring non-colliding idField value in entity data
 *
 * - merge data to collection store
 * - set status to transient: true when entity does not exist in storage or is transient
 */
export function mergeEntity(entitySchema, data) {
	return {type: MERGE_ENTITY, payload: {entitySchema, data}};
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

/**
 * Request entity removal from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export function deleteEntity(collectionName, entityId) {
	return {type: DELETE_ENTITY, payload: {collectionName, entityId}};
}

/**
 * Acknowledge that entity was deleted from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export function receiveDeleteEntitySuccess(collectionName, entityId) {
	return {type: RECEIVE_DELETE_ENTITY_SUCCESS, payload: {collectionName, entityId}};
}

/**
 * Acknowledge that entity could not be deleted from remote
 *
 * - set entity status to deleting: true, transient: true
 */
export function receiveDeleteEntityFailure(collectionName, entityId) {
	return {type: RECEIVE_DELETE_ENTITY_FAILURE, payload: {collectionName, entityId}};
}

// aux


export const ENSURE_ENTITY_COLLECTION = 're-app/entityStorage/ENSURE_ENTITY_COLLECTION';

/**
 * Load all entities from collection into storage from remote when needed.
 *
 * @param collectionName
 * @param entityId
 */
export function ensureEntityCollection(collectionName) {
	return {type: ENSURE_ENTITY_COLLECTION, payload: {collectionName}};
}
