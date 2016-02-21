var path = require('path');

module.exports = {
	output: {
		library: 're-app',
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			're-app': path.join(__dirname, 'src'),
			're-app/examples': path.join(__dirname, 'examples')
		}
	}
};
