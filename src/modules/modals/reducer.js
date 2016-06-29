import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import {
	OPEN_MODAL,
	CLOSE_MODAL,
} from './actions';

export default createReducer(
	t.dict(t.String, t.Object),
	Immutable.from({}),
	{
		[OPEN_MODAL]: [
			t.struct({
				modalId: t.String,
				contentElement: t.Object,
			}),
			(state, action) => {
				const { modalId, contentElement } = action.payload;
				return state.set(modalId, contentElement);
			},
		],
		[CLOSE_MODAL]: [
			t.struct({
				modalId: t.String,
			}),
			(state, action) => {
				const { modalId } = action.payload;
				return state.without(modalId);
			},
		],
	}
);
