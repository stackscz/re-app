/* eslint-disable */
import expect from 'expect';
import Immutable from 'seamless-immutable';
import reducer from 'modules/api/reducer';
import ApiService from 'mocks/ApiService';
import {
	INIT,
} from 'utils/actions';
import {
	SET_HOST,
} from 'modules/api/actions';

describe('modules/api/reducer', () => {

	it('should return the initial state', () => {
		expect(
			reducer(undefined, {})
		).toEqual(
			{
				host: null,
				service: null,
			}
		)
	});

	it(`should throw on invalid payload of ${SET_HOST}`, () => {
		expect(() => {
			reducer(undefined, { type: SET_HOST });
		}).toThrow(/has invalid payload/ig)
	});

	it(`should handle ${SET_HOST}`, () => {
		const expectedState = {
			host: {
				name: 'example.com',
				ssl: true,
			},
			service: ApiService,
		};

		let state = reducer(
			Immutable.from({
				service: ApiService,
			}),
			{ type: INIT }
		);
		state = reducer(
			state,
			{
				type: SET_HOST,
				payload: {
					name: 'example.com',
					ssl: true,
				},
			}
		);
		expect(state).toEqual(expectedState);
	});
});
