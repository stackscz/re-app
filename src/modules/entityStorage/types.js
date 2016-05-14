import t from 'tcomb';
import _ from 'lodash';

export const Entity = t.Object;
export const NormalizedEntity = t.irreducible('NormalizedEntity', (entity) => {
	return _.reduce(_.values(entity), (currentResult, propValue) => {
		return !(t.Object.is(propValue) || t.list(t.Object).is(propValue));
	}, true);
});
export const EntityStatus = t.struct({
	//fetching: t.Boolean,
	//persisting: t.Boolean,
	//deleting: t.Boolean,
	transient: t.Boolean,
	validAtTime: t.maybe(t.String)
});

export const EntityError = t.Object;

export const EntityResult = t.struct({
	data: Entity
});

export const CollectionName = t.String;
export const EntityId = t.union([t.String, t.Number]);
EntityId.dispatch = (x) => _.isNumber(x) ? t.Number : t.String;

export const NormalizedEntityDictionary = t.dict(CollectionName, t.dict(EntityId, NormalizedEntity));

// UNUSED
export const NormalizedEntityResult = t.refinement(t.struct({
	result: EntityId,
	entities: NormalizedEntityDictionary
}), (x) => {
	debugger;
}, 'NormalizedEntityResult');

export const ReceiveEntityActionPayload = t.refinement(
	t.struct({
		collectionName: CollectionName,
		entityId: EntityId,
		normalizedEntities: NormalizedEntityDictionary,
		validAtTime: t.String
	}),
	(x) => {
		const requestedEntityPresent = _.get(x.normalizedEntities, [x.collectionName, x.entityId]) === x.entityId;
		//const entitiesProperlyNormalized =
		return true;
	},
	'ReceiveEntityActionPayload'
);


export const ReceiveEntitiesActionPayload = t.struct({
	normalizedEntities: NormalizedEntityDictionary,
	validAtTime: t.String
});
