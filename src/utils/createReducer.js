/* eslint-disable */
import _ from 'lodash';
import { typeInvariant } from 're-app/utils';
import invariant from 'invariant';
import t from 'tcomb';

export default function createReducer(stateType, initialState, handlers) {
	var serverStateMerged = false;

	if (arguments.length < 3) {
		handlers = initialState;
		initialState = stateType;
		stateType = null;
	} else {
		invariant(t.isType(stateType), 'When creating checked reducer, first argument of createReducer should be a tcomb type.');
	}

	invariant(!_.isUndefined(initialState), 'First argument of `createReducer` should be value representing initial state of reducer.');
	invariant(_.isUndefined(handlers) || _.isObject(handlers), 'Second argument of `createReducer` should be object containing reducer functions keyed by redux action type which they handle.');

	return function reducer(state, action) {
		// don't do this, https://github.com/reactjs/redux/issues/186
		//if (action.type === '@@INIT') {
		//	state = {...initialState, ...state};
		//}

		if (typeof state === 'undefined') {
			state = initialState;
		} else if (!serverStateMerged) {
			state = {...initialState, ...state};
			serverStateMerged = true;
		}

		if (serverStateMerged && stateType && process.env.NODE_ENV !== 'production') {
			typeInvariant(state, stateType, 'before reducer');
		}

		if (handlers && handlers.hasOwnProperty(action.type)) {
			state = handlers[action.type](state, action);
		}

		if (serverStateMerged && stateType && process.env.NODE_ENV !== 'production') {
			typeInvariant(state, stateType, 'after reducer');
		}

		return state;
	};
}
