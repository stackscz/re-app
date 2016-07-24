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

	passwordStrengthCheck(password, rules : Array<Object> = defaultPasswordStrengthRules) {
		if (!password) return 0;
		return rules.reduce((score, rule) => (
			rule.pattern.test(password) ? score + rule.score : score
		), 0);
	}

	render() {
		const { password, rules, bm, be, getBlissElementClassName, getBlissModuleClassName } = this.props; // eslint-disable-line
		const passwordStrength = this.passwordStrengthCheck(password, rules);
		const message = this.passwordStrengthMessage(passwordStrength);

		return (
			<span className={bm()}>
				<span className={be('text', message.blissModifiers)}>
					{message.text}
				</span>
			</span>
		);
	}
}
