// @flow
import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import { SET_HOST } from './actions';
import type Host from 'types/Host';
import type ApiContext from 'types/ApiContext';

export default createReducer(
	ApiContext,
	Immutable.from({
		host: null,
		service: null,
	}),
	{
		[SET_HOST]: [
			Host,
			(state, action) => {
				const { name, ssl } = action.payload;
				return state.merge({
					host: { name, ssl },
				}, { deep: true });
			},
		],
	}
);
