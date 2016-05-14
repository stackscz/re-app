import {createModule} from  're-app/utils';
import reducer from './reducer';
import * as sagas from './sagas';
import mainSagas from './sagas';
import * as actions from './actions';

export default createModule('flash', reducer, mainSagas);
export {
	reducer,
	actions,
	sagas
};
