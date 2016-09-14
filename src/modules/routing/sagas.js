import { takeLatest } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { NAVIGATE } from './actions';
import resolveLocation from './utils/resolveLocation';
import { push, replace as replaceLocation } from 'react-router-redux';
import { getRoutes } from './selectors';
import URI from 'urijs';

export function* navigateTask(action) {
	const { to, replace, reload } = action.payload;
	const routes = yield select(getRoutes);
	const targetLocation = resolveLocation(to, routes);
	if (reload) {
		const { pathname } = targetLocation;
		window.location.href = URI.decode(new URI(pathname).query(targetLocation.query).toString());
		return;
	}
	if (replace) {
		yield put(replaceLocation(targetLocation));
	} else {
		yield put(push(targetLocation));
	}
}

export function* watchNavigate() {
	yield* takeLatest(NAVIGATE, navigateTask);
}

export default [watchNavigate];
