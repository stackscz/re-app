/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import Immutable from 'seamless-immutable';

import { createReducer } from 'utils';
import { INIT } from 'utils/actions';
import t from 'tcomb';

describe('utils/createReducer', () => {

	it('should throw when initial state not supplied.', () => {
		expect(() => {
			createReducer();
		}).toThrow(/initial state of reducer/);
	});

	it('should not throw when only initial state supplied.', () => {
		expect(() => {
			createReducer({});
		}).toNotThrow();
	});

	it('should not throw when only state type and initial state are supplied.', () => {
		expect(() => {
			createReducer(t.Object, {});
		}).toNotThrow();
	});

	it('should throw when only state type is invalid.', () => {
		expect(() => {
			createReducer('some nonsense as state type', { initial: 'state' }, {});
		}).toThrow(/should be a tcomb type/);
	});

	it('should throw when expected handlers object is not correct.', () => {
		expect(() => {
			createReducer({}, 'foo');
		}).toThrow();
		expect(() => {
			createReducer({}, 3);
		}).toThrow();
	});

	const testInitialState = {
		someData: 'someDataValue'
	};
	const testReducerFunctions = {
		'TEST_ACTION_1': (state) => {
			return { ...state, someData: 'someOtherDataValue' }
		},
		'TEST_ACTION_2': (state) => {
			return state;
		},
	};
	const reducer = createReducer(testInitialState, testReducerFunctions);

	it('should produce function', () => {
		expect(reducer).toBeA('function');
	});

	let state = reducer(undefined, {});

	it('should return seamless-immutable state for @@re-app/INIT', () => {
		state = reducer(state, { type: INIT });
		expect(state.asMutable).toBeA('function');
	});

	it('reducer function wroks properly', () => {
		const testResult1 = reducer(testInitialState, { type: 'TEST_ACTION_1' });
		expect(testResult1).toEqual({ someData: 'someOtherDataValue' });

		const testResult2 = reducer(testInitialState, { type: 'TEST_ACTION_2' });
		expect(testResult2).toEqual({ someData: 'someDataValue' });
	});

	describe('supports type checking', () => {
		const invalidCheckedReducer = createReducer(
			t.struct({
				a: t.String,
				b: t.String,
				c: t.String,
			}),
			{
				a: 'some',
				b: 'other',
				c: { bad: 'value' },
			},
			{}
		);

		it('validates state', () => {
			expect(() => {
				invalidCheckedReducer(undefined, { type: INIT });
			}).toThrow(/Type validation failed/);
		});

		const checkedReducer = createReducer(
			t.struct({
				a: t.String,
				b: t.String,
				c: t.String,
			}),
			Immutable.from({
				a: 'some',
				b: 'other',
				c: 'value',
			}),
			{
				'FOO': [
					t.struct({
						a: t.String,
						b: t.Number,
					}),
					(state, action) => {
						return state.set('c', { invalid: 'value' });
					}
				]
			}
		);
		const state = checkedReducer(undefined, { type: INIT });

		it('validates action payload', () => {
			expect(() => {
				checkedReducer(state, { type: 'FOO' });
			}).toThrow(/Action FOO has invalid payload/);
		});
		it('validates state after action', () => {
			expect(() => {
				checkedReducer(state, { type: 'FOO', payload: { a: 'foo', b: 3 } });
			}).toThrow(/returned invalid state for action FOO/);
		});
	});

});
