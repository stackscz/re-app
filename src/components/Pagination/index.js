import _ from 'lodash';
import React, { PropTypes as T } from 'react';
import './index.less';

export default class Pagination extends React.Component {

	static propTypes = {
		offset: T.number,
		limit: T.number,
		count: T.number,
		onPageSelect: T.func.isRequired,
	}

	static defaultProps = {
		onPageSelect() {
			throw new Error('Set onPageSelect handler on Pagination component.');
		},
	}

	constructor(props) {
		super(props);
		this.handlePageSelect = this.handlePageSelect.bind(this);
		this.renderPageLink = this.renderPageLink.bind(this);
	}

	getPages() {
		return _.range(1, this.getPagesCount() + 1);
	}

	getPagesCount() {
		const { count, limit } = this.props;
		return Math.ceil(count / limit);
	}

	getPageNumber() {
		return Math.floor(this.props.offset / this.props.limit) + 1;
	}

	handlePageSelect(offset, limit, event) {
		const { onPageSelect } = this.props;
		if (event.target.dataset.disabled !== 'true') {
			onPageSelect(offset, limit);
		}
	}

	handleSetPageSize(event) {
		const { onPageSelect, offset } = this.props;
		const newLimit = parseInt(event.target.value, 10);
		onPageSelect(Math.floor(offset / newLimit), newLimit);
	}

	renderPageLink(index) {
		const { limit } = this.props;
		return (
			<li key={index} className={index === this.getPageNumber() ? 'active' : ''}>
				<a
					key={index}
					onClick={() => { this.handlePageSelect((index - 1) * limit, limit); }}
					data-disabled={index === this.getPageNumber()}
				>{index}</a>
			</li>
		);
	}

	renderPagination() {
		const { offset, count, limit } = this.props;
		let prevOffset = offset - limit;
		if (prevOffset < 0) {
			prevOffset = false;
		}

		let nextOffset = offset + limit;
		if (nextOffset > count) {
			nextOffset = false;
		}

		const firstOffset = 0;
		const lastOffset = Math.floor(count / limit) * limit;

		return (
			<div className="Pagination">
				<div>
					Page {this.getPageNumber()} of {this.getPagesCount()}
				</div>
				<ul>
					<li className={prevOffset === false ? 'disabled' : ''}>
						<a
							onClick={() => { this.handlePageSelect(firstOffset, limit); }}
							data-disabled={prevOffset === false}
						>
							<i className="fa fa-angle-double-left"></i>
						</a>
					</li>
					<li className={prevOffset === false ? 'disabled' : ''}>
						<a
							onClick={() => { this.handlePageSelect(prevOffset, limit); }}
							data-disabled={prevOffset === false}
						>
							<i className="fa fa-angle-left"></i>
						</a>
					</li>
					{this.getPages().map(this.renderPageLink)}
					<li className={nextOffset === false ? 'disabled' : ''}>
						<a
							onClick={() => { this.handlePageSelect(nextOffset, limit); }}
							data-disabled={nextOffset === false}
						>
							<i className="fa fa-angle-right"></i>
						</a>
					</li>
					<li className={nextOffset === false ? 'disabled' : ''}>
						<a
							onClick={() => { this.handlePageSelect(lastOffset, limit); }}
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
					this.getPagesCount() > 1
						?
						this.renderPagination()
						:
						null
				}
			</nav>
		);
	}
}

// {
//	this.props.limitChoices && this.props.limitChoices.length > 1
//		?
//		<Select
//			value={this.props.limit}
//			options={this.props.limitChoices}
//			onChange={this.handleSetPageSize}
//		/>
//		:
//		null
// }
