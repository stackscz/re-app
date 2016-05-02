import _ from 'lodash';
import React from 'react';
import './index.less';

export default class Pagination extends React.Component {
	static propTypes = {
		offset: React.PropTypes.number,
		limit: React.PropTypes.number,
		count: React.PropTypes.number,
		onPageSelect: React.PropTypes.func.isRequired
	};
	static defaultProps = {
		onPageSelect: function () {
			throw new Error('Set onPageSelect handler on Pagination component.');
		}
	};

	handlePageSelect(offset, limit, event) {
		const {onPageSelect} = this.props;
		if (event.target.dataset.disabled !== 'true') {
			onPageSelect(offset, limit);
		}
	}

	handleSetPageSize(event) {
		const {onPageSelect, offset} = this.props;
		var newLimit = parseInt(event.target.value, 10);
		onPageSelect(Math.floor(offset / newLimit), newLimit);
	}

	_getPagesCount() {
		const {count, limit} = this.props;
		return Math.ceil(count / limit);
	}

	_getPageNumber() {
		return Math.floor(this.props.offset / this.props.limit) + 1;
	}

	_getPages() {
		return _.range(1, this._getPagesCount() + 1);
	}

	_renderPageLink(index) {
		const {limit} = this.props;
		return (
			<li key={index} className={index == this._getPageNumber()?'active':''}>
				<a
					key={index}
					onClick={this.handlePageSelect.bind(this, (index - 1) * limit, limit)}
					data-disabled={index == this._getPageNumber()}
				>{index}</a>
			</li>
		);
	}

	_renderPagination() {
		const {offset, count, limit} = this.props;
		var prevOffset = offset - limit;
		if (prevOffset < 0) {
			prevOffset = false;
		}

		var nextOffset = offset + limit;
		if (nextOffset > count) {
			nextOffset = false;
		}

		var firstOffset = 0;
		var lastOffset = Math.floor(count / limit) * limit;

		return (
			<div className="Pagination">
				<div>
					Page {this._getPageNumber()} of {this._getPagesCount()}
				</div>
				<ul>
					<li className={prevOffset === false?'disabled':''}>
						<a
							onClick={this.handlePageSelect.bind(this, firstOffset, limit)}
							data-disabled={prevOffset === false}
						>
							<i className="fa fa-angle-double-left"></i>
						</a>
					</li>
					<li className={prevOffset === false?'disabled':''}>
						<a
							onClick={this.handlePageSelect.bind(this, prevOffset, limit)}
							data-disabled={prevOffset === false}
						>
							<i className="fa fa-angle-left"></i>
						</a>
					</li>
					{this._getPages().map(this._renderPageLink.bind(this))}
					<li className={nextOffset === false?'disabled':''}>
						<a
							onClick={this.handlePageSelect.bind(this, nextOffset, limit)}
							data-disabled={nextOffset === false}
						>
							<i className="fa fa-angle-right"></i>
						</a>
					</li>
					<li className={nextOffset === false?'disabled':''}>
						<a
							onClick={this.handlePageSelect.bind(this, lastOffset, limit)}
							data-disabled={nextOffset === false}
						>
							<i className="fa fa-angle-double-right"></i>
						</a>
					</li>
				</ul>

			</div>
		);
	}

	render() {
		return (
			<nav className="list-paging">
				{
					this._getPagesCount() > 1
						?
						this._renderPagination()
						:
						null
				}
			</nav>
		);
	}
}

//{
//	this.props.limitChoices && this.props.limitChoices.length > 1
//		?
//		<Select
//			value={this.props.limit}
//			options={this.props.limitChoices}
//			onChange={this.handleSetPageSize}
//		/>
//		:
//		null
//}
