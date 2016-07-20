import React from 'react';

import WildForm from './ExampleForm';
import Example from 're-app-examples/Example';

const codeFiles = [
	{
		name: 'ExampleForm.js',
		content: require('!!raw!./ExampleForm.js'),
		description: 'ExampleForm',
	},
	{
		name: './PaperOrientationInput.js',
		content: require('!!raw!./PaperOrientationInput.js'),
		description: 'PaperOrientationInput',
	},
	{
		name: 'schema.json',
		content: require('!!raw!./schema.json'),
		description: 'Schema',
	},
];

export default () =>
	<Example
		readme={require('!!raw!./README.md')}
		codeFiles={codeFiles}
		sourcePath="decorators/form"
	>
		<WildForm />
	</Example>;
