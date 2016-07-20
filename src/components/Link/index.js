/* eslint-disable no-unused-vars, react/prop-types */
import React, { PropTypes as T } from 'react';
import { blissComponent } from 'decorators';
import { navigate } from 'modules/routing/actions';
import resolveLocation from 'modules/routing/utils/resolveLocation';
import { Link as ReactLink } from 'react-router';

@blissComponent
export default class Link extends React.Component {

	static propTypes = {
		bm: T.func,
		to: T.any,
		children: T.node,
	};

	static contextTypes = {
		store: T.object,
		routes: T.array,
	};

	constructor(props) {
		super(props);
		this.handleLinkActivation = this.handleLinkActivation.bind(this);
	}

	handleLinkActivation(to, e) {
		e.preventDefault();
		this.context.store.dispatch(navigate(to));
	}

	render() {
		const {
			to,
			children,
			bm,
			be,
			getBlissModuleClassName,
			getBlissElementClassName,
			...otherProps,
			} = this.props;
		const { routes } = this.context;
		let location = resolveLocation(to, routes);
		return (
			<ReactLink
				className={bm()}
				to={location}
				onClick={(e) => { this.handleLinkActivation(location, e); }}
				activeClassName="isActive"
				onlyActiveOnIndex
				{...otherProps}
			>
				{children}
			</ReactLink>
		);
	}
}
