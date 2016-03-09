var path = require('path');

module.exports = {
	entry: {
		'examples/components': './examples/components'
	},
	output: {
		libraryTarget: 'commonjs'
	},
	externals: [
		'classnames',
		'lodash',
		'react',
		'react-dom',
		'redux',
		'redux-devtools',
		'redux-logger'
	],
	resolve: {
		alias: {
			're-app': path.join(__dirname, 'src'),
			're-app/examples': path.join(__dirname, 'examples')
		}
	}
};
