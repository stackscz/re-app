// @flow
/* eslint-disable */

import _ from 'lodash';
import { Schema, arrayOf } from 'normalizr';
import { normalize } from 'normalizr';
import { denormalize } from 'denormalizr';
import invariant from 'invariant';
import hash from 'object-hash';

const API_LATENCY = process.env.NODE_ENV === 'test' ? 0 : 400;

import entityDescriptors from './entityDescriptors';

import PouchDB from 'pouchdb';
import RelationalPouchDB from 'relational-pouch';
PouchDB.plugin(RelationalPouchDB);
const db = new PouchDB('db_re-app-examples');
db.setSchema([
	{
		singular: 'post',
		plural: 'posts',
		relations: {
			tags: { hasMany: 'tag' }
		}
	},
	{
		singular: 'tag',
		plural: 'tags'
	}
]);

const mappings = {
	posts: new Schema('posts'),
	tags: new Schema('tags', { idAttribute: 'name' })
};
mappings.posts.define({
	tags: arrayOf(mappings.tags)
});

import type { ApiService } from 'types/ApiService';

export default ({
	/**
	 * Called on auth module bootstrap.
	 * It is possible to for example read auth cookie and return new auth state with cookie data in it.
	 *
	 * @param externalAuthContext whole state slice of api module
	 * @returns {*} modified auth state
	 */
	getInitialAuthContext: (externalAuthContext) => {
		return {
			...externalAuthContext,
			someDataNeededForAuthentication: {
				possiblyClientId: 'key'
			}
		};
	},
	/**
	 * Called on auth module bootstrap after getInitialAuthContext.
	 * Can check if authContext represents authenticated user and resolve with new authContext patched with that user
	 *
	 * @param apiContext api module state slice
	 * @param authContext auth module state slice
	 * @returns {Promise}
	 */
	initializeAuth: (apiContext, authContext) => {
		logBoldMessage('ApiService.initializeAuth called');
		return DelayedPromise((resolve) => {
			// possibly set user and possibly modify authContext
			const updatedAuthContext = {
				...authContext,
				user: { username: 'username' }
			};
			resolve(updatedAuthContext);
		});
	},
	/**
	 * Called on auth module LOGIN action.
	 * Resolves with new authContext patched with user when login successful.
	 * Rejects with error object when login failed
	 *
	 * @param credentials
	 * @param apiContext
	 * @param authContext
	 * @returns {Promise}
	 */
	login: (credentials, apiContext, authContext) => {
		logBoldMessage('ApiService.login called');
		return DelayedPromise((resolve, reject) => {
			if (isCredentialsValid(credentials)) {
				// set user and possibly modify authContext
				resolve({
					...authContext,
					user: {
						username: credentials.username
					}
				});
			} else {
				// TODO rethink error result format
				reject({
					errors: [
						{
							message: 'Invalid credentials'
						}
					],
					originalHttpResponse: {}
				});
			}
		});
	},
	/**
	 * Logs out user and resolves with new authContext with user removed, clears cookies etc.
	 *
	 * @param apiContext
	 * @param authContext
	 * @returns {Promise}
	 */
	logout: (apiContext, authContext) => {
		return DelayedPromise(resolve => {
			logBoldMessage('ApiService.logout called');
			resolve({ ...authContext });
		});
	},
	/**
	 * Resolves with app entity descriptors
	 *
	 * @param apiContext
	 * @param authContext
	 * @returns {Promise}
	 */
	getEntityDescriptors: (apiContext, authContext) => {
		logBoldMessage('ApiService.getEntityDescriptors called');
		return DelayedPromise((resolve, reject) => {
			//return reject({errors:[]});
			resolve(entityDescriptors);
		});
	},
	/**
	 * Resolves with result of api call for entity collection index possibly filtered by filter param
	 *
	 * @param collectionName
	 * @param filter
	 * @param apiContext
	 * @param authContext
	 * @returns {Promise}
	 */
	getEntityIndex: (collectionName, filter, apiContext, authContext) => {
		logBoldMessage('ApiService.getEntityIndex called');
		invariant(
			_.isUndefined(filter) || _.isEqual(filter, { offset: 0, limit: -1 }),
			'filtering is not supported in mock implementation of ApiService'
		);
		return DelayedPromise((resolve, reject) => {
			db.rel.find(collectionName).then((result) => {
				const normalized = formatPouchToNormalized(result, entityDescriptors.schemas);
				const denormalized = _.mapValues(normalized[collectionName], (entity) => {
					return denormalize(entity, normalized, mappings[collectionName])
				});
				resolve({
					data: _.values(denormalized)
				});
			}).catch((error) => {
				reject(error);
			});
		}, apiContext);
	},
	/**
	 * Resolves with single entity from given collection and with given id
	 *
	 * @param collectionName
	 * @param id
	 * @param apiContext
	 * @param authContext
	 * @returns {Promise}
	 */
	getEntity: (collectionName, id, apiContext, authContext) => {
		logBoldMessage('ApiService.getEntity called');
		return DelayedPromise((resolve, reject) => {
			if (!id) {
				return reject({
					statusCode: 404,
					message: 'Not found'
				});
			}
			findOne(collectionName, id, (entity) => {
				resolve({
					data: entity
				});
			}, (error) => {
				reject({ ...error, statusCode: 404 });
			});
		});
	},
	/**
	 * Creates single entity.
	 *
	 * @param collectionName
	 * @param entity
	 * @param apiContext
	 * @param authContext
	 */
	createEntity: (collectionName, entity, apiContext, authContext) => {
		logBoldMessage('ApiService.createEntity called');
		return DelayedPromise((resolve, reject) => {
			const normalized = normalize(entity, mappings[collectionName]);
			const normalizedEntity = normalized.entities[collectionName][normalized.result];
			db.rel.save(collectionName, normalizedEntity).then((result) => {
				const data = extractEntityFromDbResult(result, collectionName);
				const entityId = data[entityDescriptors.schemas[collectionName].idFieldName];
				findOne(collectionName, entityId, (entity) => {
					resolve({
						data: entity
					});
				}, (error) => {
					reject(error);
				});
			}).catch((error) => {
				reject(error);
			});
		});
	},
	/**
	 * Updates single entity.
	 *
	 * @param collectionName
	 * @param id
	 * @param entity
	 * @param apiContext
	 * @param authContext
	 */
	updateEntity: (collectionName, id, entity, apiContext, authContext) => {
		logBoldMessage('ApiService.updateEntity called');

		return DelayedPromise((resolve, reject) => {

			db.rel.find(collectionName, id).then((result) => {
				const rev = _.get(_.first(result[collectionName]), 'rev');
				const normalized = normalize(entity, mappings[collectionName]);
				const normalizedEntity = normalized.entities[collectionName][normalized.result];
				const entityWithIdAndRev = {
					...normalizedEntity,
					[entityDescriptors.schemas[collectionName].idFieldName]: id,
					rev
				};
				db.rel.save(collectionName, entityWithIdAndRev).then((result) => {
					const data = extractEntityFromDbResult(result, collectionName);
					const entityId = data[entityDescriptors.schemas[collectionName].idFieldName];
					findOne(collectionName, entityId, (entity) => {
						resolve({
							data: entity
						});
					}, (error) => {
						reject({ ...error, statusCode: 400 });
					});
				}).catch((error) => {
					reject({ ...error, statusCode: 400 });
				});
			}).catch((error) => {
				reject({ ...error, statusCode: 404 })
			});

		});
	},
	/**
	 * Deletes single entity.
	 *
	 * @param collectionName
	 * @param id
	 * @param apiContext
	 * @param authContext
	 */
	deleteEntity: (collectionName, id, apiContext, authContext) => {
		logBoldMessage('ApiService.deleteEntity called');
		return DelayedPromise((resolve, reject) => {
			db.rel.find(collectionName, id).then(function (result) {
				const entityRevisions = _.get(result, collectionName);
				if (!entityRevisions.length) {
					return reject({
						message: 'Not found',
						statusCode: 404
					});
				}
				let promise = db.rel;
				_.each(entityRevisions, (revision) => {
					promise = promise.del(collectionName, revision);
				});
				promise.then(() => {
					resolve();
				}).catch((error) => {
					reject(error);
				});
			}).catch((error) => {
				reject(error);
			});
		});
	}
}: ApiService);

