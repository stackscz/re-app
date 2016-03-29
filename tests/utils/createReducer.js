import _ from 'lodash';
import test from 'tape';

import {createReducer} from 're-app/utils';

test('createReducer test', (t) => {


	t.throws(createReducer.bind(null), 'Throws when initial state not supplied.');
	t.doesNotThrow(createReducer.bind(null, {}), 'Does not throw when only initial state supplied');
	t.throws(createReducer.bind(null, {}, 'incorrect'), 'Throws when expected handlers object is not correct.');


	const testInitialState = {
		someData: 'someDataValue'
	};
	const testReducerFunctions = {
		'TEST_ACTION_1': (state) => {
			return {...state, someData: 'someOtherDataValue'}
		},
		'TEST_ACTION_2': (state) => {
			return state;
		}
	};
	const testReducer = createReducer(testInitialState, testReducerFunctions);

	t.ok(_.isFunction(testReducer), 'Resulting reducer is a function');

	const testResult1 = testReducer(testInitialState, {type: 'TEST_ACTION_1'});
	t.deepEqual(testResult1, {someData: 'someOtherDataValue'}, 'Resulting reducer works as expected 1.');

	const testResult2 = testReducer(testInitialState, {type: 'TEST_ACTION_2'});
	t.deepEqual(testResult2, {someData: 'someDataValue'}, 'Resulting reducer works as expected 2.');

	t.end();
});
