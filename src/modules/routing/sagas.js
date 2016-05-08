import { takeLatest } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { NAVIGATE, locationReached } from './actions';
import resolveLocation from './utils/resolveLocation';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { getRoutes } from './selectors';

export function* watchNavigate() {
	yield* takeLatest(NAVIGATE, navigateTask);
}

export function* navigateTask(action) {
	const { to } = action.payload;
	yield put(push(resolveLocation(to, yield select(getRoutes))));
}

export function* watchLocationChange() {
	yield* takeLatest(LOCATION_CHANGE, locationChangeTask);
}


export function* locationChangeTask(action) {
	yield put(locationReached(action.payload));
}


export default [watchNavigate, watchLocationChange];
