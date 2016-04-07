import {PropTypes} from 'react';

const schemas = PropTypes.objectOf(PropTypes.shape({
	name: PropTypes.string.isRequired,
	idFieldName: PropTypes.string.isRequired,
	fields: PropTypes.objectOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired
	})).isRequired
})).isRequired;

const fieldsets = PropTypes.objectOf(PropTypes.shape({
	grid: PropTypes.arrayOf(PropTypes.string),
	detail: PropTypes.arrayOf(PropTypes.string),
	form: PropTypes.arrayOf(PropTypes.string)
})).isRequired;

export default PropTypes.shape({
	schemas,
	fieldsets
});

export {
	schemas,
	fieldsets
};
