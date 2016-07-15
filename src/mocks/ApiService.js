// @flow
/* eslint-disable */
import _ from 'lodash';
import invariant from 'invariant';
import hash from 'object-hash';

import entityDescriptors from './entityDescriptors';
import type { ApiService } from 'types/ApiService';

// setup db
const schemas = entityDescriptors.schemas;
const models = {};
import { DataSource } from 'loopback-datasource-juggler';
const db = new DataSource('memory');
_.each(entityDescriptors.schemas, (schema, collectionName) => {
	models[collectionName] = db.createModel(
		collectionName,
		_.pickBy(
			_.mapValues(schema.fields, (field, fieldName) => {
				if (field.type === 'association') {
					return undefined;
				}
				if (fieldName === schema.idFieldName) {
					return {
						type: field.type,
						id: true,
						generated: schema.idFieldName === 'id',
					}
				}
				return {
					type: String,
				}
			}),
			(x) => x
		),
		{
			idInjection: false,
			relations: _.pickBy(
				_.mapValues(schema.fields, (field, fieldName) => {
					if (field.type === 'association') {
						return {
							model: field.collectionName,
							type: field.isMultiple ? 'hasMany' : 'belongsTo',
						};
					}
				}),
				(x) => x
			),
		}
	);
});

// utilities

function logBoldMessage(message) {
	if (process.env.NODE_ENV !== 'test') {
		console.log('XXX XXX XXX XXX XXX XXX XXX');
		console.log(['XXX', message].join(' '));
		console.log('XXX XXX XXX XXX XXX XXX XXX');
	}
}

function isCredentialsValid(credentials) {
	if (!credentials) return false;
	return !!(credentials.username === 'username' && credentials.password === 'password');
}

function getInclude(collectionName) {
	return _.keys(_.pickBy(schemas[collectionName].fields, (field) => {
		return field.type === 'association';
	}));
}

const API_LATENCY = process.env.NODE_ENV === 'test' ? 0 : 400;
function DelayedPromise(handler) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			handler(resolve, reject);
		}, API_LATENCY);
	});
}

function createNotFoundError(details) {
	return {
		code: 404,
		statusText: 'Not found.',
		details,
	};
}

function createUnknownCollectionError(collectionName) {
	return {
		code: 400,
		message: `Unknown collection name "${collectionName}"`,
		details: {
			collectionName,
		},
	};
}

// mock service
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
		return DelayedPromise((resolve, reject) => {
			const model = models[collectionName];
			if (!model) {
				return reject(createUnknownCollectionError(collectionName));
			}
			model.find(
				_.merge({ include: getInclude(collectionName) }, filter),
				(err, entities) => {
					if (err) {
						return reject(err);
					}
					model.count((err, result) => {
						if (err) {
							return reject(err);
						}
						resolve({
							data: _.map(entities, (entity) => (entity.toJSON())),
							existingCount: result,
						});
					});
				}
			);
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
			const model = models[collectionName];
			if (!model) {
				return reject(createUnknownCollectionError(collectionName));
			}
			const pkName = schemas[collectionName].idFieldName;
			model.findOne(
				{
					where: { [pkName]: id },
					include: getInclude(collectionName)
				},
				(err, entity) => {
					if (err) {
						return reject(err);
					}
					if (!entity) {
						return reject(createNotFoundError({ collectionName, [pkName]: id }))
					}
					resolve({
						data: entity,
					});
				}
			);
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
			const model = models[collectionName];
			if (!model) {
				return reject(createUnknownCollectionError(collectionName));
			}
			model.create(entity, (err, modelInstance) => {
				if (err) {
					return reject(err);
				}
				modelInstance.save((err, savedModelInstance) => {
					if (err) {
						return reject(err);
					}
					const pkName = schemas[collectionName].idFieldName;
					const pkVal = savedModelInstance[pkName];
					models[collectionName].findOne(
						{
							[pkName]: pkVal,
							include: getInclude(collectionName)
						},
						(err, entity) => {
							if (err) {
								return reject(err);
							}
							resolve({
								data: entity.toJSON(),
							});
						}
					);
				})
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
			const model = models[collectionName];
			if (!model) {
				return reject(createUnknownCollectionError(collectionName));
			}
			const pkName = schemas[collectionName].idFieldName;
			model.findOne(
				{ where: { [pkName]: id } },
				(err, persistedEntity) => {
					if (err) {
						return reject(err);
					}
					if (!persistedEntity) {
						return reject(createNotFoundError({ collectionName, [pkName]: id }));
					}
					persistedEntity.updateAttributes(entity, (err, entity) => {
						if (err) {
							return reject(err);
						}
						model.findOne(
							{ where: { [pkName]: entity[pkName] }, include: getInclude(collectionName) },
							(err, entity) => {
								if (err) {
									return reject(err);
								}
								resolve({ data: entity.toJSON() });
							}
						);
					})
				}
			);
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
			const model = models[collectionName];
			if (!model) {
				return reject(createUnknownCollectionError(collectionName));
			}
			const pkName = schemas[collectionName].idFieldName;
			model.findOne(
				{ where: { [pkName]: id } },
				(err, persistedEntity) => {
					if (err) {
						return reject(err);
					}
					if (!persistedEntity) {
						return reject(createNotFoundError({ collectionName, [pkName]: id }));
					}
					persistedEntity.destroy((err, entity) => {
						if (err) {
							return reject(err);
						}
						resolve();
					})
				}
			);
		});
	}
}: ApiService);
