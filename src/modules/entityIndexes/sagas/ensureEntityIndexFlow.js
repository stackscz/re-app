// @flow

import hash from 'object-hash';
// import _ from 'lodash';
import moment from 'moment';

import { apiServiceResultTypeInvariant } from 're-app/utils';
import type { EntityIndexResult } from 'types/EntityIndexResult';
import type { Error } from 'types/Error';

import { take, call, select, put, fork } from 'redux-saga/effects';
import normalize from 'modules/entityDescriptors/utils/normalize';
import normalizeFilter from 'modules/entityIndexes/utils/normalizeFilter';
import {
	getApiContext,
	getApiService,
} from 'modules/api/selectors';
import {
	getAuthContext,
} from 'modules/auth/selectors';
import {
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';
import {
	ENSURE_ENTITY_INDEX,
	attemptFetchEntityIndex,
	receiveEntityIndex,
	fetchEntityIndexFailure,
} from '../actions';
import {
	getEntityIndexSelector,
} from '../selectors';

import {
	receiveEntities,
} from 'modules/entityStorage/actions';

export function *ensureEntityIndexTask(action) {
	const { modelName, filter, force } = action.payload;
	const indexHash = hash({ modelName, filter });
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const { content } = yield select(getEntityIndexSelector(indexHash));
	if (content && !force) {
		// do not fetch unnecessarily
		return;
	}
	yield put(attemptFetchEntityIndex(indexHash));
	try {
		const normalizedFilter = normalizeFilter(filter);
		const apiCallResult = yield call(
			ApiService.getEntityIndex,
			modelName,
			normalizedFilter,
			apiContext,
			authContext
		);
		apiServiceResultTypeInvariant(apiCallResult, EntityIndexResult);
		const entityDefinitions = yield select(getEntityDefinitions);
		const {
			result,
			entities,
		} = normalize(
			apiCallResult.data,
			{
				type: 'array',
				items: {
					$ref: `#/definitions/${modelName}`,
				},
				definitions: entityDefinitions,
			}
		);
		const nowTime = moment().format();

		// const modelIdPropertyName = yield select(getModelIdPropertyName(modelName));
		// const refs = {
		// 	[modelName]: _.reduce(
		// 		result,
		// 		(acc, id) => {
		// 			const where = { [modelIdPropertyName]: id };
		// 			return {
		// 				...acc,
		// 				[hash(where)]: {
		// 					where,
		// 					entityId: id,
		// 				},
		// 			};
		// 		},
		// 		{}
		// 	),
		// };

		yield put(receiveEntities({}, entities, nowTime));
		yield put(receiveEntityIndex(indexHash, result, apiCallResult.existingCount, nowTime));
	} catch (e) {
		apiServiceResultTypeInvariant(e, Error);
		yield put(fetchEntityIndexFailure(indexHash, e));
	}
}

const ensureEntityIndexTasks = {};

function *takeLatestEnsure(saga) {
	while (true) { // eslint-disable-line no-constant-condition
		const action = yield take((testedAction) =>
			testedAction.type === ENSURE_ENTITY_INDEX && testedAction.payload
		);
		const { modelName, filter } = action.payload;
		const indexHash = hash({ modelName, filter });
		if (!ensureEntityIndexTasks[indexHash] || !ensureEntityIndexTasks[indexHash].isRunning()) {
			ensureEntityIndexTasks[indexHash] = yield fork(saga, action);
		}
	}
}

export default function *entityIndexesFlow() {
	yield takeLatestEnsure(ensureEntityIndexTask);
}
