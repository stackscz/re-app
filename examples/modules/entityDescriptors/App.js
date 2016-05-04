/* eslint-disable */
import React from 'react';

import LabeledArea from 're-app-examples/LabeledArea';

import {app, container} from 're-app/lib/decorators';
import {createStore} from 're-app/lib/utils';
import apiModule from 're-app/lib/modules/api';
import authModule from 're-app/lib/modules/auth';
import entityDescriptorsModule from 're-app/lib/modules/entityDescriptors';

import ApiService from 're-app/lib/mocks/ApiService'; // mock api service

const store = createStore({
	modules: [
		apiModule, // api module must be configured
		authModule, // auth modules must be configured
		entityDescriptorsModule
	]
}, {
	api: {
		service: ApiService
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
					On app bootstrap, entityDescriptors saga first checks if <code>schemas</code> is empty.
					When empty, it tries to fetch descriptors object from ApiService.
					Then GENERATE_MAPPINGS action is dispatched and normalizr mappings are computed from schemas.
				</p>
				<LabeledArea title="Complete app state">
					<pre>{JSON.stringify(state, null, 2)}</pre>
				</LabeledArea>
			</div>
		);
	}
}
