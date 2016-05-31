import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Modal from 'components/Modal';
import container from 'decorators/container';
import { closeModal } from 'modules/modals/actions';
import ReactCSSTransitionGroup from  'react-addons-css-transition-group';
import Portal from 'react-portal';

// TODO fix renderInModal logic

@container(
	(state) => {
		return {
			modals: state.modals
		};
	},
	(dispatch) => {
		return {
			closeModal: (modalId) => {
				dispatch(closeModal(modalId));
			}
		}
	}
)
export default class ModalManager extends React.Component {

	static propTypes = {
		modals: T.object,
		renderInBody: T.bool,
		transitionEnterTimeout: T.number,
		transitionLeaveTimeout: T.number
	};

	static defaultProps = {
		renderInBody: false,
		transitionEnterTimeout: 1,
		transitionLeaveTimeout: 1
	};

	constructor(props) {
		super(props);
		this.destroyLayer.bind(this);
		this.renderLayer.bind(this);
		this.renderModals.bind(this);
	}

	componentDidMount() {
		const { renderInBody } = this.props;
		if (renderInBody) {
			this.modalManagerElement = document.createElement("div");
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
		document.body.removeChild(this.modalManagerElement)
	}

	renderLayer() {
		ReactDOM.render(this.renderModals(), this.modalManagerElement);
	}

	renderModals() {
		const {
			modals,
			closeModal,
			transitionEnterTimeout,
			transitionLeaveTimeout
			} = this.props;
		return (
			<ReactCSSTransitionGroup transitionName="modal"
									 component="div"
									 className="ModalAnimationGroup"
									 transitionEnterTimeout={transitionEnterTimeout}
									 transitionLeaveTimeout={transitionLeaveTimeout}>
				{_.map(modals, (modalElement, modalName) => {
					return (
						<Modal key={modalName} onClose={()=>{closeModal(modalName);}}>
							<div className="Modal-row">
								<div className="Modal-cell">
									<div className="Modal-contentWraper">
										{modalElement}
									</div>
								</div>
							</div>
						</Modal>
					);
				})}
			</ReactCSSTransitionGroup>
		);
	}

	render() {
		const { renderInBody, modals } = this.props;
		if (_.isEmpty(modals)) {
			return null;
		} else {
			if (renderInBody) {
				return <div {...this.props}/>;
			} else {
				return (
					<div className="ModalManager">
						{this.renderModals()}
					</div>
				);
			}
		}
	}

}
