var path = require('path');

module.exports = [
	{
		useDefaultEntryPoints: false,
		entry: {
			'examples': ['./examples']
		},
		resolve: {
			alias: {
				're-app/src': path.join(__dirname, 'src'),
				're-app/lib': path.join(__dirname, 'lib'),
				're-app-examples': path.join(__dirname, 'examples'),
				'fs': path.join(__dirname, 'src', 'mocks', 'fs-stub'),
			}
		},
		module: {
			unknownContextCritical: false,
			exprContextRegExp: /$^/,
			exprContextCritical: false,
		}
	}
];
