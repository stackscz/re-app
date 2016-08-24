/* eslint-disable max-len */
import React, { PropTypes as T } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default ComposedComponent => class extends React.Component {

	static propTypes = {
		children: T.node,
		moduleName: T.string,
		modifiers: T.string,
		customClass: T.string,
	}

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
		const {
			customClass,
		} = this.props;
		const normalizedModifiers = this.normalizeModifiers(modifiers);
		return this.getClassName(`${this.getModuleName()}-${elementName}`, normalizedModifiers, [className, customClass].join(' '));
	}

	getModuleClassName(modifiers, userModifiers, className, customClass) {
		const normalizedModifiers = this.normalizeModifiers(modifiers);
		const normalizedUserModifiers = this.normalizeModifiers(userModifiers);
		const allModifiers = normalizedModifiers.concat(normalizedUserModifiers);
		return this.getClassName(this.getModuleName(), allModifiers, [className, customClass].join(' '));
	}

	render() {
		const {
			children,
			modifiers,
			customClass,
			...otherProps,
		} = this.props;

		const getBlissModuleClassName = (userModifiers, className) => this.getModuleClassName(modifiers, userModifiers, className, customClass);

		const getBlissElementClassName = this.getElementClassName;

		return (
			<ComposedComponent
				{...otherProps}
				modifiers={modifiers}
				customClass={customClass}
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
