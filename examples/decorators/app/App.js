import 're-app-examples/index.less';

import React from 'react';
import {DevTools} from 're-app/components';

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
	static contextTypes = {
		store: React.PropTypes.object
	};

	addItem() {
		this.context.store.dispatch({type: 'ADD_ITEM'});
		this.forceUpdate(); // Force rerender App component
	}

	render() {
		return (
			<div className="App">
				<h1>My awesome app</h1>
				<button onClick={this.addItem.bind(this)}>Add item</button>
				<pre>{JSON.stringify(this.context.store.getState(), null, 2)}</pre>
				<DevTools />
			</div>
		);
	}
}