function findOne(collectionName, entityId, success, failure) {
	db.rel.find(collectionName, entityId).then((result) => {
		const normalized = formatPouchToNormalized(result, entityDescriptors.schemas);
		const entity = normalized[collectionName][entityId];
		if (!entity) {
			return failure({
				message: 'Not found',
				statusCode: 404
			})
		}
		const denormalized = denormalize(entity, normalized, mappings[collectionName]);
		success(denormalized);
	}).catch((error) => {
		failure(error);
	});
}

function isCredentialsValid(credentials) {
	if (!credentials) return false;
	return !!(credentials.username === 'username' && credentials.password === 'password');
}

function logBoldMessage(message) {
	console.log('XXX XXX XXX XXX XXX XXX XXX');
	console.log(['XXX', message].join(' '));
	console.log('XXX XXX XXX XXX XXX XXX XXX');
}

function DelayedPromise(handler) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			handler(resolve, reject);
		}, API_LATENCY);
	});
}

function formatPouchToNormalized(dictionary, entitySchemas) {
	return _.mapValues(dictionary, (value, collectionName) => {
		const schema = entitySchemas[collectionName];
		return _.keyBy(_.mapValues(value, (item) => {
			const idFieldValue = item.id;
			return _.set(_.omit(item, ['rev', 'id']), schema.idFieldName, idFieldValue);
		}), schema.idFieldName);
	});
}

function extractEntityFromDbResult(result, collectionName) {
	return _.omit(_.first(_.get(result, collectionName)), ['rev']);
}
