// @flow
import _ from 'lodash';
import defaultFilter from './defaultFilter';
import type { EntityIndexFilter } from 'types/EntityIndexFilter';

export default function normalizeFilter(filter:EntityIndexFilter):EntityIndexFilter {
	const resultFilter = _.defaults({}, filter, defaultFilter);
	if (resultFilter.order && !_.isArray(resultFilter.order)) {
		resultFilter.order = [resultFilter.order];
	}
	return resultFilter;
}
