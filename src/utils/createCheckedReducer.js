import createReducer from './createReducer';
import { t, getCheckedReducer } from 'redux-tcomb';

export default function createCheckedReducer(stateType, initialState, handlers) {
	return getCheckedReducer(createReducer(initialState, handlers), stateType, t.Any);
}
