/* eslint-disable */
import _ from 'lodash';
import { typeInvariant } from 're-app/utils';
import invariant from 'invariant';
import t from 'tcomb';
import { INIT } from 're-app/utils/actions';

export default function createReducer(stateType, initialState, handlers) {
	if (arguments.length < 3) {
		handlers = initialState;
		initialState = stateType;
		stateType = null;
	} else {
		invariant(t.isType(stateType), 'When creating checked reducer, first argument of createReducer should be a tcomb type.');
	}

	invariant(!_.isUndefined(initialState), 'First argument of `createReducer` should be value representing initial state of reducer.');
	invariant(_.isUndefined(handlers) || _.isObject(handlers), 'Second argument of `createReducer` should be object containing reducer functions keyed by redux action type which they handle.');

	return function reducer(state = initialState, action) {
		// ignore unknown actions

		if (action.type === INIT) {
			state = {...initialState, ...state};
			if (stateType && process.env.NODE_ENV !== 'production') {
				typeInvariant(state, stateType, 'Invalid state after @@re-app/INIT');
			}
			return state;
		}

		if (handlers && handlers.hasOwnProperty(action.type)) {
			state = handlers[action.type](state, action);

			if (stateType && process.env.NODE_ENV !== 'production') {
				typeInvariant(state, stateType, 'Invalid state after reducer.');
			}
		}
		return state;
	};
}
