var path = require('path');

module.exports = [
	{
		useDefaultEntryPoints: false,
		entry: {
			'examples': ['./examples']
		},
		resolve: {
			alias: {
				're-app': path.join(__dirname, 'src'),
				're-app-examples': path.join(__dirname, 'examples')
			}
		}
	}
];
