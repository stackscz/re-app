// @flow
/* eslint-disable */
import _ from 'lodash';
import expect from 'expect';
import Immutable from 'seamless-immutable';

/**
 * Utility to reduce boilerplate when testing reducers
 *
 * @example
 *
 * itHandlesAction(
 *    reducer,
 *    'FOO_ACTION',
 *    [
 *        [
 *            'handles foo when initialState undefined', // message
 *            undefined, // initial state
 *            { // action payload
 *                 some: 'payload data'
 *            },
 *            { // next state `expect` expectations
 *                toInclude: {
 *                    content: 'payload data'
 *                },
 *                toExclude: {
 *                    unwanted: 'value'
 *                }
 *            },
 *        ],
 *        [
 *            'handles foo when specific initialState',
 *            {
 *                content: 'old data'
 *            },
 *            {
 *                 some: 'payload data'
 *            },
 *            {
 *                toInclude: {
 *                     content: 'payload data'
 *                },
 *            },
 *        ],
 *    ]
 * );
 *
 *
 * @param reducer {Function} - Reducer to test
 * @param actionType {string} -
 * @param testCases {Array<Array<any>>} - array of test cases
 * @param options {Object} - options
 */
export default function itHandlesAction(reducer:Function,
										actionType:string,
										testCases:Array<[string, any, Object, {[key: string]:any}]>, // message, initialState, action, expectations
										options:Object<{immutable?: boolean}> = {}) {
	const opts = _.defaults(options, {
		immutable: true,
	});

	describe(`handles ${actionType}`, () => {
		_.each(testCases, (testCase) => {
			let message = testCase[0];
			let initialState = testCase[1];
			initialState = opts.immutable !== false && initialState ? Immutable.from(initialState) : initialState;
			const actionPayload = testCase[2];
			const expectations = testCase[3];
			const result = reducer(initialState, { type: actionType, payload: actionPayload });
			_.each(expectations, (expectedState, expectation) => {
				it(`${message}`, () => {
					expect(result)[expectation](expectedState);
				});
			});
		});
	});
}

//${JSON.stringify(initialState, null, '\t')}
