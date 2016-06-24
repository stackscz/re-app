import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Modal from 'components/Modal';
import container from 'decorators/container';
import { closeModal } from 'modules/modals/actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// TODO fix renderInModal logic

@container(
	(state) => ({
		modals: state.modals,
	}),
	(dispatch) => ({
		handleCloseModal: (modalId) => {
			dispatch(closeModal(modalId));
		},
	})
)
export default class ModalManager extends React.Component {

	static propTypes = {
		modals: T.object,
		handleCloseModal: T.func,
		renderInBody: T.bool,
		transitionEnterTimeout: T.number,
		transitionLeaveTimeout: T.number,
	};

	static defaultProps = {
		renderInBody: false,
		transitionEnterTimeout: 1,
		transitionLeaveTimeout: 1,
	};

	constructor(props) {
		super(props);
		this.destroyLayer = this.destroyLayer.bind(this);
		this.renderLayer = this.renderLayer.bind(this);
		this.renderModals = this.renderModals.bind(this);
	}

	componentDidMount() {
		const { renderInBody } = this.props;
		if (renderInBody) {
			this.modalManagerElement = document.createElement('div');
			this.modalManagerElement.className = 'ModalManager';
			document.body.appendChild(this.modalManagerElement);
			this.renderLayer();
		}
	}

	componentDidUpdate() {
		const { renderInBody } = this.props;
		if (renderInBody) {
			this.renderLayer();
		}
	}

	componentWillUnmount() {
		const { renderInBody } = this.props;
		if (renderInBody) {
			this.destroyLayer();
		}
	}

	destroyLayer() {
		ReactDOM.unmountComponentAtNode(this.modalManagerElement);
		document.body.removeChild(this.modalManagerElement);
	}

	renderLayer() {
		ReactDOM.render(this.renderModals(), this.modalManagerElement);
	}

	renderModals() {
		const {
			modals,
			handleCloseModal,
			transitionEnterTimeout,
			transitionLeaveTimeout,
			} = this.props;
		return (
			<ReactCSSTransitionGroup
				transitionName="modal"
				component="div"
				className="ModalAnimationGroup"
				transitionEnterTimeout={transitionEnterTimeout}
				transitionLeaveTimeout={transitionLeaveTimeout}
			>
				{_.map(modals, (modalElement, modalName) => (
					<Modal key={modalName} onClose={() => { handleCloseModal(modalName); }}>
						{modalElement}
					</Modal>
				))}
			</ReactCSSTransitionGroup>
		);
	}

	render() {
		const { renderInBody, modals } = this.props;
		if (_.isEmpty(modals)) {
			return null;
		}
		if (renderInBody) {
			return <div {...this.props} />;
		}
		return (
			<div className="ModalManager">
				{this.renderModals()}
			</div>
		);
	}

}
