import _ from 'lodash';
import { Schema, arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';
import invariant from 'invariant';

export default {
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
		return new Promise((resolve) => {
			// possibly set user and possibly modify authContext
			const updatedAuthContext = {
				...authContext,
				user: {username: 'username'}
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
		return new Promise((resolve, reject) => {
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
		return new Promise(resolve => {
			logBoldMessage('ApiService.logout called');
			resolve({...authContext});
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
		return new Promise((resolve, reject) => {
			//const { credentials } = authContext;
			//return reject('fofo');
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
		invariant(_.isUndefined(filter), 'filtering is not supported in mock implementation of ApiService');
		return new Promise((resolve) => {
			const result = _.mapValues(entities[collectionName], (entity) => {
				return denormalize(entity, entities, mappings[collectionName])
			});
			resolve(result);
		});
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
		return new Promise((resolve) => {
			const result = denormalize(entities[collectionName][id], entities, mappings[collectionName]);
			resolve(result);
		});
	},
	/**
	 * Persists single entity. Decides if create or update entity based on presence of id param
	 *
	 * @param collectionName
	 * @param id
	 * @param entity
	 * @param apiContext
	 * @param authContext
	 */
	persistEntity: (collectionName, id, entity, apiContext, authContext) => {
		logBoldMessage('ApiService.persistEntity called');
		invariant(false, 'persistEntity is not supported in mock implementation of ApiService');
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
		invariant(false, 'deleteEntity is not supported in mock implementation of ApiService');
	}
};

const entityDescriptors = {
	schemas: {
		posts: {
			name: 'posts',
			displayFieldName: 'title',
			idFieldName: 'id',
			isFilterable: false,
			fields: {
				title: {
					name: 'title',
					type: 'string'
				},
				tags: {
					name: 'tags',
					type: 'association',
					isMultiple: true
				}
			}
		},
		tags: {
			name: 'tags',
			idFieldName: 'name',
			displayFieldName: 'name',
			isFilterable: false,
			fields: {
				name: {
					name: 'name',
					type: 'string'
				}
			}
		}
	},
	fieldsets: {
		posts: {
			detail: ['title', 'tags'],
			grid: ['title'],
			form: ['title', 'tags']
		},
		tags: {
			detail: ['name'],
			grid: ['name'],
			form: ['name']
		}
	}
};

const entities = {
	posts: {
		1: {
			id: 1,
			title: 'Post 1',
			tags: [
				{name: 'tag-1'}
			]
		},
		2: {
			title: 'Post 2',
			tags: [
				{name: 'tag-1'},
				{name: 'tag-2'}
			]
		}
	},
	tags: {
		'tag-1': {
			name: 'tag-1'
		},
		'tag-2': {
			name: 'tag-2'
		}
	}
};

const mappings = {
	posts: new Schema('posts'),
	tags: new Schema('tags')
};
mappings.posts.define({
	tags: arrayOf(mappings.tags)
});

function isCredentialsValid(credentials) {
	if (!credentials) return false;
	if (credentials.username === 'username' && credentials.password === 'password') return true;
	return false;
}

function logBoldMessage(message) {
	console.log('XXX XXX XXX XXX XXX XXX XXX');
	console.log(['XXX', message].join(' '));
	console.log('XXX XXX XXX XXX XXX XXX XXX');
}
