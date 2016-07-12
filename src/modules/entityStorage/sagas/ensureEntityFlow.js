import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import normalize from 'modules/entityDescriptors/utils/normalize';
import moment from 'moment';

import { rethrowError, apiServiceResultTypeInvariant, typeInvariant } from 'utils';

import type { ApiService } from 'types/ApiService';
import type { EntityResult } from 'types/EntityResult';
import type { Error } from 'types/Error';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { getEntitySchemas } from 'modules/entityDescriptors/selectors';
import {
	ENSURE_ENTITY,
	attemptFetchEntity,
	receiveFetchEntityFailure,
	receiveEntities,
} from '../actions';

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
		const result = yield call(
			apiService.getEntity,
			collectionName,
			entityId,
			apiContext,
			authContext
		);
		apiServiceResultTypeInvariant(result, EntityResult);

		const entitySchemas = yield select(getEntitySchemas);
		const normalizationResult = normalize(result.data, collectionName, entitySchemas);
		yield put(receiveEntities(normalizationResult.entities, moment().format()));
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, Error);
		yield put(receiveFetchEntityFailure(collectionName, entityId, error));
	}
}

export default function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}
