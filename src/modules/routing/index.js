import { createModule } from  're-app/utils';
import reducer from './reducer';
import * as actions from './actions';
import sagas from './sagas';

export default createModule('routing', reducer, sagas);
export {
	reducer,
	actions,
	sagas
};
