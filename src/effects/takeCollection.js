import { take } from 'redux-saga/effects';

export default function takeCollection(actionType, name) {
	return take((action) => {
		if (!action.payload) {
			return false;
		}
		const { modelName } = action.payload;
		return modelName === name && action.type === actionType;
	});
}
