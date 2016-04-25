import _ from 'lodash';
import invariant from 'invariant';

/**
 * @deprecated Constants should be declared as true es6 constants to allow static analysis of code
 * Utility function to create object of constants
 *
 * Example:
 *
 * 	createConstants(['A', 'B'])
 * 	=
 * 	{
 * 		A: 'A',
 * 		B: 'B'
 * 	}
 *
 *
 * 	createConstants(['A', 'B'], 'prefix-')
 * 	=
 * 	{
 * 		A: 'prefix-A',
 * 		B: 'prefix-B'
 * 	}
 *
 * @param constants
 * @param prefix
 * @returns {*}
 */
export default function createConstants(constants, prefix) {
	invariant(_.isArray(constants), 'First argument of `createConstants` should be array of strings - names of constants.');
	invariant(_.isUndefined(prefix) || _.isString(prefix), 'Second optional argument of `createConstants` should be a string prefix to prepend to all constant values.');
	return constants.reduce((accumulatedConstants, constantName) => {
		return _.assign(accumulatedConstants, {
			[constantName]: (prefix || '') + constantName
		});
	}, {});
}
