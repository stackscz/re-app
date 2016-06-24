/* eslint-disable max-len */
export const INITIALIZE = 're-app/entityDescriptors/INITIALIZE';
export function initialize() {
	return { type: INITIALIZE };
}

export const RECEIVE_ENTITY_DESCRIPTORS = 're-app/entityDescriptors/RECEIVE_ENTITY_DESCRIPTORS';
export function receiveEntityDescriptors(descriptors) {
	return { type: RECEIVE_ENTITY_DESCRIPTORS, payload: descriptors };
}

export const RECEIVE_ENTITY_DESCRIPTORS_FAILURE = 're-app/entityDescriptors/RECEIVE_ENTITY_DESCRIPTORS_FAILURE';
export function receiveEntityDescriptorsFailure(error) {
	return { type: RECEIVE_ENTITY_DESCRIPTORS_FAILURE, payload: error };
}

export const GENERATE_MAPPINGS = 're-app/entityDescriptors/GENERATE_MAPPINGS';
export function generateMappings() {
	return { type: GENERATE_MAPPINGS };
}
