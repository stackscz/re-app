import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import {blissComponent} from 're-app/decorators';

@blissComponent
export default class Btn extends React.Component {

	render() {
		const {
			getBlissModuleClassName: bm,
			getBlissElementClassName: be,
			children,
			href,
			...other
			} = this.props;
		let BtnTag = 'button';
		if (href) {
			BtnTag = 'a';
		}

		var newChildren = children;
		if (!_.isArray(newChildren)) {
			newChildren = [children];
		}
		if (this.props.icon) {
			newChildren.unshift(<i key="icon-before" className={be('icon', '', 'fa fa-fw fa-' + this.props.icon)}/>);
		}

		return this.props.to ?
			(<Link className={bm()} {...other} onlyActiveOnIndex={true} activeClassName="isActive">{newChildren}</Link>)
			:
			(<BtnTag name={bm()} {...other} href={href}>{newChildren}</BtnTag>);
	}
}
