import { get as g } from 'lodash';
import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import normalize from 'modules/entityDescriptors/utils/normalize';
import moment from 'moment';
import hash from 'object-hash';

import {
	rethrowError,
	isOfType,
	typeInvariant,
} from 'utils';

import type { ApiService } from 'types/ApiService';
import type { EntityResult } from 'types/EntityResult';
import type { Error } from 'types/Error';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import {
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';
import {
	ENSURE_ENTITY,
	attemptFetchEntity,
	receiveFetchEntityFailure,
	receiveEntities,
} from '../actions';

export function *ensureEntityTask(action) {
	const { modelName, where } = action.payload;

	// ApiService is needed to ensure entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// get optional contexts to pass to ApiService
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);

	// TODO split lazy and accurate modes of fetching

	yield put(attemptFetchEntity(modelName, where));
	let apiCallResult;
	try {
		apiCallResult = yield call(
			apiService.getEntity,
			modelName,
			where,
			apiContext,
			authContext
		);
	} catch (error) {
		rethrowError(error);
		if (!isOfType(error, Error)) {
			yield put(receiveFetchEntityFailure(
				modelName,
				where,
				{
					code: 5000,
					message: 'Invalid error',
					data: error,
				}
			));
			return;
		}
		yield put(receiveFetchEntityFailure(modelName, where, error));
		return;
	}

	if (!isOfType(apiCallResult, EntityResult)) {
		yield put(receiveFetchEntityFailure(
			modelName,
			where,
			{
				code: 5000,
				message: 'Invalid entity response',
				data: apiCallResult,
			}
		));
		return;
	}

	const entityDefinitions = yield select(getEntityDefinitions);
	const {
		result,
		entities,
	} = normalize(
		apiCallResult.data,
		g(entityDefinitions, modelName),
	);

	const refs = {
		[modelName]: {
			[hash(where)]: {
				where,
				entityId: result,
			},
		},
	};

	yield put(receiveEntities(refs, entities, moment().format()));
}

export default function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}
