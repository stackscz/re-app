import React from 'react';
import _ from 'lodash';
import {container, blissComponent} from 're-app/decorators';
import { actions } from 're-app/modules/routing';
import resolveLocation from 're-app/modules/routing/utils/resolveLocation';
import { Link as ReactLink } from 'react-router';

@blissComponent
export default class Link extends React.Component {
	static contextTypes = {
		store: React.PropTypes.object.isRequired,
		routes: React.PropTypes.array
	};

	handleLinkActivation(to, e) {
		e.preventDefault();
		this.context.store.dispatch(actions.navigate(to));
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
