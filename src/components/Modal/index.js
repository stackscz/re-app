import React from 'react';
import ReactModal2 from 'react-modal2';

export default class Modal extends React.Component {

	constructor(props) {
		super(props);
		this.handleBackdropClick = this.handleBackdropClick.bind(this);
	}

	handleBackdropClick() {
		const { onClose, closeOnBackdropClick } = this.props;
		if(closeOnBackdropClick) {
			onClose();
		}
	}

	render() {
		const {
			onClose,
			closeOnEsc,
			closeOnBackdropClick,
			children
			} = this.props;
		return (
			<ReactModal2
				onClose={onClose}
				closeOnEsc={closeOnEsc}
				closeOnBackdropClick={closeOnBackdropClick}
				backdropClassName='Modal'
				modalClassName='Modal-content'>
				<div className="Modal-row" onClick={this.handleBackdropClick}>
					<div className="Modal-cell">
						<div className="Modal-contentWraper" onClick={(e) => e.stopPropagation()}>
							{children}
						</div>
					</div>
				</div>
			</ReactModal2>
		);
	}
}

Modal.propTypes = {
	onClose: React.PropTypes.func.isRequired,
	closeOnEsc: React.PropTypes.bool,
	closeOnBackdropClick: React.PropTypes.bool
};

Modal.defaultProps = {
	closeOnEsc: true,
	closeOnBackdropClick: true,
	onClose: ()=> {
	}
};
