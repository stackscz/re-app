import 're-app-examples/index.less';

import React from 'react';
import WildForm from './WildForm';
import {createStore} from 're-app/utils';
import {app} from 're-app/decorators';

@app(createStore({}))
export default class App extends React.Component {
	render() {
		return (
			<WildForm />
		);
	}
}
