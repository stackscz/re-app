import React from 'react';
import classnames from 'classnames';
import './PaperOrientationInput.less';

export default class PaperOrientationInput extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func,
		value: React.PropTypes.any
	};

	static defaultProps = {
		value: 'vertical'
	};

	handleOrientationChange() {
		const {onChange, value} = this.props;
		onChange(value == 'vertical' ? 'horizontal' : 'vertical');
	}

	render() {
		const {onChange, value} = this.props;
		return (
			<div className="PaperOrientationInput">
				<div onClick={this.handleOrientationChange.bind(this)}
					 className={classnames({
					'PaperOrientationInput-paper': true,
					['PaperOrientationInput-paper--'+value]: true
					})}>

				</div>
			</div>
		);
	}
}
