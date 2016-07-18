import React from 'react';
import Markdown from 're-app-examples/Markdown';

import Default from './default';

export default class EntityIndexesModuleExamples extends React.Component {

	render() {
		return (
			<div>
				<Markdown content={require('!!raw!./README.md')} />
				<Default />
			</div>
		);
	}
}
