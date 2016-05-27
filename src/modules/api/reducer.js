import createReducer from 'utils/createReducer';
import { SET_HOST } from './actions';
import {
	ApiContext,
	Host
} from './types';

export default createReducer(
	ApiContext,
	{
		host: null,
		service: null
	},
	{
		[SET_HOST]: [
			Host,
			(state, action) => {
				const { name, ssl } = action.payload;
				return state.merge({
					host: {name, ssl}
				}, {deep: true});
			}
		]
	}
);
