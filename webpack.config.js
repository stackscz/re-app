var path = require('path');
var nodeExternals = require('webpack-node-externals');
var fs = require('fs');

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function (file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

console.log();

var libraryEntryPoints = {
	'utils': ['./src/utils'],
	'decorators': ['./src/decorators'],
	'components': ['./src/components']
};

var modulesNames = getDirectories(path.join(__dirname, 'src/modules'));
modulesNames.forEach(function (moduleName) {
	libraryEntryPoints[path.join('modules', moduleName)] = ['./' + path.join('src', 'modules', moduleName)];
});

module.exports = [
	{
		useDefaultEntryPoints: false,
		devServer: {
			historyApiFallback: {
				index: 'index.html',
				rewrites: [
					{ from: /\/examples\/decorators\/router/, to: '/examples/decorators/router.html'}
				]
			}
		},
		entry: {
			'examples/decorators/router': ['./examples/decorators/router'],
		},
		resolve: {
			alias: {
				're-app': path.join(__dirname, 'src'),
				're-app-examples': path.join(__dirname, 'examples')
			}
		}
	},
	{
		useDefaultEntryPoints: false,
		entry: {
			'examples/decorators/blissComponent': ['./examples/decorators/blissComponent'],
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
		useDefaultEntryPoints: false,
		entry: libraryEntryPoints,
		output: {
			library: 're-app',
			libraryTarget: 'umd'
		},
		externals: [
			nodeExternals()
		],
		resolve: {
			alias: {
				're-app': path.join(__dirname, 'src')
			}
		}
	}
];
