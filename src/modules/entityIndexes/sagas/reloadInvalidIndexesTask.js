import { put, select } from 'redux-saga/effects';
import { ensureEntityIndex } from '../actions';

export default function *reloadInvalidIndexesTask() {
	const indexes = yield select((state) => state.entityIndexes.indexes);
	for (const indexHash of Object.keys(indexes)) {
		const index = indexes[indexHash];
		if (!index.valid) {
			yield put(ensureEntityIndex(index.modelName, index.filter));
		}
	}
}
