import {PropTypes as T} from 'react';

export const initializeAuth = T.object.isRequired;

export const login = T.shape({
	user: T.shape({
		username: T.string.isRequired
	})
});
export const loginError = T.object.isRequired; // TODO

export const logout = T.object.isRequired;
export const logoutError = T.object.isRequired; // TODO

export const getEntityDescriptors = T.shape({
	schemas: T.objectOf(T.shape({
		name: T.string.isRequired,
		idFieldName: T.string.isRequired,
		displayFieldName: T.string.isRequired,
		isFilterable: T.string.isRequired,
		fields: T.objectOf(T.shape({
			name: T.string.isRequired,
			type: T.string.isRequired
		})).isRequired
	})).isRequired,
	fieldsets: T.objectOf(T.shape({
		grid: T.arrayOf(T.string),
		detail: T.arrayOf(T.string),
		form: T.arrayOf(T.string)
	})).isRequired
});
export const getEntityDescriptorsError = T.object.isRequired; // TODO

export const getEntityIndex = T.shape({
	data: T.arrayOf(T.object).isRequired,
	existingCount: T.number.isRequired
});
export const getEntityIndexError = T.object.isRequired; // TODO

export const getEntity = T.shape({
	data: T.object.isRequired
}).isRequired;
export const getEntityError = T.object.isRequired; // TODO

export const persistEntity = T.shape({
	data: T.object.isRequired
}).isRequired;
export const persistEntityError = T.object.isRequired; // TODO

export const deleteEntity = T.object.isRequired; // TODO
export const deleteEntityError = T.object.isRequired; // TODO
