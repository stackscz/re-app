import React from 'react';

import Example from 're-app-examples/Example';
import App from './App';
import AppWithoutApi from './without-api/App';

const codeFiles = [
	{
		name: './App.js',
		content: require('!!raw!./App.js'),
		description: 'App using entityDescriptors module'
	}
];

const codeFilesWithoutApi = [
	{
		name: './without-api/App.js',
		content: require('!!raw!./without-api/App.js'),
		description: 'Using entityDescriptors without api module'
	}
];

export default class EntityDescriptorsModuleExample extends React.Component {

	render() {
		return (
			<div>
				<Example readme={require('!!raw!./README.md')}
						 codeFiles={codeFiles}
						 sourcePath="modules/entityDescriptors">
					<App />
				</Example>
				<Example codeFiles={codeFilesWithoutApi}
						 sourcePath="modules/entityDescriptors">
					<AppWithoutApi />
				</Example>
			</div>
		);
	}
}
