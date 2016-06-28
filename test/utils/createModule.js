/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';

import {
	createReducer,
	createModule,
} from 'utils';
import { INIT } from 'utils/actions';

describe('utils/createModule', () => {

	it('should create valid module.', () => {
		const reducer = createReducer({ foo: 'bar', qux: 'qex' }, {
			'FOO': (state, action) => {
				return state;
			}
		});

		const sagas = [
			function* sagaOne() {
			},
			function* sagaTwo() {
			},
		];

		const expectedFooModule = {
			reducers: {
				foo: reducer
			},
			sagas
		};

		const fooModule = createModule('foo', reducer, sagas);

		expect(fooModule).toEqual(expectedFooModule);
	});

});
