import 're-app-examples/index.less';

import React from 'react';
import {DevTools} from 're-app/components';
import Dashboard from './Dashboard';

import {app} from 're-app/decorators';
import {createStore} from 're-app/utils';

const store = createStore({
	reducers: {
		someDataSlice: (state = {}, action) => {
			if (action.type == '@@INIT') {
				return {
					myData: [1, 2, 3]
				};
			} else if (action.type == 'ADD_ITEM') {
				return {
					myData: [...state.myData, 'new item']
				}
			}
			return state;
		}
	}
});

@app(store)
export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Dashboard />
				<DevTools />
			</div>
		);
	}
}
