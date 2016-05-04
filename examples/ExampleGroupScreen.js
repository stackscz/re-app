import React from 'react';
import generateTabLinks from './generateTabLinks';

const examplesGroupsContext = require.context(
	're-app-examples', // base
	true, // include subdirectories
	/(utils|components|decorators|modules)\/index\.js/
);
const examplesContext = require.context(
	're-app-examples', // base
	true, // include subdirectories
	/(utils|components|decorators|modules)\/(.*)\/index\.js/
);

export default class ExampleGroupScreen extends React.Component {

	render() {
		const { children, routeParams: {group} } = this.props; // Hanky
		const ExampleLayoutComponent = examplesGroupsContext('./' + group + '/index.js').default;
		const groupExampleNames = examplesContext.keys().map((exampleName) => {
			const res = exampleName.match(new RegExp('\/' + group + '\/([^\/]*)\/index\.js'));
			return res ? res[1] : null;
		}).filter((item) => item);
		return (
			<ExampleLayoutComponent groupLinks={generateTabLinks(group, groupExampleNames)}>
				{ children }
			</ExampleLayoutComponent>
		);
	}
}
