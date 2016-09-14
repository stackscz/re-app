export const getRoutes = (state) => state.routing.routes;
export const getIsRouteActiveSelector = (routeName) =>
	(state) => state.routing.locationRoute.name === routeName;

import reverse from './utils/reverse';

export const routePathSelectorFactory = (name, params) =>
	(state) => reverse(state.routing.routes, name, params);
