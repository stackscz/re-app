var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: {
		'examples/components': ['./examples/components'],
		'utils': ['./src/utils'],
		'decorators': ['./src/decorators'],
		'components': ['./src/components']
	},
	output: {
		library: 're-app',
		libraryTarget: 'umd'
	},
	externals: [
		nodeExternals()
	],
	resolve: {
		alias: {
			're-app': path.join(__dirname, 'src'),
			're-app/examples': path.join(__dirname, 'examples')
		}
	}
};
