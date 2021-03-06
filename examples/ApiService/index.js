import React from 'react';

import Markdown from 're-app-examples/Markdown';
import CodeArea from 're-app-examples/CodeArea';

export default class ApiServiceExamples extends React.Component {

	render() {
		return (
			<div className="container-fluid">
				<Markdown content={require('!!raw!./README.md')} />

				<CodeArea title="Mock ApiService">
					{require('!!raw!re-app/src/mocks/ApiService')}
				</CodeArea>

				<CodeArea title="tcomb definition of ApiService">
					{require('!!raw!re-app/src/types/ApiService')}
				</CodeArea>

			</div>
		);
	}
}
