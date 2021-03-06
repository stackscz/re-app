export const SET_ROUTES = 're-app/routing/SET_ROUTES';
export function setRoutes(routes) {
	return { type: SET_ROUTES, payload: { routes } };
}

export const NAVIGATE = 're-app/routing/NAVIGATE';
export function navigate(to) {
	return { type: NAVIGATE, payload: { to } };
}

export const LOCATION_REACHED = 're-app/routing/LOCATION_REACHED';
export function locationReached(location) {
	return { type: LOCATION_REACHED, payload: { location } };
}
