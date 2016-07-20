/* eslint-disable react/prop-types */
import React from 'react';
import { isArray } from 'lodash';
import blissComponent from 'decorators/blissComponent';
import './index.less';

@blissComponent
export default class ErrorMessages extends React.Component {
	render() {
		const { error, be, bm } = this.props;
		const messageClass = be('message');
		const errorMessages = !isArray(error) ?
			<span className={messageClass}>{error}</span>
			:
			error.reduce((messages, message, i) =>
				[...messages, <span key={i} className={messageClass}>{message}</span>],
			[]);
		return (
			<div className={bm()}>
				{errorMessages}
			</div>
		);
	}

}
