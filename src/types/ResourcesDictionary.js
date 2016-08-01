// @flow
import type { Resource } from 'types/Resource';
export type ResourcesDictionary = {
	[key: string]: {
		DETAIL?: Resource,
		INDEX?: Resource,
		CREATE?: Resource,
		UPDATE?: Resource,
		DELETE?: Resource,
	}
};
