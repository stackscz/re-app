import t from 'tcomb';

import {
	Entity
} from 're-app/modules/entityStorage/types';

export const EntityList = t.list(Entity);

export const EntityIndexResult = t.struct({
	data: EntityList,
	existingCount: t.Number
});

export const EntityIndexFilter = t.struct({
	offset: t.Number,
	limit: t.Number,
	page: t.Nil
});
