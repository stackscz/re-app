module.exports = babelPluginTransformReactEs6ClassDisplayName;

function addDisplayName(t) {
	if (
		this.node.superClass &&
		(
			this.node.superClass.name === 'Component' ||
			(
				this.node.superClass.object &&
				this.node.superClass.object.name === 'React' &&
				this.node.superClass.property.name === 'Component'
			)
		)
	) {
		var prop = t.classProperty(
			t.identifier('displayName'),
			t.stringLiteral(this.node.id.name)
		);
		prop.static = true;
		this.node.body.body.unshift(prop);
	}
}

function babelPluginTransformReactEs6ClassDisplayName(babel) {
	return {
		visitor: {
			ClassDeclaration: function (path) {
				addDisplayName.call(path, babel.types);
			},
			ArrowFunctionExpression: function (path) {
				var t = babel.types;
				var parent = path.parentPath.node;
				if (parent.type === 'VariableDeclarator') {
					var variableDeclaration = path.parentPath.parentPath;
					if (variableDeclaration.parentPath.node.type === 'Program') {
						variableDeclaration.insertAfter([
							t.expressionStatement(t.assignmentExpression(
								'=',
								t.memberExpression(parent.id, t.identifier('displayName')),
								t.stringLiteral(parent.id.name)
							)),
						]);
					}
				}
			},
		},
	};
}
