import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import normalize from 'utils/normalize';
import moment from 'moment';
import invariant from 'invariant';

import { rethrowError, apiServiceResultTypeInvariant, typeInvariant } from 'utils';

import { EntityResult } from '../types';
import { ApiService } from 'modules/api/types';
import { ApiErrorResult } from 'utils/types';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { getEntityMappingGetter } from 'modules/entityDescriptors/selectors';
import { getEntityGetter } from '../selectors';
import {
	ENSURE_ENTITY,
	attemptFetchEntity,
	receiveFetchEntityFailure,
	receiveEntities
} from '../actions';

export default function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}

export function *ensureEntityTask(action) {
	const { collectionName, entityId } = action.payload;

	// ApiService is needed to ensure entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// get optional contexts to pass to ApiService
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);

	// TODO split lazy and accurate modes of fetching

	yield put(attemptFetchEntity(collectionName, entityId));
	try {
		const result = yield call(apiService.getEntity, collectionName, entityId, apiContext, authContext);
		apiServiceResultTypeInvariant(result, EntityResult);

		// EntityMapping is needed to normalize entity
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		invariant(entityMapping, 'entityStorage module depends on entityDescriptors module');

		const normalized = normalize(result.data, entityMapping);
		yield put(receiveEntities(normalized.entities, moment().format()));
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, ApiErrorResult);
		yield put(receiveFetchEntityFailure(collectionName, entityId, error));
	}

}
