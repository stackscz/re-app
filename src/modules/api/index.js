import {createModule} from  're-app/utils';
import reducer from './reducer';
import * as actions from './actions';

export default createModule('api', reducer, []);
export {
	actions,
	reducer
};
