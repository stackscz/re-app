import React from 'react';

import Example from 're-app-examples/Example';
import App from './App';

const codeFiles = [
	{
		name: './App.js',
		content: require('!!raw!./App.js'),
		description: 'App using entityIndexes module',
	},
];

export default class EntityIndexesModuleExample extends React.Component {

	render() {
		return (
			<Example
				codeFiles={codeFiles}
				sourcePath="modules/entityIndexes"
			>
				<App />
			</Example>
		);
	}
}
