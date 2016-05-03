import React from 'react';

import { app } from 're-app/lib/decorators';
import { createStore } from 're-app/lib/utils';
import LabeledArea from 're-app-examples/LabeledArea';

const store = createStore({
	reducers: {
		someDataSlice: (state = {}, action) => {
			if (action.type == '@@INIT') {
				return {
					myData: [1, 2, 3]
				};
			} else if (action.type == 'ADD_ITEM') {
				return {
					myData: [...state.myData, action.payload]
				};
			}
			return state;
		}
	}
});

@app(store)
export default class App extends React.Component {
	static contextTypes = {
		store: React.PropTypes.object // instruct react to look for "store" context property
	};

	addItem() {
		this.context.store.dispatch({type: 'ADD_ITEM', payload: Math.random() + ''});
		this.forceUpdate(); // Force re-render App component
	}

	render() {
		const state = this.context.store.getState();
		return (
			<div>
				<div className="well">
					<button className="btn btn-success" onClick={this.addItem.bind(this)}>
						Add "random" item!
					</button>
					<div>
						{state.someDataSlice.myData.map((item) => {
							return (
								<span className="badge badge-default" key={item}>{item}</span>
							);
						})}
					</div>
				</div>
				<LabeledArea title="Complete app state">
					<pre><code>{JSON.stringify(state, null, 2)}</code></pre>
				</LabeledArea>
			</div>
		);
	}
}
