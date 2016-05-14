export const CREATE_MESSAGE = 're-app/auth/CREATE_MESSAGE';
export const DESTROY_MESSAGE = 're-app/auth/DESTROY_MESSAGE';

export function createMessage(id, content, timeout, dismissible) {
	return {type: CREATE_MESSAGE, payload: {id, content, timeout, dismissible}};
}

export function destroyMessage(id) {
	return {type: DESTROY_MESSAGE, payload: {id}};
}
