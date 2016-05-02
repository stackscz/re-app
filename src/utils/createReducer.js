import _ from 'lodash';
import invariant from 'invariant';

export default function createReducer(initialState, handlers) {
	invariant(!_.isUndefined(initialState), 'First argument of `createReducer` should be value representing initial state of reducer.');
	invariant(_.isUndefined(handlers) || _.isObject(handlers), 'Second argument of `createReducer` should be object containing reducer functions keyed by redux action type which they handle.');
	return function reducer(state = initialState, action) {
		if (action.type === '@@INIT') {
			state = {...initialState, ...state};
		}
		if (handlers && handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	};
}
