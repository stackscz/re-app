/* eslint-disable */
import React from 'react';

import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app/lib/components/DevTools';

import {app, container} from 're-app/lib/decorators';
import {createStore} from 're-app/lib/utils';
import apiModule from 're-app/lib/modules/api';
import authModule from 're-app/lib/modules/auth';
import entityDescriptorsModule from 're-app/lib/modules/entityDescriptors';

const store = createStore({
	modules: [ // api module is not configured
		entityDescriptorsModule
	]
}, {
	entityDescriptors: { // entityDescriptors instead provided as initial store state
		schemas: {
			tags: {
				name: 'tags',
				idFieldName: 'name',
				displayFieldName: 'name',
				isFilterable: false,
				fields: {
					name: {
						name: 'name',
						type: 'string'
					}
				}
			}
		},
		fieldsets: {
			tags: {
				detail: ['name'],
				grid: ['name'],
				form: ['name']
			}
		}
	}
});

@app(store)
@container(
	(state) => ({
		state
	})
)
export default class App extends React.Component {

	render() {
		const { state } = this.props;
		return (
			<div className="App">
				<p>
					When api module is not configured, entityDescriptors expects its data set as initial state
				</p>
				<div className="row">
					<div className="col-xs-6">
						<LabeledArea title="Complete app state">
							<pre>{JSON.stringify(state, null, 2)}</pre>
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
