import { uniq, concat, includes, get as g } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { ensureEntityIndex } from '../actions';
import {
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';

import getComposingModels from 'modules/entityDescriptors/utils/getComposingModels';
import getDependentModels from 'modules/entityDescriptors/utils/getDependentModels';

export default function *reloadInvalidIndexesTask(action) {
	const { modelName, modelNames } = action.payload;
	const indexes = yield select((state) => state.entityIndexes.indexes);

	const definitions = yield select(getEntityDefinitions);

	let affectedModelNames = modelNames;
	if (!affectedModelNames) {
		const cm = getComposingModels(g(definitions, modelName));
		const dm = getDependentModels(modelName, definitions);
		affectedModelNames = uniq(concat(cm, dm));
	}

	for (const indexHash of Object.keys(indexes)) {
		const index = indexes[indexHash];
		console.log('CHECKING INDEX', index);
		if (includes(affectedModelNames, index.modelName) && !index.valid) {
			console.log('RELOADING INDEX', index);
			yield put(ensureEntityIndex(index.modelName, index.filter, true));
		}
	}
}
