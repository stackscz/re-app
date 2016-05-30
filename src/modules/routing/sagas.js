import { takeLatest } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { NAVIGATE } from './actions';
import resolveLocation from './utils/resolveLocation';
import { push } from 'react-router-redux';
import { getRoutes } from './selectors';

export function* watchNavigate() {
	yield* takeLatest(NAVIGATE, navigateTask);
}

export function* navigateTask(action) {
	const { to } = action.payload;
	const routes = yield select(getRoutes);
	yield put(push(resolveLocation(to, routes)));
}

export default [watchNavigate];
