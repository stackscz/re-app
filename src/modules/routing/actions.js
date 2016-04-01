export const SET_ROUTES 		= 're-app/location/SET_ROUTES';
export const NAVIGATE 			= 're-app/location/NAVIGATE';

export function setRoutes(routes) {
	return {type: SET_ROUTES, payload: routes};
}

export function navigate(to) {
	return {type: NAVIGATE, payload: to};
}
