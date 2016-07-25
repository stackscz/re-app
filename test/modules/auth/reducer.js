/* eslint-disable */
import expect from 'expect';
import Immutable from 'seamless-immutable';
import reducer from 'modules/auth/reducer';
import {
	INIT,
} from 'utils/actions';
import {
	INITIALIZE,
	INITIALIZE_FINISH,
	LOGIN,
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	LOGOUT,
	LOGOUT_FAILURE,
	LOGOUT_SUCCESS,
} from 'modules/auth/actions';

describe('modules/auth/reducer', () => {

	it('should return the initial state', () => {
		expect(
			reducer(undefined, {})
		).toEqual(
			{
				authenticating: false,
				error: null,
				initialized: false,
				initializing: false,
				user: null,
			}
		)
	});

	describe(`should handle ${INITIALIZE}`, () => {
		it('should set initializing flag', () => {
			expect(
				reducer(
					undefined,
					{
						type: INITIALIZE,
						payload: {
							some: 'context',
						},
					}
				)
			).toEqual(
				{
					authenticating: false,
					error: null,
					initialized: false,
					initializing: true,
					user: null,
					some: 'context',
				}
			)
		});
	});

	describe(`should handle ${INITIALIZE_FINISH}`, () => {
		it('should set initializing and initialized flags', () => {
			expect(
				reducer(
					undefined,
					{
						type: INITIALIZE_FINISH,
						payload: {
							someMore: 'context',
						},
					}
				)
			).toEqual(
				{
					authenticating: false,
					error: null,
					initialized: true,
					initializing: false,
					user: null,
					someMore: 'context',
				}
			)
		});
	});

	describe(`should handle ${LOGIN}`, () => {
		it('should set authenticating flag.', () => {
			expect(
				reducer(
					undefined,
					{
						type: LOGIN,
					}
				)
			).toEqual(
				{
					authenticating: true,
					error: null,
					initialized: false,
					initializing: false,
					user: null,
				}
			)
		});
	});

	describe(`should handle ${LOGIN_FAILURE}`, () => {
		it('should throw invalid payload.', () => {
			expect(() => {
				reducer(
					undefined,
					{
						type: LOGIN_FAILURE,
					}
				);
			}).toThrow(/invalid payload/);
		});
		it('should set error.', () => {
			expect(
				reducer(
					undefined,
					{
						type: LOGIN_FAILURE,
						payload: {
							error: {
								code: 100,
								message: 'Unknown error.',
							}
						},
					}
				)
			).toEqual(
				{
					authenticating: false,
					error: {
						code: 100,
						message: 'Unknown error.',
					},
					initialized: false,
					initializing: false,
					user: null,
				}
			)
		});
	});

	describe(`should handle ${LOGIN_SUCCESS}`, () => {
		it('should throw invalid payload.', () => {
			expect(() => {
				reducer(
					undefined,
					{
						type: LOGIN_SUCCESS,
					}
				);
			}).toThrow(/invalid payload/);
		});
		it('should set user.', () => {
			expect(
				reducer(
					undefined,
					{
						type: LOGIN_SUCCESS,
						payload: {
							user: {
								name: 'john',
							}
						},
					}
				)
			).toEqual(
				{
					authenticating: false,
					error: null,
					initialized: false,
					initializing: false,
					user: {
						name: 'john',
					},
				}
			)
		});
	});

	describe(`should handle ${LOGOUT_SUCCESS}`, () => {
		it('should unset user.', () => {
			let state = reducer(
				Immutable.from({
					user: { name: 'john' },
				}),
				{
					type: INIT,
				}
			);
			state = reducer(
				state,
				{
					type: LOGOUT_SUCCESS,
				}
			);
			expect(
				reducer(
					state,
					{
						type: LOGOUT_SUCCESS,
					}
				)
			).toEqual(
				{
					authenticating: false,
					error: null,
					initialized: false,
					initializing: false,
					user: null,
				}
			)
		});
	});

});
