/* eslint-disable max-len, space-infix-ops, react/prop-types */
import React, { Component, PropTypes as T } from 'react';
import { sortBy, find } from 'lodash';
import { blissComponent } from 'decorators';
import { defaultPasswordStrengthRules, defaultPasswordStrengthMessages } from './defaults';
import './index.less';

@blissComponent
export default class PasswordStrength extends Component {

	static propTypes = {
		password: T.string,
		rules: T.array,
		messages: T.array,
	}

	constructor(props) {
		super(props);
		const { messages } = this.props;
		this.sortedMessages = messages ?
			sortBy([...messages], 'minScore')
			:
			sortBy([...defaultPasswordStrengthMessages], 'minScore');
		this.passwordStrengthMessage = this.passwordStrengthMessage.bind(this);
		this.passwordStrengthCheck = this.passwordStrengthCheck.bind(this);
	}

	passwordStrengthMessage(strength: number) {
		return find(this.sortedMessages, message => message.minScore >= strength);
	}

	passwordStrengthCheck(password: string, rules : Array<Object> = defaultPasswordStrengthRules) {
		return rules.reduce((score, rule) => (
			rule.pattern.test(password) ? score + rule.score : score
		), 0);
	}

	render() {
		const { password, rules, bm, be } = this.props;
		const passwordStrength = this.passwordStrengthCheck(password, rules);
		const message = this.passwordStrengthMessage(passwordStrength);

		return (
			<div className={bm()}>
				<div className={be('text', message.blissModifiers)}>
					{message.text}
				</div>
			</div>
		);
	}
}
