export const getRoutes = (state) => state.routing.routes;
export const getIsRouteActiveSelector = (routeName) => (state) => state.routing.locationRoute.name === routeName;
