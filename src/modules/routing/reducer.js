import { createReducer } from 're-app/utils';
import { LOCATION_REACHED, SET_ROUTES } from './actions';

export default createReducer({
	location: null,
	routes: []
}, {
	[LOCATION_REACHED]: (state, action) => {
		const { location } = action.payload;
		return {...state, location};
	},
	[SET_ROUTES]: (state, action) => {
		const { routes } = action.payload;
		return {...state, routes};
	}
});
