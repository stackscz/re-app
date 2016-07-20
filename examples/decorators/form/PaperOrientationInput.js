import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './PaperOrientationInput.less';

const PaperOrientationInput = props => {
	const { input: { value, onBlur } } = props;

	const handleOrientationChange = () => {
		onBlur(value === 'vertical' ? 'horizontal' : 'vertical');
	};

	return (
		<div className="PaperOrientationInput">
			<div
				onClick={handleOrientationChange}
				className={classnames({
					'PaperOrientationInput-paper': true,
					[`PaperOrientationInput-paper--${value}`]: true,
				})}
			>
				<div className="PaperOrientationInput-text">
					Click to change<br />
					<i className="fa fa-refresh" /> orientation
				</div>
			</div>
		</div>
	);
};

PaperOrientationInput.propTypes = {
	input: PropTypes.object,
	error: PropTypes.array,
};

export default PaperOrientationInput;
