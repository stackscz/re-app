export const SET_HOST = 're-app/api/SET_HOST';

export function setHost(ssl, name) {
	return {type: SET_HOST, payload: {ssl, name}};
}
