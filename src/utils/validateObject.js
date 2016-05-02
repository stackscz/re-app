/* eslint-disable */
import ReactPropTypeLocations from 'react/lib/ReactPropTypeLocations';
import invariant from 'invariant';

export default function validateObject(object, propTypes) {
	return propTypes({object}, 'object', 'validateObject', ReactPropTypeLocations.prop);
}
