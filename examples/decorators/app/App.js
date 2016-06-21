import React, { PropTypes as T } from 'react';

import { app } from 're-app/lib/decorators';
import { createStore } from 're-app/lib/utils';
import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app/lib/components/DevTools';

const store = createStore({
	reducers: {
		someDataSlice: (state = {}, action) => {
			if (action.type === '@@INIT') {
				return {
					myData: [1, 2, 3],
				};
			} else if (action.type === 'ADD_ITEM') {
				return {
					myData: [...state.myData, action.payload],
				};
			}
			return state;
		},
	},
});

@app(store)
export default class App extends React.Component {

	static contextTypes = {
		store: T.object, // instruct react to look for "store" context property
	};

	constructor(props) {
		super(props);
		this.addItem = this.addItem.bind(this);
	}

	addItem() {
		this.context.store.dispatch({ type: 'ADD_ITEM', payload: `${Math.random()}` });
		this.forceUpdate(); // Force re-render App component
	}

	render() {
		const state = this.context.store.getState();
		return (
			<div>
				<div className="well">
					<button className="btn btn-success" onClick={this.addItem}>
						Add "random" item!
					</button>
					<div>
						{state.someDataSlice.myData.map((item) => (
							<span className="badge badge-default" key={item}>{item}</span>
						))}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<LabeledArea title="Complete app state">
							<pre><code>{JSON.stringify(state, null, 2)}</code></pre>
						</LabeledArea>
					</div>
					<div className="col-xs-6">
						<LabeledArea title="Redux action log">
							<DevTools />
						</LabeledArea>
					</div>
				</div>
			</div>
		);
	}
}
