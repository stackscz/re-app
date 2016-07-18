import { takeEvery } from 'redux-saga';
import reloadInvalidIndexesTask from './reloadInvalidIndexesTask';
import { RECEIVE_DELETE_ENTITY_SUCCESS } from 'modules/entityStorage/actions';

export default function *invalidationDeleteFlow() {
	yield takeEvery(RECEIVE_DELETE_ENTITY_SUCCESS, reloadInvalidIndexesTask);
}
