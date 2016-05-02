import React from 'react';

import App from './App';
import Example from '../../Example';

const codeFiles = [
	{
		name: './App.js',
		content: require('!!raw!./App.js'),
		description: 'App component rendering Dashboard container'
	},
	{
		name: './Dashboard.js',
		content: require('!!raw!./Dashboard.js'),
		description: 'container-enhanced Dashboard component'
	}
];

export default class AppDecoratorExample extends React.Component {

	render() {
		return (
			<Example readme={require('!!raw!./README.md')}
					 codeFiles={codeFiles}
					 sourcePath="decorators/container.js">
				<App />
			</Example>
		);
	}
}
