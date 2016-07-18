import { takeEvery } from 'redux-saga';
import reloadInvalidIndexesTask from './reloadInvalidIndexesTask';
import { RECEIVE_PERSIST_ENTITY_SUCCESS } from 'modules/entityStorage/actions';

export default function *invalidationPersistFlow() {
	yield takeEvery(RECEIVE_PERSIST_ENTITY_SUCCESS, reloadInvalidIndexesTask);
}
