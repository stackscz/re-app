import React from 'react';
import BlissComponentExamples from './BlissComponentExamples';
import Example from '../../Example';

const codeFiles = [
	{
		name: './BlissComponentExamples.js',
		content: require('!!raw!./BlissComponentExamples.js'),
		description: 'Example showcase component'
	},
	{
		name: './BlessedComponent.js',
		content: require('!!raw!./BlessedComponent.js'),
		description: 'blissComponent enhanced component'
	},
	{
		name: './BlessedComponent.less',
		content: require('!!raw!./BlessedComponent.less'),
		description: 'blissComponent enhanced component stylesheet'
	}
];

export default class BlissComponentExample extends React.Component {

	render() {
		return (
			<Example readme={require('!!raw!./README.md')}
					 codeFiles={codeFiles}
					 sourcePath="decorators/blissComponent.js">
				<BlissComponentExamples />
			</Example>
		);
	}
}
