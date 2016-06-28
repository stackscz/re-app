/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';

import {
	createStore,
	createModule,
	createReducer,
} from 'utils';
import { INIT } from 'utils/actions';

import { take, put } from 'redux-saga';

describe('utils/createStore', () => {

	// simple store
	const store1 = createStore({
		logging: false,
		reducers: {
			foo: (state = { bar: 'bat' }, action) => {
				if (action.type === INIT) {
					return { ...state, initialized: true };
				}
				return state;
			}
		}
	});
	let state1 = store1.getState();

	describe('supports "reducers" option', () => {
		it('creates store with foo slice', () => {
			expect(state1.foo).toBeA('object');
			expect(state1.foo.bar).toBeA('string');
		});
	});

	it(`dispatches ${INIT} action`, () => {
		expect(state1.foo.initialized).toBe(true);
	});

	describe('supports "sagas" option', () => {

		const FOO = 'FOO';
		const sagaSpy = expect.createSpy();
		const saga = function* () {
			sagaSpy();
		};
		createStore({
			logging: false,
			reducers: {
				foo: (state = { bar: 'bat' }, action) => {
					switch (action.type) {
						case FOO:
							return { ...state, sagaRun: true };
							break;
						default:
							return state;
					}
				}
			},
			sagas: [
				saga
			]
		});

		it('should run sagas', () => {
			expect(sagaSpy).toHaveBeenCalled();
		});
	});


	describe('supports "modules" option', () => {
		const sagaSpy1 = expect.createSpy();
		const sagaSpy2 = expect.createSpy();
		const sagaSpy3 = expect.createSpy();
		const saga1 = function* () {
			sagaSpy1();
		};
		const saga2 = function* () {
			sagaSpy2();
		};
		const saga3 = function* () {
			sagaSpy3();
		};
		const store = createStore({
			logging: false,
			reducers: {
				a: createReducer(
					{ b: 'c' },
					{ 'FOO': (state) => ({ ...state, b: 'd' }) }
				),
			},
			sagas: [
				saga1,
			],
			modules: [
				createModule(
					'foo',
					createReducer(
						{ bar: 'baz' },
						{ 'FOO': (state) => ({ ...state, bar: 'bax' }) }
					),
					[
						saga2,
						saga3,
					]
				),
			],
		});
		it('should run module sagas and regular sagas', () => {
			expect(sagaSpy1).toHaveBeenCalled('Regular sags was not called');
			expect(sagaSpy2).toHaveBeenCalled('Module saga2 was not called');
			expect(sagaSpy3).toHaveBeenCalled('Module saga3 was not called');
		});

		it('should create store with module reducer slices and regular reducer slices', () => {
			store.dispatch({ type: 'FOO' });
			const state = store.getState();
			expect(state.foo).toEqual({ bar: 'bax' });
			expect(state.a).toEqual({ b: 'd' });
		});

	});

	describe('is compatible with createReducer', () => {
		const store = createStore(
			{
				logging: false,
				reducers: {
					foo: createReducer(
						{ bar: null }
					)
				}
			},
			{
				foo: {
					bar: 'value'
				}
			}
		);

		it('should create store which merges initial state into reducer created by createReducer', () => {
			const state = store.getState();
			expect(state).toContain({
				foo: {
					bar: 'value'
				}
			});
		});
	})
});
