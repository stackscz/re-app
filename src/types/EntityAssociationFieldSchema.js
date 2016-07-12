// @flow
import type { EntityValueFieldSchema } from 'types/EntityValueFieldSchema';
export type EntityAssociationFieldSchema = EntityValueFieldSchema & {
	type: 'association',
	isMultiple: boolean,
	collectionName: string,
}
