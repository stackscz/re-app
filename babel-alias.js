var path = require('path');

module.exports = {
	resolve: {
		alias: {
			're-app': path.join(__dirname, 'src'),
			'components': path.join(__dirname, 'src', 'components'),
			'containers': path.join(__dirname, 'src', 'containers'),
			'decorators': path.join(__dirname, 'src', 'decorators'),
			'effects': path.join(__dirname, 'src', 'effects'),
			'mocks': path.join(__dirname, 'src', 'mocks'),
			'modules': path.join(__dirname, 'src', 'modules'),
			'types': path.join(__dirname, 'src', 'types'),
			'utils': path.join(__dirname, 'src', 'utils'),
		}
	}
};
