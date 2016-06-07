import { takeEvery } from 'redux-saga';
import { take, call, select, put } from 'redux-saga/effects';

import moment from 'moment';
import invariant from 'invariant';
import { arrayOf } from 'normalizr';
import normalize from 'utils/normalize';

import { rethrowError, apiServiceResultTypeInvariant, typeInvariant } from 'utils';
import { ApiService } from 're-app/modules/api/types';
import { ApiErrorResult } from 'utils/types';
import { EntityCollectionResult } from '../types';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntityMappingGetter } from 're-app/modules/entityDescriptors/selectors';

import {
	ENSURE_ENTITY_COLLECTION,
	attemptFetchEntityCollection,
	receiveFetchEntityCollectionFailure,
	receiveEntities
} from '../actions';


export default function *entityCollectionFlow() {
	yield takeEvery(ENSURE_ENTITY_COLLECTION, ensureEntityCollectionTask);
}

export function *ensureEntityCollectionTask(action) {
	const { collectionName, filter } = action.payload;

	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);

	yield put(attemptFetchEntityCollection(collectionName, filter));
	try {
		const enhancedFilter = _.merge({offset: 0, limit: -1}, filter);
		const result = yield call(apiService.getEntityIndex, collectionName, enhancedFilter, apiContext, authContext);
		apiServiceResultTypeInvariant(result, EntityCollectionResult);

		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		invariant(entityMapping, 'entityStorage module depends on entityDescriptors module');

		const normalized = normalize(result.data, arrayOf(entityMapping));
		yield put(receiveEntities(normalized.entities, moment().format()));
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, ApiErrorResult);
		yield put(receiveFetchEntityCollectionFailure(collectionName, error));
	}
}

