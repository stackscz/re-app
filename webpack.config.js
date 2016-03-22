var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = [
	{
		useDefaultEntryPoints: false,
		entry: {
			'examples/components': ['./examples/components'],
			'examples/decorators/app': ['./examples/decorators/app'],
			'examples/decorators/container': ['./examples/decorators/container'],
		},
		resolve: {
			alias: {
				're-app': path.join(__dirname, 'src'),
				're-app-examples': path.join(__dirname, 'examples')
			}
		}
	},
	{
		entry: {
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
				're-app-examples': path.join(__dirname, 'examples')
			}
		}
	}
];
