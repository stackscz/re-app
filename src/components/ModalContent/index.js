import React, { PropTypes as T } from 'react';

export default class ModalContent extends React.Component {

	static propTypes = {
		children: T.node,
	};

	render() {
		const {
			children,
			} = this.props;
		return (
			<div
				className="ModalContent"
				style={{ display: 'inline-block' }}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		);
	}

}
