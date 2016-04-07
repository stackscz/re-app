export const INITIALIZE = 're-app/entityDescriptors/INITIALIZE';
export const LOAD_ENTITY_DESCRIPTORS = 're-app/entityDescriptors/LOAD_ENTITY_DESCRIPTORS';
export const LOAD_ENTITY_DESCRIPTORS_SUCCESS = 're-app/entityDescriptors/LOAD_ENTITY_DESCRIPTORS_SUCCESS';
export const LOAD_ENTITY_DESCRIPTORS_FAILURE = 're-app/entityDescriptors/LOAD_ENTITY_DESCRIPTORS_FAILURE';
export const GENERATE_MAPPINGS = 're-app/entityDescriptors/GENERATE_MAPPINGS';

export function initialize() {
	return {type: INITIALIZE};
}

export function loadEntityDescriptors() {
	return {type: LOAD_ENTITY_DESCRIPTORS};
}

export function loadEntityDescriptorsSuccess(descriptors) {
	return {type: LOAD_ENTITY_DESCRIPTORS_SUCCESS, payload: descriptors};
}

export function loadEntityDescriptorsFailure() {
	return {type: LOAD_ENTITY_DESCRIPTORS_FAILURE};
}

export function generateMappings() {
	return {type: GENERATE_MAPPINGS};
}
