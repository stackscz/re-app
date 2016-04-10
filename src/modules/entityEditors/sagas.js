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
import { getApiService, getAuthContext, getEntitySchemas, getEntityMappingGetter } from 're-app/selectors';

export function *entityEditorsSaga() {
	yield takeEvery(LOAD_ENTITY, loadEntityTask);
}

export function *loadEntityTask(action) {
	const { collectionName, entityId } = action.payload;

	yield put(entityIndexesActions.ensureEntity(collectionName, entityId));
	const successAction = yield take((action) => {
		return action.type === entityIndexesActions.ENSURE_ENTITY_SUCCESS
			&& action.payload.collectionName === collectionName
			&& action.payload.entityId === entityId;
	});
	const { entity } = successAction.payload;
	yield put(loadEntitySuccess(collectionName, entityId, entity));
}

export default [entityEditorsSaga];
