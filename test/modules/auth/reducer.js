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
	RECEIVE_LOGIN_FAILURE,
	RECEIVE_IDENTITY,
	LOGOUT,
	RECEIVE_LOGOUT_FAILURE,
	RECEIVE_LOGOUT_SUCCESS,
} from 'modules/auth/actions';

describe('modules/auth/reducer', () => {

	it('should return the initial state', () => {
		expect(
			reducer(undefined, {})
		).toEqual(
			{
				context: {},
				authenticating: false,
				userId: null,
				userModelName: 'users',
				error: null,
				initialized: false,
				initializing: false,
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
							context: {
								some: 'context',
							}
						},
					}
				)
			).toEqual(
				{
					context: {
						some: 'context',
					},
					authenticating: false,
					userId: null,
					userModelName: 'users',
					error: null,
					initialized: false,
					initializing: true,
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
							context: {
								someMore: 'context',
							},
						},
					}
				)
			).toEqual(
				{
					context: {
						someMore: 'context',
					},
					authenticating: false,
					userId: null,
					userModelName: 'users',
					error: null,
					initialized: true,
					initializing: false,
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
					context: {},
					authenticating: true,
					userId: null,
					userModelName: 'users',
					error: null,
					initialized: false,
					initializing: false,
				}
			)
		});
	});

	describe(`should handle ${RECEIVE_LOGIN_FAILURE}`, () => {
		it('should throw on invalid payload.', () => {
			expect(() => {
				reducer(
					undefined,
					{
						type: RECEIVE_LOGIN_FAILURE,
					}
				);
			}).toThrow(/invalid payload/);
		});
		it('should set error.', () => {
			expect(
				reducer(
					undefined,
					{
						type: RECEIVE_LOGIN_FAILURE,
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
					context: {},
					authenticating: false,
					userId: null,
					userModelName: 'users',
					error: {
						code: 100,
						message: 'Unknown error.',
					},
					initialized: false,
					initializing: false,
				}
			)
		});
	});

	describe(`should handle ${RECEIVE_IDENTITY}`, () => {
		it('should throw invalid payload.', () => {
			expect(() => {
				reducer(
					undefined,
					{
						type: RECEIVE_IDENTITY,
					}
				);
			}).toThrow(/invalid payload/);
		});
		it('should set user.', () => {
			expect(
				reducer(
					undefined,
					{
						type: RECEIVE_IDENTITY,
						payload: {
							userId: 'john',
							context: {},
						},
					}
				)
			).toEqual(
				{
					context: {},
					authenticating: false,
					userId: 'john',
					userModelName: 'users',
					error: null,
					initialized: false,
					initializing: false,
				}
			)
		});
	});

	describe(`should handle ${RECEIVE_LOGOUT_SUCCESS}`, () => {
		it('should unset user.', () => {
			let state = reducer(
				Immutable.from({
					userId: 'john',
				}),
				{
					type: INIT,
				}
			);
			// state = reducer(
			// 	state,
			// 	{
			// 		type: RECEIVE_LOGOUT_SUCCESS,
			// 	}
			// );
			expect(
				reducer(
					state,
					{
						type: RECEIVE_LOGOUT_SUCCESS,
						payload: {
							context: {}
						}
					}
				)
			).toEqual(
				{
					context: {},
					authenticating: false,
					userId: null,
					userModelName: 'users',
					error: null,
					initialized: false,
					initializing: false,
				}
			)
		});
	});

});
