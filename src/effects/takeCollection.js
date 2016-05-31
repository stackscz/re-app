import { take } from 'redux-saga/effects';

export default function takeCollection(actionType, name) {
	return take((action) => {
		if (!action.payload) {
			return false;
		}
		const { collectionName } = action.payload;
		return collectionName === name && action.type === actionType;
	})
}
