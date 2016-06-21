/* eslint-disable */
import React from 'react';

import LabeledArea from 're-app-examples/LabeledArea';
import LabeledJsonInspector from 're-app-examples/LabeledJsonInspector';
import DevTools from 're-app/lib/components/DevTools';

import {app, container} from 're-app/lib/decorators';
import {createStore} from 're-app/lib/utils';
import apiModule from 're-app/lib/modules/api';
import authModule from 're-app/lib/modules/auth';
import entityDescriptorsModule from 're-app/lib/modules/entityDescriptors';

import ApiService from 're-app/lib/mocks/ApiService'; // mock api service

const store = createStore(
	// config
	{
		modules: [
			apiModule, // with api module configured
			entityDescriptorsModule
		]
	},
	// initial state
	{
		api: {
			service: ApiService
		}
	}
);

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
					On app bootstrap, entityDescriptors saga first checks if <code>schemas</code> is empty.
					When empty, it tries to fetch descriptors object from ApiService.
					Then GENERATE_MAPPINGS action is dispatched and normalizr mappings are computed from schemas.
				</p>
				<div className="row">
					<div className="col-xs-6">
						<LabeledJsonInspector title="Complete app state" data={state} />
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
