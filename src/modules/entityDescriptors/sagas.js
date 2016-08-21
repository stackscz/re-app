import { put, select, call } from 'redux-saga/effects';
import invariant from 'invariant';
import {
	apiServiceResultTypeInvariant,
	rethrowError,
} from 'utils';
import {
	receiveEntityDescriptors,
	receiveEntityDescriptorsFailure,
} from './actions';

import type { DefinitionsDictionary } from 'types/DefinitionsDictionary';
import type { FieldsetsDictionary } from 'types/FieldsetsDictionary';
import type { Error } from 'types/Error';
import t from 'tcomb';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { isInitialized } from 'modules/entityDescriptors/selectors';

import {
	dereferenceDefinitions,
} from './utils';

import isOfType from 'utils/isOfType';

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
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, Error);
		yield put(receiveEntityDescriptorsFailure(e));
		return;
	}

	if (
		!isOfType(entityDescriptors, t.struct({
			definitions: DefinitionsDictionary,
			fieldsets: FieldsetsDictionary,
		}))
	) {
		yield put(receiveEntityDescriptorsFailure({
			message: 'Inavlid response',
		}));
		return;
	}

	let dereferencedDefinitions;
	try {
		dereferencedDefinitions = yield call(
			dereferenceDefinitions,
			entityDescriptors.definitions
		);
	} catch (error) {
		if (error.name === 'ReferenceError') {
			yield put(receiveEntityDescriptorsFailure({
				message: 'Circular schema',
			}));
			return;
		}
		rethrowError(error);
	}

	yield put(
		receiveEntityDescriptors(
			{
				...entityDescriptors,
				definitions: dereferencedDefinitions,
			}
		)
	);
}

export function *entityDescriptorsFlow() {
	const definitionsInitialized = yield select(isInitialized);
	if (!definitionsInitialized) {
		yield call(loadEntityDescriptorsTask);
	}
}

export default [entityDescriptorsFlow];
