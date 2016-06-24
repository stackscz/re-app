import React, { PropTypes as T } from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { blissComponent } from 're-app/decorators';

@blissComponent
export default class Btn extends React.Component {

	static propTypes = {
		children: T.node,
		icon: T.string,
		to: T.any,
		href: T.any,
		bm: T.func,
		be: T.func,
	};

	render() {
		const {
			bm,
			be,
			children,
			href,
			to,
			icon,
			...other,
			} = this.props;
		let BtnTag = 'button';
		if (href) {
			BtnTag = 'a';
		}

		let newChildren = children;
		if (!_.isArray(newChildren)) {
			newChildren = [children];
		}
		if (this.props.icon) {
			newChildren.unshift(
				<i
					key="icon-before"
					className={be('icon', '', `fa fa-fw fa-${icon}`)}
				/>
			);
		}

		if (to) {
			return (
				<Link
					className={bm()} {...other}
					onlyActiveOnIndex
					activeClassName="isActive"
				>
					{newChildren}
				</Link>
			);
		}

		return (
			<BtnTag
				name={bm()}
				{...other}
				href={href}
			>
				{newChildren}
			</BtnTag>
		);
	}
}
