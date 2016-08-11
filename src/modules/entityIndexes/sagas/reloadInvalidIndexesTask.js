import { put, select } from 'redux-saga/effects';
import { ensureEntityIndex } from '../actions';

export default function *reloadInvalidIndexesTask(action) {
	const { modelName } = action.payload;
	const indexes = yield select((state) => state.entityIndexes.indexes);
	for (const indexHash of Object.keys(indexes)) {
		const index = indexes[indexHash];
		if (index.modelName === modelName && !index.valid) {
			yield put(ensureEntityIndex(index.modelName, index.filter));
		}
	}
}
