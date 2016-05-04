import React from 'react';

import Example from 're-app-examples/Example';
//import App from './App';

const codeFiles = [
	//{
	//	name: './App.js',
	//	content: require('!!raw!./App.js'),
	//	description: 'App using api module'
	//}
];

export default class EntityDescriptorsModuleExample extends React.Component {

	render() {
		return (
			<Example readme={require('!!raw!./README.md')}
					 codeFiles={codeFiles}
					 sourcePath="modules/entityDescriptors">

			</Example>
		);
	}
}
