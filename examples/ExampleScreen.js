import React from 'react';

const examplesContext = require.context(
	're-app-examples', // base
	true, // include subdirectories
	/(utils|components|decorators|modules)\/(.*)\/index\.js/
);

export default class ExampleScreen extends React.Component {
	render() {
		const { params: { group, name }} = this.props; // Hanky
		let ExampleComponent = null;
		if (name) {
			ExampleComponent = examplesContext('./' + group + '/' + name + '/index.js').default;
		}
		return ExampleComponent ? <ExampleComponent /> : null;
	}
}
