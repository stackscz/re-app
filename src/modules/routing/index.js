import createModule from 'utils/createModule';
import reducer from './reducer';
import * as actions from './actions';
import mainSagas, * as sagas from './sagas';

export default createModule('routing', reducer, mainSagas);
export {
	reducer,
	actions,
	sagas,
};
