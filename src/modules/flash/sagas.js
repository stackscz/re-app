import _ from 'lodash';
import hash from 'object-hash';
import moment from 'moment';
import { take, fork, put, select, race } from 'redux-saga/effects';

import {
	actions as entityStorageActions
} from 're-app/modules/entityStorage';

import {
	DESTROY_MESSAGE,
	createMessage,
	destroyMessage
} from './actions';

export function* flashFlow() {
	while (true) { // eslint-disable-line no-constant-condition
		const action = yield take([entityStorageActions.ENSURE_ENTITY]);
		const flashId = hash({action, time: moment().format()});
		yield put(createMessage(flashId, JSON.stringify(action, null, 2)));
		yield fork(flashLifeTask, flashId);
	}
}

export function *flashLifeTask(flashId) {
	const flashMessage = yield select((state) => {
		const flashIndex = _.findIndex(state.flash.messages, {id: flashId});
		if (flashIndex > -1) {
			return state.flash.messages[flashIndex];
		}
	});
	if (flashMessage) {
		const raceSpec = {};
		if (flashMessage.timeout > 0) {
			raceSpec.timeout = new Promise(resolve => setTimeout(resolve.bind(this, true), flashMessage.timeout));
		}
		if (flashMessage.dismissible) {
			raceSpec.dismiss = take((action) => {
				if (action.type !== DESTROY_MESSAGE) {
					return false;
				}
				const { id } = action.payload;
				return id === flashId;
			});
		}
		const { timeout } = yield race(raceSpec);
		if (timeout) {
			yield put(destroyMessage(flashId));
		}
	}
}

export default [flashFlow];
