import React from 'react';

import Router from './Router';
import Example from 're-app-examples/Example';

const codeFiles = [
	{
		name: './Router.js',
		content: require('!!raw!./Router.js'),
		description: 'Router component',
	},
	{
		name: './Layout.js',
		content: require('!!raw!./Layout.js'),
		description: 'Application layout',
	},
	{
		name: './Dashboard.js',
		content: require('!!raw!./Dashboard.js'),
		description: 'Dashboard screen component',
	},
	{
		name: './Profile.js',
		content: require('!!raw!./Profile.js'),
		description: 'Profile screen component',
	},
	{
		name: './Listing.js',
		content: require('!!raw!./Listing.js'),
		description: 'Listing screen component',
	},
	{
		name: './BasicInfo.js',
		content: require('!!raw!./BasicInfo.js'),
		description: 'BasicInfo screen component',
	},
	{
		name: './Sessions.js',
		content: require('!!raw!./Sessions.js'),
		description: 'Sessions screen component',
	},
	{
		name: './NotFoundScreen.js',
		content: require('!!raw!./NotFoundScreen.js'),
		description: 'NotFoundScreen screen component',
	},
];

export default class RouterDecoratorExample extends React.Component {

	render() {
		return (
			<Example
				readme={require('!!raw!./README.md')}
				codeFiles={codeFiles}
				sourcePath="decorators/router.js"
			>
				<Router />
			</Example>
		);
	}
}
