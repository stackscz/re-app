import createModule from 'utils/createModule';
import reducer from './reducer';
import * as actions from './actions';
import mainSagas, * as sagas from './sagas';
import * as utils from './utils';

export default createModule('entityDescriptors', reducer, mainSagas);
export {
	reducer,
	actions,
	sagas,
	utils,
};
