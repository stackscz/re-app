/* eslint-disable */

import { takeEvery, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { NAVIGATE } from './actions';
import resolveLocation from './utils/resolveLocation';
import { push } from 'react-router-redux';

export function* watchNavigate() {
	yield* takeLatest(NAVIGATE, navigate);
}

export function* navigate(action) {
	yield put(push(resolveLocation(action.payload, yield select(state => state.routing.routes))));
}

export default [watchNavigate];
