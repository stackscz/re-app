import React from 'react';
import { connect } from 'react-redux';

/**
 * Decorates component with react-redux connect (and in future maybe other stuff) to create container
 *
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 * @param options
 */
export default function container(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
	return function wrapWithContainer(WrappedComponent) {
		@connect(
			mapStateToProps,
			mapDispatchToProps,
			mergeProps,
			options
		)
		class Container extends React.Component {
			render() {
				return (
					<WrappedComponent {...this.props} />
				);
			}
		}
		return Container;
	};
}
