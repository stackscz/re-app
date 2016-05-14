export const LOAD_EDITOR = 're-app/entityEditors/LOAD_EDITOR';
export const LOAD_EDITOR_SUCCESS = 're-app/entityEditors/LOAD_EDITOR_SUCCESS';
export const LOAD_EDITOR_FAILURE = 're-app/entityEditors/LOAD_EDITOR_FAILURE';

export const DESTROY_EDITOR = 're-app/entityEditors/DESTROY_EDITOR';

export const SAVE = 're-app/entityEditors/SAVE';

export function loadEditor(editorHash, collectionName, entityId) {
	return {type: LOAD_EDITOR, payload: {editorHash, collectionName, entityId}};
}

export function loadEditorSuccess(editorHash) {
	return {type: LOAD_EDITOR_SUCCESS, payload: {editorHash}};
}

export function loadEditorFailure(editorHash, errors) {
	return {type: LOAD_EDITOR_FAILURE, payload: {editorHash, errors}};
}

export function destroyEditor(editorHash) {
	return {type: DESTROY_EDITOR, payload: {editorHash}};
}

export function save(editorHash, data) {
	return {type: SAVE, payload: {editorHash, data}};
}
