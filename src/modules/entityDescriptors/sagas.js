/* eslint-disable */

import _ from 'lodash';
import { takeLatest, isCancelError } from 'redux-saga';
import { put, select, call } from 'redux-saga/effects';
import hash from 'object-hash';
import {
	LOAD_ENTITY_DESCRIPTORS,
	initialize,
	generateMappings,
	loadEntityDescriptorsSuccess,
	loadEntityDescriptorsFailure
} from './actions';
import { actions as entityIndexesActions } from 're-app/modules/entityIndexes';
import { validateObject } from 're-app/utils';
import { schemas as schemasSchema, fieldsets as fieldsetsSchema } from './state.spec.js';
import { getApiService, getAuthContext, getEntitySchemas, getEntityMappingGetter } from 're-app/selectors';

export function *entityDescriptors() {
	yield put(initialize());
	const schemas = yield select(getEntitySchemas);
	if (_.isEmpty(schemas)) {
		yield call(loadEntityDescriptors);
	}
	validateObject(schemas, schemasSchema);
	yield put(generateMappings());
}

export function *loadEntityDescriptors(action) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	try {
		const {schemas, fieldsets} = yield call(ApiService.getEntitySchemas, authContext);
		validateObject(schemas, schemasSchema);
		validateObject(fieldsets, fieldsetsSchema);
		yield put(loadEntityDescriptorsSuccess({schemas, fieldsets}));
		//for (let collectionName of Object.keys(entities)) {
		//	const entityMapping = yield select(getEntityMappingGetter(collectionName));
		//	yield put(entityIndexesActions.receiveEntityIndex(collectionName, undefined, entityMapping, entities[collectionName].length, entities[collectionName]));
		//}
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(loadEntityDescriptorsFailure());
		}
		throw e;
	}
}

export default [entityDescriptors];
