import React from 'react';

import fooModule from 're-app/lib/modules/foo'; // import your module
import app from 're-app/lib/decorators/app';

const store = createStore({ // create store with configuration
	modules: [
		fooModule
	]
}, { // provide initial application state
	foo: { // fooModule's initial state
		bar: 'x'
	}
});

@app(store) // apply app decorator to root of your app
export default class App extends React.Component {
	render() {
		//...
	}
}
