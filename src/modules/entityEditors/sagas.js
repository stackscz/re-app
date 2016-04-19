/* eslint-disable */
import _ from 'lodash';
import { takeLatest, takeEvery, isCancelError } from 'redux-saga';
import { put, select, call, take } from 'redux-saga/effects';
import hash from 'object-hash';

import {
	LOAD_EDITOR,
	SAVE,
	loadEditorSuccess,
	loadEditorFailure
} from './actions';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';
import { validateObject } from 're-app/utils';
import {
	getApiService,
	getAuthContext,
	getEntitySchemas,
	getEntitySchemaGetter,
	getEntityMappingGetter,
	getEntityGetter,
	//getDenormalizedEntityGetter,
	getEntityEditorGetter
} from 're-app/selectors';
import { normalize } from 'normalizr';

export function *entityEditorsSaga() {
	yield takeEvery(LOAD_EDITOR, loadEditorTask);
}

export function *loadEditorTask(action) {
	const { editorHash, collectionName, entityId, depth } = action.payload;

	if (!entityId) {
		yield put(loadEditorSuccess(editorHash, {}));
	} else {
		yield put(entityStorageActions.ensureEntity(collectionName, entityId));
		const resultAction = yield take((action) => {
			if (!_.includes([
					entityStorageActions.CONFIRM_ENTITY,
					entityStorageActions.RECEIVE_ENSURE_ENTITY_FAILURE
				], action.type)) {
				return false;
			}
			const { collectionName: actionCollectionName, entityId: actionEntityId } = action.payload;
			return actionCollectionName === collectionName && actionEntityId === entityId;
		});
		if (resultAction.type === entityStorageActions.CONFIRM_ENTITY) {
			//const denormalizedEntity = yield select(getDenormalizedEntityGetter(collectionName, entityId, depth || 1));
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
	const editor = yield select(getEntityEditorGetter(editorHash));
	//const entityMapping = yield select(getEntityMappingGetter(collectionName));

	//let transientEntityId;
	//const isTransient = typeof data[entitySchema.idFieldName] === 'undefined';
	//if(isTransient) {
	//	transientEntityId = hash(data);
	//}
	//const normalized = normalize({...data, [entitySchema.idFieldName]: entityId}, entityMapping);
	//let normalizedEntity = normalized.entities[collectionName][entityId];
	//if (isTransient) {
	//	delete normalizedEntity[entitySchema.idFieldName];
	//}
	//yield put(entityStorageActions.mergeEntity(collectionName, entityId, normalizedEntity, entitySchema.idFieldName));
	yield put(entityStorageActions.mergeEntity(collectionName, editor.entityId, data, entitySchema.idFieldName));
}

export default [entityEditorsSaga, saveFlow];
