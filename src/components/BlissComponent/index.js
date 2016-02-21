import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export default class BlissComponent extends React.Component {

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

	render() {
		const {children, name, modifiers, className, ...otherProps} = this.props;
		return (
			<this.props.tag {...otherProps} className={this.getClassName(name, modifiers, className)}>
				{children}
			</this.props.tag>
		);
	}
}

BlissComponent.propTypes = {
	name: React.PropTypes.string.isRequired
	//tag: React.PropTypes.oneOf([React.PropTypes.string, React.PropTypes.func]).isRequired
};
