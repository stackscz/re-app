import { createReducer } from 're-app/utils';
import { SET_HOST } from './actions';
export default createReducer({
	host: null,
	service: null
}, {
	[SET_HOST]: (state, action) => {
		const { name, ssl } = action.payload;
		return {...state, host: {name, ssl}};
	}
});
