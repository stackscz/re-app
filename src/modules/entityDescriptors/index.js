import { createModule } from 're-app/utils';
import reducer from './reducer';
import actions from './actions';
import sagas from './sagas';

export default createModule('entityDescriptors', reducer, sagas);
export {
	reducer
	,actions
	,sagas
};
