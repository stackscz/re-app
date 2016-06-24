import { put, select, call } from 'redux-saga/effects';
import invariant from 'invariant';
import {
	apiServiceResultTypeInvariant,
} from 'utils';
import {
	initialize,
	receiveEntityDescriptors,
	receiveEntityDescriptorsFailure,
} from './actions';

import {
	SchemasDictionary,
	FieldsetsDictionary,
} from './types';
import t from 'tcomb';

import {
	ApiErrorResult,
} from 'utils/types';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { isInitialized } from 'modules/entityDescriptors/selectors';

export function *loadEntityDescriptorsTask() {
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	invariant(
		ApiService,
		'api module with ApiService must be configured ' +
		'when entityDescriptors are not set in initial state.'
	);
	const authContext = yield select(getAuthContext);
	let entityDescriptors;
	try {
		entityDescriptors = yield call(ApiService.getEntityDescriptors, apiContext, authContext);
		apiServiceResultTypeInvariant(entityDescriptors, t.struct({
			schemas: SchemasDictionary,
			fieldsets: FieldsetsDictionary,
		}));
		yield put(receiveEntityDescriptors(entityDescriptors));
	} catch (e) {
		apiServiceResultTypeInvariant(e, ApiErrorResult);
		yield put(receiveEntityDescriptorsFailure(e));
	}
}

export function *entityDescriptorsFlow() {
	yield put(initialize());
	const schemasInitialized = yield select(isInitialized);
	if (!schemasInitialized) {
		yield call(loadEntityDescriptorsTask);
	}
	// yield put(generateMappings());
}

export default [entityDescriptorsFlow];
