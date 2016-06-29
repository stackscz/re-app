/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import Immutable from 'seamless-immutable';

import { createReducer } from 'utils';
import { INIT } from 'utils/actions';
import t from 'tcomb';

describe('utils/createReducer', () => {

	describe('should accept proper params', () => {

		it('should throw when initial state not supplied.', () => {
			expect(() => {
				createReducer();
			}).toThrow(/initial state/);
			expect(() => {
				createReducer(t.struct({}));
			}).toThrow(/initial state/);
		});

		it('should not throw when only initial state supplied.', () => {
			expect(() => {
				createReducer({});
			}).toNotThrow();
			expect(() => {
				createReducer(t.struct({}), {});
			}).toNotThrow();
		});

	});

	describe('should return proper value', () => {
		it('should return function', () => {
			expect(createReducer({})).toBeA('function');
		});
	});

	describe('should support different values as initial state', () => {
		const ACTION = 'ACTION';

		describe('should support vanilla js values as initial state', () => {
			const reducer = createReducer(
				{ a: 'initial state of reducer' },
				{
					[ACTION]: (state) => {
						return { ...state, updated: true };
					},
				}
			);
			let state;

			it(`should merge state with initial state on ${INIT} action.`, () => {
				state = reducer(
					{ b: 'initial state from environment' },
					{ type: INIT }
				);
				expect(state).toEqual({
					a: 'initial state of reducer',
					b: 'initial state from environment',
				})
			});

			it('should handle actions.', () => {
				state = reducer(
					state,
					{ type: ACTION }
				);

				expect(state).toEqual({
					a: 'initial state of reducer',
					b: 'initial state from environment',
					updated: true,
				})
			});

		});

		describe('should support seamless-immutable values as initial state', () => {
			const reducer = createReducer(
				Immutable.from({ a: 'initial state of reducer' }),
				{
					[ACTION]: (state) => {
						return state.set('updated', true);
					},
				}
			);
			let state;

			it(`should merge state with initial state on ${INIT} action.`, () => {
				state = reducer(
					{ b: 'initial state from environment' },
					{ type: INIT }
				);
				expect(state).toEqual({
					a: 'initial state of reducer',
					b: 'initial state from environment',
				});
				expect(state.asMutable).toBeA('function');
			});

			it('should handle actions.', () => {
				state = reducer(
					state,
					{ type: ACTION }
				);

				expect(state).toEqual({
					a: 'initial state of reducer',
					b: 'initial state from environment',
					updated: true,
				})
			});

		});
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
