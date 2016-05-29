/* eslint-disable */
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import { typeInvariant } from 're-app/utils';
import invariant from 'invariant';
import t from 'tcomb';
import { INIT } from 're-app/utils/actions';

export default function createReducer(stateType, initialState, handlers, name) {
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
		if (action.type === INIT) {
			state = Immutable.from({...initialState, ...state});

			if (stateType && process.env.NODE_ENV !== 'production') {
				typeInvariant(state, stateType, 'Invalid state after ' + INIT);
			}
			return state;
		}

		if (handlers && handlers.hasOwnProperty(action.type)) {

			const handlerDefinition = handlers[action.type];
			let handler = handlerDefinition;
			let actionPayloadType = null;
			if (_.isArray(handler)) {
				handler = handlerDefinition[1] || (state => state);
				actionPayloadType = handlerDefinition[0];
			}
			if (actionPayloadType && process.env.NODE_ENV !== 'production') {
				actionPayloadType(action.payload);
			}

			state = handler(state, action);

			if (stateType && process.env.NODE_ENV !== 'production') {
				invariant(_.isFunction(state.asMutable), 'Reducer returned mutable state for action %s.', action.type);
				typeInvariant(state, stateType, 'Reducer "' + (name || 'unknown') + '" returned invalid state for action ' + action.type);
			}
		}
		return state;
	};
}
