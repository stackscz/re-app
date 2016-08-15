import { uniq, concat } from 'lodash';
import rethrowError from 'utils/rethrowError';
import apiServiceResultTypeInvariant from 'utils/apiServiceResultTypeInvariant';
import type { Error } from 'types/Error';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import {
	getModelIdPropertyName,
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';
import {
	DELETE_ENTITY,
	receiveDeleteEntitySuccess,
	receiveDeleteEntityFailure,
} from '../actions';

import getComposingModels from 'modules/entityDescriptors/utils/getComposingModels';
import getDependentModels from 'modules/entityDescriptors/utils/getDependentModels';


export function *deleteEntityTask(action) {
	const { modelName, entityId, where } = action.payload;
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const idPropertyName = yield select(getModelIdPropertyName(modelName));
	const definitions = yield select(getEntityDefinitions);

	const cm = getComposingModels({
		$ref: `#/definitions/${modelName}`,
		definitions,
	});
	const dm = getDependentModels(modelName, definitions);
	const affectedModelNames = uniq(concat(cm, dm));

	let finalWhere = where;
	if (!finalWhere) {
		finalWhere = {};
	}
	finalWhere = {
		...finalWhere,
		[idPropertyName]: entityId,
	};

	try {
		yield call(
			ApiService.deleteEntity,
			modelName,
			finalWhere,
			apiContext,
			authContext
		);
		yield put(receiveDeleteEntitySuccess(affectedModelNames, entityId));
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, Error);
		yield put(receiveDeleteEntityFailure(modelName, entityId, error));
	}
}

export default function *deleteEntityFlow() {
	yield takeEvery(DELETE_ENTITY, deleteEntityTask);
}
