import moment from 'moment';

import invariant from 'invariant';
import { rethrowError, apiServiceResultTypeInvariant, typeInvariant } from 're-app/utils';
import { EntityResult } from '../types';
import { ApiService } from 're-app/modules/api/types';
import { ApiErrorResult } from 're-app/utils/types';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { normalize } from 'normalizr';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntityMappingGetter } from 're-app/modules/entityDescriptors/selectors';
import { getEntityGetter } from '../selectors';
import {
	ENSURE_ENTITY,
	receiveEntity,
	receiveEntities,
	attemptFetchEntity,
	receiveFetchEntityFailure
} from '../actions';

export default function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}

export function *ensureEntityTask(action) {
	const { collectionName, entityId } = action.payload;

	// ApiService is needed to ensure entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity
	const entityMapping = yield select(getEntityMappingGetter(collectionName));
	invariant(entityMapping, 'entityStorage module depends on entityDescriptors module');


	// get optional contexts to pass to ApiService
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);

	// TODO split lazy and accurate modes of fetching

	yield put(attemptFetchEntity(collectionName, entityId));
	try {
		const result = yield call(apiService.getEntity, collectionName, entityId, apiContext, authContext);
		apiServiceResultTypeInvariant(result, EntityResult);
		const normalized = normalize(result.data, entityMapping);
		//const remoteEntityId = normalized.result;
		//debugger;
		//yield put(receiveEntity(collectionName, remoteEntityId, normalized.entities, moment().format()));
		yield put(receiveEntities(normalized.entities, moment().format()));
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, ApiErrorResult);
		yield put(receiveFetchEntityFailure(collectionName, entityId));
	}

}
