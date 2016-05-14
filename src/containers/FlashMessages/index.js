import React from 'react';
import { container } from 're-app/decorators';
import {
	destroyMessage
} from 're-app/modules/flash/actions';
import classnames from 'classnames';
import './index.less';

@container(
	(state) => {
		return {
			messages: state.flash.messages
		}
	},
	(dispatch) => {
		return {
			destroyMessage: (id) => {
				dispatch(destroyMessage(id));
			}
		}
	}
)
export default class FlashMessages extends React.Component {
	render() {
		const { messages, destroyMessage } = this.props;
		return (
			<ul className="FlashMessages">
				{messages.map((message) => <li className={classnames({
				'FlashMessages-message': true,
				['list-group-item-'+(message.type || 'info')]:true
				})} key={message.id}>
					<span className="FlashMessages-messageContent">{message.content}</span>
					<button className="btn btn-xs" onClick={destroyMessage.bind(this, message.id)}>&times;</button>
				</li>)}
			</ul>
		)
	}
}
