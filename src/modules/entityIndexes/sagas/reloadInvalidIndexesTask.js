import { uniq, concat, includes } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { ensureEntityIndex } from '../actions';
import {
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';

import getComposingModels from 'modules/entityDescriptors/utils/getComposingModels';
import getDependentModels from 'modules/entityDescriptors/utils/getDependentModels';

export default function *reloadInvalidIndexesTask(action) {
	const { modelName } = action.payload;
	const indexes = yield select((state) => state.entityIndexes.indexes);

	const definitions = yield select(getEntityDefinitions);

	const cm = getComposingModels({
		$ref: `#/definitions/${modelName}`,
		definitions,
	});
	const dm = getDependentModels(modelName, definitions);
	const affectedModelNames = uniq(concat(cm, dm));

	for (const indexHash of Object.keys(indexes)) {
		const index = indexes[indexHash];
		if (includes(affectedModelNames, index.modelName) && !index.valid) {
			yield put(ensureEntityIndex(index.modelName, index.filter));
		}
	}
}
