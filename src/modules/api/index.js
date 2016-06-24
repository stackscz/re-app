import createModule from 'utils/createModule';
import reducer from './reducer';
import * as actions from './actions';

export default createModule('api', reducer, []);
export {
	actions,
	reducer,
};
