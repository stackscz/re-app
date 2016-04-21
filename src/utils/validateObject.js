/* eslint-disable */
import ReactPropTypeLocations from 'react/lib/ReactPropTypeLocations';
import invariant from 'invariant';

export default function validateObject(object, propTypes) {
	const error = propTypes({object}, 'object', 'validateObject', ReactPropTypeLocations.prop);
	if (error) {
		invariant(false, error.message);
	}
}
