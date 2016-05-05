import React from 'react';

import {app, container} from 're-app/lib/decorators';
import {createStore} from 're-app/lib/utils';
import ApiService from 're-app/lib/mocks/ApiService';
import apiModule from 're-app/lib/modules/api';
import {setHost} from 're-app/lib/modules/api/actions';

import Select from 're-app/lib/components/Select';
import Checkbox from 're-app/lib/components/Checkbox';

import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app/lib/components/DevTools';

const store = createStore({
	modules: [
		apiModule
	]
}, {
	api: {
		host: {
			name: 'example.com',
			ssl: true
		},
		service: ApiService
	}
});

@app(store)
@container(
	(state) => ({ // mapStateToProps
		state,
		api: state.api
	}),
	(dispatch) => ({ // mapDispatchToProps
		setHost: (ssl, name) => {
			dispatch(setHost(ssl, name));
		}
	})
)
export default class App extends React.Component {

	setHostname(name) {
		const { setHost, api } = this.props;
		setHost(api.host.ssl, name);
	}

	setSsl(ssl) {
		const { setHost, api } = this.props;
		setHost(ssl, api.host.name);
	}

	render() {
		const { state, api: {host} } = this.props;
		return (
			<div className="App">
				<div className="well">
					<label>
						<Select options={['example.com', 'example2.com']}
								onChange={this.setHostname.bind(this)}
								value={host.name}
						/>
					</label>
					<label>
						<Checkbox onChange={this.setSsl.bind(this)}
								  checked={host.ssl}/>
						SSL
					</label>
				</div>
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