import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { put, select, take } from 'redux-saga/effects';

import {
	LOAD_EDITOR,
	SAVE,
	loadEditorSuccess,
	loadEditorFailure
} from './actions';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';
import { getEntitySchemaGetter } from 're-app/modules/entityDescriptors/selectors';
import { getEntityGetter } from 're-app/modules/entityStorage/selectors';
import { getEntityEditorGetter } from './selectors';

export function *entityEditorsSaga() {
	yield takeEvery(LOAD_EDITOR, loadEditorTask);
}

export function *loadEditorTask(action) {
	const { editorHash, collectionName, entityId } = action.payload;

	if (!entityId) {
		yield put(loadEditorSuccess(editorHash, {}));
	} else {
		yield put(entityStorageActions.ensureEntity(collectionName, entityId));
		const resultAction = yield take((action) => {
			if (!_.includes([entityStorageActions.CONFIRM_ENTITY, entityStorageActions.RECEIVE_ENSURE_ENTITY_FAILURE], action.type)) {
				return false;
			}
			const { collectionName: actionCollectionName, entityId: actionEntityId } = action.payload;
			return actionCollectionName === collectionName && actionEntityId === entityId;
		});
		if (resultAction.type === entityStorageActions.CONFIRM_ENTITY) {
			const entity = yield select(getEntityGetter(collectionName, entityId));
			yield put(loadEditorSuccess(editorHash, entity));
		} else {
			yield put(loadEditorFailure(editorHash, resultAction.payload));
		}
	}
}

export function *saveFlow() {
	yield takeEvery(SAVE, saveTask);
}

export function *saveTask(action) {
	const { editorHash, data } = action.payload;
	const { collectionName, entityId } = yield select(getEntityEditorGetter(editorHash));
	const entitySchema = yield select(getEntitySchemaGetter(collectionName));
	yield put(entityStorageActions.mergeEntity(entitySchema, entityId, data, entitySchema.idFieldName));
}

export default [entityEditorsSaga, saveFlow];
