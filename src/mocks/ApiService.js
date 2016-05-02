/* eslint-disable */
import _ from 'lodash';
import { Schema, arrayOf } from 'normalizr';
import { denormalize } from 'denormalizr';
import invariant from 'invariant';

export default {
	getInitialAuthContext: (externalAuthContext) => {
		return externalAuthContext;
	},
	initializeAuth: (apiContext, authContext) => {
		logBoldMessage('ApiService.initializeAuth called');
		return new Promise((resolve) => {
			// possibly set user and possibly modify authContext
			const updatedAuthContext = {
				...authContext,
				user: {username: 'johndoe'},
				credentials: {username: 'username', password: 'password'},
				dataNeededForAuthentication: {possiblyClientId: 'key'}
			};
			resolve(updatedAuthContext);
		});
	},
	login: (credentials, apiContext, authContext) => {
		logBoldMessage('ApiService.login called');
		return new Promise((resolve, reject) => {
			if (isCredentialsValid(credentials)) {
				// set user and possibly modify authContext
				resolve({
					...authContext,
					credentials: {username: 'username', password: 'password'},
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
					]
				});
			}
		});
	},
	logout: (apiContext, authContext) => {
		return new Promise(resolve => {
			logBoldMessage('ApiService.logout called');
			resolve({...authContext});
		});
	},
	getEntityDescriptors: (apiContext, authContext) => {
		logBoldMessage('ApiService.getEntityDescriptors called');
		return new Promise((resolve) => {
			const { credentials } = authContext;
			resolve(entityDescriptors);
		});
	},
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
	getEntity: (collectionName, id, apiContext, authContext) => {
		logBoldMessage('ApiService.getEntity called');
		return new Promise((resolve) => {
			const result = denormalize(entities[collectionName][id], entities, mappings[collectionName]);
			resolve(result);
		});
	},
	persistEntity: (collectionName, id, entity, apiContext, authContext) => {
		logBoldMessage('ApiService.persistEntity called');
		invariant(false, 'persistEntity is not supported in mock implementation of ApiService');
	},
	deleteEntity: (collectionName, id, apiContext, authContext) => {
		logBoldMessage('ApiService.deleteEntity called');
		invariant(false, 'deleteEntity is not supported in mock implementation of ApiService');
	}
};

const entityDescriptors = {
	schemas: {
		posts: {
			name: 'posts',
			idFieldName: 'id',
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
