import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import { LOCATION_REACHED, SET_ROUTES } from './actions';
import { match } from 'react-router';

export default createReducer(
	t.struct({
		location: t.maybe(t.Object),
		locationRoute: t.maybe(t.Object),
		locationRoutes: t.maybe(t.Array),
		routes: t.Array,
	}),
	Immutable.from({
		location: null,
		locationRoute: null,
		locationRoutes: null,
		routes: [],
	}),
	{
		[LOCATION_REACHED]: [
			t.struct({
				location: t.Object,
			}),
			(state, action) => {
				const { location } = action.payload;
				let routes;
				let routesSync = false;
				// TODO this finishes synchronously when routes are sychronous, warn when otherwise
				match({ location, routes: state.routes }, (error, redirectLocation, renderProps) => {
					routesSync = true;
					if (error || !renderProps) {
						// do nothing, routes will be undefined
					} else {
						routes = renderProps.routes;
					}
				});

				if (routesSync) {
					return state
						.set('location', location)
						// last route is the interesting one
						.set('locationRoute', routes ? routes.pop() : undefined)
						// provide whole route chain too
						.set('locationRoutes', routes);
				}
				return state;
			},
		],
		[SET_ROUTES]: [
			t.struct({
				routes: t.Array,
			}),
			(state, action) => {
				const { routes } = action.payload;
				return state.set('routes', routes);
			},
		],
	}
);
