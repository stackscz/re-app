/* eslint-disable */
import _ from 'lodash';
import { takeLatest, takeEvery, isCancelError } from 'redux-saga';
import { put, select, call, take } from 'redux-saga/effects';
import hash from 'object-hash';

import {
	LOAD_EDITOR,
	MERGE_ENTITY,
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
	getDenormalizedEntityGetter
} from 're-app/selectors';

export function *entityEditorsSaga() {
	yield takeEvery(LOAD_EDITOR, loadEditorTask);
}

export function *loadEditorTask(action) {
	const { collectionName, entityId } = action.payload;

	yield put(entityStorageActions.ensureEntity(collectionName, entityId));
	const resultAction = yield take((action) => {
		if (!_.includes([
				entityStorageActions.ENSURE_ENTITY_SUCCESS,
				entityStorageActions.ENSURE_ENTITY_FAILURE
			], action.type)) {
			return false;
		}
		const { collectionName: actionCollectionName, entityId: actionEntityId } = action.payload;
		return actionCollectionName === collectionName && actionEntityId === entityId;
	});
	if (resultAction.type === entityStorageActions.ENSURE_ENTITY_SUCCESS) {
		const maxAssocLevel = 1;
		const denormalizedEntity = yield select(getDenormalizedEntityGetter(collectionName, entityId, maxAssocLevel));
		yield put(loadEditorSuccess(collectionName, entityId, denormalizedEntity));
	} else {
		yield put(loadEditorFailure(collectionName, entityId));
	}
}


export function *mergeEntityFlow() {
	yield takeEvery(MERGE_ENTITY, mergeEntityTask);
}

export function *mergeEntityTask(action) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const { editorHash, data } = action.payload;
	const entitySchema = yield select(getEntitySchemaGetter(collectionName));



	debugger;
}

export function *persistEntityTask() {

}

export default [entityEditorsSaga, mergeEntityFlow];
