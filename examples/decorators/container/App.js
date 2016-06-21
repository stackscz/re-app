import React from 'react';

import Dashboard from './Dashboard';

import { app } from 're-app/lib/decorators';
import { createStore } from 're-app/lib/utils';

const store = createStore({
	reducers: {
		someDataSlice: (state = {}, action) => {
			if (action.type === '@@INIT') {
				return {
					myData: [1, 2, 3],
				};
			} else if (action.type === 'ADD_ITEM') {
				return {
					myData: [...state.myData, 'new item'],
				};
			}
			return state;
		},
	},
});

@app(store)
export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				<h1>My awesome app</h1>
				<Dashboard />
			</div>
		);
	}
}
