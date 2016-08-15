import { includes } from 'lodash';
import { take } from 'redux-saga/effects';

export default function takeCollection(actionType, name) {
	return take((action) => {
		if (!action.payload) {
			return false;
		}
		const { modelName, modelNames } = action.payload;
		return action.type === actionType && (
				modelName === name ||
				includes(modelNames, name)
			);
	});
}
