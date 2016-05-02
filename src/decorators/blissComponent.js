import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default ComposedComponent => class extends React.Component {

	getModuleName() {
		const {moduleName} = this.props;
		return moduleName || ComposedComponent.name;
	}

	getClassName(name, modifiers, className) {
		if (className) {
			return className;
		}
		var classes = {
			[name]: true
		};
		if (modifiers) {
			_.each(modifiers.split(/\s/i), (mod) => {
				if (mod) {
					classes[name + '--' + mod] = true;
				}
			});
		}
		return classNames(classes);
	}

	getElementClassName(elementName, modifiers) {
		return this.getClassName(this.getModuleName() + '-' + elementName, modifiers);
	}

	render() {
		const {children, modifiers, ...otherProps} = this.props;
		const getBlissModuleClassName = () => {
			return this.getClassName(this.getModuleName(), modifiers);
		};
		const getBlissElementClassName = this.getElementClassName.bind(this);
		return (
			<ComposedComponent {...otherProps}
				getBlissModuleClassName={getBlissModuleClassName}
				bm={getBlissModuleClassName}
				getBlissElementClassName={getBlissElementClassName}
				be={getBlissElementClassName}>
				{children}
			</ComposedComponent>
		);
	}
};
