import React from 'react';

import App from './App';
import Example from '../../Example';

const codeFiles = [
	{
		name: './App.js',
		content: require('!!raw!./App.js'),
		description: 'Actual app code',
	},
];

export default class AppDecoratorExample extends React.Component {

	render() {
		return (
			<Example
				readme={require('!!raw!./README.md')}
				codeFiles={codeFiles}
				sourcePath="decorators/app.js"
			>
				<App />
			</Example>
		);
	}
}
