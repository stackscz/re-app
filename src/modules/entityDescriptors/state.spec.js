import {PropTypes as T} from 'react';

const schemas = T.objectOf(T.shape({
	name: T.string.isRequired,
	idFieldName: T.string.isRequired,
	fields: T.objectOf(T.shape({
		name: T.string.isRequired,
		type: T.string.isRequired
	})).isRequired
})).isRequired;

const fieldsets = T.objectOf(T.shape({
	grid: T.arrayOf(T.string),
	detail: T.arrayOf(T.string),
	form: T.arrayOf(T.string)
})).isRequired;

export default T.shape({
	schemas,
	fieldsets
});

export {
	schemas,
	fieldsets
};
