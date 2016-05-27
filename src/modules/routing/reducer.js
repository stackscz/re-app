import createReducer from 're-app/utils/createReducer';
import t from 'tcomb';
import { LOCATION_REACHED, SET_ROUTES } from './actions';

export default createReducer({
	location: null,
	routes: []
}, {
	[LOCATION_REACHED]: [
		t.struct({
			location: t.Object
		}),
		(state, action) => {
			const { location } = action.payload;
			return state.set('location', location);
		}
	],
	[SET_ROUTES]: [
		t.struct({
			routes: t.Array
		}),
		(state, action) => {
			const { routes } = action.payload;
			return state.set('routes', routes);
		}
	]
});
