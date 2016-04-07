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
import { schemas as schemasSchema, fieldsets as fieldsetsSchema } from './stateSchema';
import { getApiService, getAuthContext, getEntitySchemas, getEntityMappingGetter } from 're-app/selectors';

export function *entityDescriptors() {
	yield put(initialize());
	const schemas = yield select(getEntitySchemas);
	if (_.isEmpty(schemas)) {
		yield call(loadEntityDescriptors);
	} else {
		validateObject(schemas, schemasSchema);
		yield put(generateMappings());
	}
}

export function *loadEntityDescriptors(action) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	try {
		const {schemas, fieldsets, entities} = yield call(ApiService.getEntitySchemas, authContext);
		validateObject(schemas, schemasSchema);
		validateObject(fieldsets, fieldsetsSchema);
		yield put(loadEntityDescriptorsSuccess({schemas, fieldsets}));
		yield put(generateMappings());
		for (let collectionName of Object.keys(entities)) {
			const indexHash = hash({collectionName, filter: undefined});
			const entityMapping = yield select(getEntityMappingGetter(collectionName));
			yield put(entityIndexesActions.fetchEntityIndexSuccess(collectionName, undefined, indexHash, entityMapping, entities[collectionName].length, entities[collectionName]));
		}
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(loadEntityDescriptorsFailure());
		}
		throw e;
	}
}

export default [entityDescriptors];
