import _ from 'lodash';
import { put, select, call } from 'redux-saga/effects';
import invariant from 'invariant';
import {
	apiServiceResultTypeInvariant
} from 're-app/utils';
import {
	initialize,
	generateMappings,
	receiveEntityDescriptors,
	receiveEntityDescriptorsFailure
} from './actions';

import {
	SchemasDictionary,
	FieldsetsDictionary
} from './types';
import t from 'tcomb';

import {
	ApiErrorResult
} from 're-app/utils/types';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntitySchemas } from 're-app/modules/entityDescriptors/selectors';

export function *entityDescriptorsFlow() {
	yield put(initialize());
	const schemas = yield select(getEntitySchemas);
	if (_.isEmpty(schemas)) {
		yield call(loadEntityDescriptorsTask);
	}
	//yield put(generateMappings());
}

export function *loadEntityDescriptorsTask() {
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	invariant(ApiService, 'api module with ApiService must be configured when entityDescriptors are not set in initial state.');
	const authContext = yield select(getAuthContext);
	let entityDescriptors;
	try {
		entityDescriptors = yield call(ApiService.getEntityDescriptors, apiContext, authContext);
		apiServiceResultTypeInvariant(entityDescriptors, t.struct({
			schemas: SchemasDictionary,
			fieldsets: FieldsetsDictionary
		}));
		yield put(receiveEntityDescriptors(entityDescriptors));
	} catch (e) {
		apiServiceResultTypeInvariant(e, ApiErrorResult);
		yield put(receiveEntityDescriptorsFailure(e));
	}
}

export default [entityDescriptorsFlow];
