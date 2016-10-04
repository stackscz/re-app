/* eslint-disable max-len */
import React, { PropTypes as T } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default ComposedComponent => class extends React.Component {

	static displayName = ComposedComponent.displayName || ComposedComponent.name;

	static propTypes = {
		children: T.node,
		moduleName: T.string,
		modifiers: T.string,
	};

	constructor(props) {
		super(props);
		this.getElementClassName = this.getElementClassName.bind(this);
	}

	getModuleName() {
		const { moduleName } = this.props;
		return moduleName || ComposedComponent.displayName || ComposedComponent.name;
	}

	getClassName(name, modifiers, className) {
		const classes = {
			[name]: true,
		};
		if (className) {
			classes[className] = true;
		}
		if (modifiers.length) {
			_.each(modifiers, (mod) => {
				if (mod) {
					classes[`${name}--${mod}`] = true;
				}
			});
		}
		return classNames(classes);
	}

	normalizeModifiers(modifiers) {
		if (!modifiers) return [];
		return _.isArray(modifiers) ? modifiers : modifiers.split(/\s+/i);
	}

	getElementClassName(elementName, modifiers, className) {
		const normalizedModifiers = this.normalizeModifiers(modifiers);
		return this.getClassName(`${this.getModuleName()}-${elementName}`, normalizedModifiers, className);
	}

	getModuleClassName(modifiers, userModifiers, className) {
		const normalizedModifiers = this.normalizeModifiers(modifiers);
		const normalizedUserModifiers = this.normalizeModifiers(userModifiers);
		const allModifiers = normalizedModifiers.concat(normalizedUserModifiers);
		return this.getClassName(this.getModuleName(), allModifiers, className);
	}

	render() {
		const {
			children,
			modifiers,
			moduleName, // eslint-disable-line
			...otherProps,
			} = this.props;
		const getBlissModuleClassName = (userModifiers, className) => this.getModuleClassName(modifiers, userModifiers, className);
		const getBlissElementClassName = this.getElementClassName;
		return (
			<ComposedComponent
				{...otherProps}
				modifiers={modifiers}
				getBlissModuleClassName={getBlissModuleClassName}
				bm={getBlissModuleClassName}
				getBlissElementClassName={getBlissElementClassName}
				be={getBlissElementClassName}
			>
				{children}
			</ComposedComponent>
		);
	}
};
