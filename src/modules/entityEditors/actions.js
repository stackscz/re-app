export const LOAD_EDITOR = 're-app/entityEditors/LOAD_EDITOR';
export const LOAD_EDITOR_SUCCESS = 're-app/entityEditors/LOAD_EDITOR_SUCCESS';
export const LOAD_EDITOR_FAILURE = 're-app/entityEditors/LOAD_EDITOR_FAILURE';

export const MERGE_ENTITY = 're-app/entityEditors/MERGE_ENTITY';

export function loadEditor(collectionName, entityId) {
	return {type: LOAD_EDITOR, payload: {collectionName, entityId}};
}

export function loadEditorSuccess(collectionName, entityId, entity) {
	return {type: LOAD_EDITOR_SUCCESS, payload: {collectionName, entityId, entity}};
}

export function loadEditorFailure(collectionName, entityId) {
	return {type: LOAD_EDITOR_FAILURE, payload: {collectionName, entityId}};
}

export function mergeEntity(editorHash, data) {
	return {type: MERGE_ENTITY, payload: {editorHash, data}};
}
