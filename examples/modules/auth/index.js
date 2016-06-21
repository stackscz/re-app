import React from 'react';

import Example from 're-app-examples/Example';
import App from './App';

const codeFiles = [
	{
		name: './App.js',
		content: require('!!raw!./App.js'),
		description: 'App using api module',
	},
	{
		name: './LoginForm.js',
		content: require('!!raw!./LoginForm.js'),
		description: 'Login form component',
	},
];

export default class AuthModuleExample extends React.Component {

	render() {
		return (
			<Example
				readme={require('!!raw!./README.md')}
				codeFiles={codeFiles}
				sourcePath="modules/auth"
			>
				<App />
			</Example>
		);
	}
}
