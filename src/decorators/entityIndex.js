/* eslint-disable */
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityIndexActions } from 're-app/modules/entityIndexes';
import { actions as routingActions } from 're-app/modules/routing';
import hash from 'object-hash';
import { denormalize } from 'denormalizr';

/**
 *
 *
 */
export default function entityIndex() {
	return function wrapWithEntityIndex(EntityIndexComponent) {

		@container(
			(state, props) => {
				const collectionName = props.routeParams.collectionName;
				//const filter = props.location.query.filter;
				let { filter } = props.location.query;
				if (!filter) {
					filter = {
						offset: 0,
						limit: 10
					}
				}

				const indexHash = hash({
					collectionName,
					filter
				});
				const entityIndex = state.entityIndexes.indexes[indexHash];
				const entityDictionary = state.entityIndexes.entities[collectionName];
				const entitySchema = state.entityDescriptors.schemas[collectionName];
				const entityMapping = state.entityDescriptors.mappings[collectionName];
				const entityGridFieldset = state.entityDescriptors.fieldsets[collectionName].grid;
				const entityGridFields = entityGridFieldset || Object.keys(entitySchema.fields);
				// TODO switch to denormalize arrayOf when supported
				const entities = (entityIndex ? entityIndex.index.map((id) => {
					return denormalize(entityDictionary[id], state.entityIndexes.entities, entityMapping);
				}) : []);


				return {
					entitySchema,
					entityGridFields,
					entities,
					errors: entityIndex && entityIndex.errors,
					existingCount: entityIndex && entityIndex.existingCount,
					fetching: entityIndex && entityIndex.fetching,
					ready: entityIndex && entityIndex.ready,
					filter
				};
			},
			(dispatch, props) => {
				return {
					ensureEntityIndex: (collectionName, filter) => {
						dispatch(entityIndexActions.ensureEntityIndex(collectionName, filter));
					},
					handleFilterChange(filter) {
						dispatch(routingActions.navigate({
							name: 'entity_index',
							params: {collectionName: props.routeParams.collectionName},
							query: {filter}
						}))
					}
				};
			}
		)
		class EntityIndexContainer extends React.Component {

			componentDidMount() {
				const { ensureEntityIndex, entitySchema, filter } = this.props;
				ensureEntityIndex(entitySchema.name, filter);
			}

			render() {
				return (
					<EntityIndexComponent {...this.props} />
				);
			}
		}
		return EntityIndexContainer;
	};
}
