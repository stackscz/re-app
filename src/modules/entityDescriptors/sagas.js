import _ from 'lodash';
import validateApiServiceResult from 're-app/modules/api/validateApiServiceResult';
import validateApiServiceErrorResult from 're-app/modules/api/validateApiServiceErrorResult';
import validateObject from 're-app/utils/validateObject';
import invariant from 'invariant';
import { put, select, call } from 'redux-saga/effects';
import {
	initialize,
	generateMappings,
	receiveEntityDescriptors,
	receiveEntityDescriptorsFailure
} from './actions';
import {
	getEntityDescriptors as getEntityDescriptorsResultType,
	getEntityDescriptorsError as getEntityDescriptorsErrorResultType
} from 're-app/modules/api/resultTypes';
import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntitySchemas, getEntityFieldsets } from 're-app/modules/entityDescriptors/selectors';

export function *entityDescriptorsFlow() {
	yield put(initialize());
	const schemas = yield select(getEntitySchemas);
	if (_.isEmpty(schemas)) {
		yield call(loadEntityDescriptorsTask);
	} else {
		const fieldsets = yield select(getEntityFieldsets);
		const error = validateObject({schemas, fieldsets}, getEntityDescriptorsResultType);
		invariant(!error, 'entityDescriptors initial state validation failed: %s', error && error.message);
	}
	yield put(generateMappings());
}

export function *loadEntityDescriptorsTask() {
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	invariant(ApiService, 'api module with ApiService must be configured when entityDescriptors are not set in initial state.');
	const authContext = yield select(getAuthContext);
	let entityDescriptors;
	try {
		entityDescriptors = yield call(ApiService.getEntityDescriptors, apiContext, authContext);
		validateApiServiceResult('getEntityDescriptors', entityDescriptors, getEntityDescriptorsResultType);
		yield put(receiveEntityDescriptors(entityDescriptors));
	} catch (e) {
		validateApiServiceErrorResult('getEntityDescriptors', e, getEntityDescriptorsErrorResultType);
		yield put(receiveEntityDescriptorsFailure(e));
	}
}

export default [entityDescriptorsFlow];
