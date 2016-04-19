/* eslint-disable */

import { takeEvery, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { NAVIGATE, locationReached } from './actions';
import { getCurrentRouteGetter } from 're-app/selectors';
import resolveLocation from './utils/resolveLocation';
import { push, LOCATION_CHANGE } from 'react-router-redux';

export function* watchNavigate() {
	yield* takeLatest(NAVIGATE, navigate);
}

export function* navigate(action) {
	const { to } = action.payload;
	yield put(push(resolveLocation(to, yield select(state => state.routing.routes))));
}

export function* watchLocationChange() {
	yield* takeLatest(LOCATION_CHANGE, locationChange);
}


export function* locationChange(action) {
	yield put(locationReached(action.payload));
}


export default [watchNavigate, watchLocationChange];
