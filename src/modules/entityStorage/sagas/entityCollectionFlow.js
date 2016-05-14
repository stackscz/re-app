import moment from 'moment';

import invariant from 'invariant';
import { typeInvariant } from 're-app/utils';
import { ApiService } from 're-app/modules/api/types';

import { takeEvery } from 'redux-saga';
import { take, call, select, put } from 'redux-saga/effects';
import { normalize, arrayOf } from 'normalizr';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntityMappingGetter } from 're-app/modules/entityDescriptors/selectors';
import {
	ENSURE_ENTITY_COLLECTION,
	receiveEntities
} from '../actions';


export default function *entityCollectionFlow() {
	yield takeEvery(ENSURE_ENTITY_COLLECTION, ensureEntityCollectionTask);
}

export function *ensureEntityCollectionTask(action) {
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);

	const { collectionName } = action.payload;
	try {
		const result = yield call(apiService.getEntityIndex, collectionName, {
			offset: 0,
			limit: -1
		}, apiContext, authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		invariant(entityMapping, 'entityStorage module depends on entityDescriptors module');
		const normalized = normalize(result.data, arrayOf(entityMapping));
		yield put(receiveEntities(normalized.entities, moment().format()));
	} catch (e) {
		throw e;
		//rethrowError(e);
	}
}

