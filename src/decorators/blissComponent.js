import React, { PropTypes as T } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default ComposedComponent => class extends React.Component {

	static propTypes = {
		children: T.node,
		moduleName: T.string,
		modifiers: T.string,
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
		let resultingModifiers;
		if (modifiers) {
			if (!_.isArray(modifiers)) {
				resultingModifiers = modifiers.split(/\s/i);
			}
			_.each(resultingModifiers, (mod) => {
				if (mod) {
					classes[`${name}--${mod}`] = true;
				}
			});
		}
		return classNames(classes);
	}

	getElementClassName(elementName, modifiers, className) {
		return this.getClassName(`${this.getModuleName()}-${elementName}`, modifiers, className);
	}

	render() {
		const {
			children,
			modifiers,
			...otherProps,
			} = this.props;
		const getBlissModuleClassName = () => this.getClassName(this.getModuleName(), modifiers);
		const getBlissElementClassName = this.getElementClassName;
		return (
			<ComposedComponent
				{...otherProps}
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
