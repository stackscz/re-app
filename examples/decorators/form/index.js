import React from 'react';

import WildForm from './WildForm';
import Example from 're-app-examples/Example';

export default class FormDecoratorExample extends React.Component {

	render() {
		return (
			<Example readme={require('!!raw!./README.md')} codeFiles={[
				{content: require('!!raw!./WildForm.js'), description: 'WildForm'},
				{content: require('!!raw!./PaperOrientationInput.js'), description: 'PaperOrientationInput'}
			]}>
				<WildForm />
			</Example>
		);
	}
}
