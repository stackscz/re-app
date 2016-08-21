import { uniq, concat, get as g } from 'lodash';
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

import {
	getAssociationsProperties,
} from 'modules/entityDescriptors/utils';

export function *deleteEntityTask(action) {
	const { modelName, entityId, where } = action.payload;
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const idPropertyName = yield select(getModelIdPropertyName(modelName));

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
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, Error);
		yield put(receiveDeleteEntityFailure(modelName, entityId, error));
		return;
	}

	const definitions = yield select(getEntityDefinitions);

	const cm = getComposingModels(g(definitions, modelName));
	const dm = getDependentModels(modelName, definitions);
	const affectedModelNames = uniq(concat(cm, dm));

	const relations = getAssociationsProperties(definitions, modelName);
	yield put(receiveDeleteEntitySuccess(affectedModelNames, entityId, relations));
}

export default function *deleteEntityFlow() {
	yield takeEvery(DELETE_ENTITY, deleteEntityTask);
}
