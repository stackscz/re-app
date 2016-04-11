/* eslint-disable */
import _ from 'lodash';
import { takeLatest, takeEvery, isCancelError } from 'redux-saga';
import { put, select, call, take } from 'redux-saga/effects';
import hash from 'object-hash';

import {
	LOAD_ENTITY,
	loadEntitySuccess
} from './actions';
import { actions as entityIndexesActions } from 're-app/modules/entityIndexes';
import { validateObject } from 're-app/utils';
import {
	getApiService,
	getAuthContext,
	getEntitySchemas,
	getEntityMappingGetter,
	getDenormalizedEntityGetter
} from 're-app/selectors';

export function *entityEditorsSaga() {
	yield takeEvery(LOAD_ENTITY, loadEntityTask);
}

export function *loadEntityTask(action) {
	const { collectionName, entityId } = action.payload;

	yield put(entityIndexesActions.ensureEntity(collectionName, entityId));
	yield take((action) => {
		const { type: actionType, payload: actionPayload } = action;
		if (!actionPayload) {
			return false;
		}
		const {collectionName: actionCollectionName,entityId: actionEntityId} = actionPayload;
		return actionType === entityIndexesActions.ENSURE_ENTITY_SUCCESS
			&& actionCollectionName === collectionName
			&& actionEntityId === entityId;
	});
	const denormalizedEntity = yield select(getDenormalizedEntityGetter(collectionName, entityId, 1));
	yield put(loadEntitySuccess(collectionName, entityId, denormalizedEntity));
}

export default [entityEditorsSaga];
