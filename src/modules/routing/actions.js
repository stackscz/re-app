export const SET_ROUTES 		= 're-app/routing/SET_ROUTES';
export const NAVIGATE 			= 're-app/routing/NAVIGATE';

export function setRoutes(routes) {
	return {type: SET_ROUTES, payload: routes};
}

export function navigate(to) {
	return {type: NAVIGATE, payload: to};
}
