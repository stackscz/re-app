import React from 'react';
import _ from 'lodash';
import { blissComponent } from 'decorators';
import { navigate } from 'modules/routing/actions';
import resolveLocation from 'modules/routing/utils/resolveLocation';
import { Link as ReactLink } from 'react-router';

@blissComponent
export default class Link extends React.Component {
	static contextTypes = {
		store: React.PropTypes.object.isRequired,
		routes: React.PropTypes.array
	};

	handleLinkActivation(to, e) {
		e.preventDefault();
		this.context.store.dispatch(navigate(to));
	}

	render() {
		const {
			to,
			children,
			getBlissModuleClassName: bm,
			getBlissElementClassName: be,
			...otherProps
			} = this.props;
		const {routes} = this.context;
		let location = resolveLocation(to, routes);
		return (
			<ReactLink
				className={bm()}
				to={location}
				onClick={this.handleLinkActivation.bind(this, location)}
				activeClassName="isActive"
				onlyActiveOnIndex={true}
				{...otherProps}>
				{children}
			</ReactLink>
		);
	}
}
