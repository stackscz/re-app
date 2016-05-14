/* eslint-disable */
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';
import { actions as entityIndexActions } from 're-app/modules/entityIndexes';
import hash from 'object-hash';
import { denormalize } from 'denormalizr';
import update from 're-app/utils/immutabilityHelper';

/**
 * Higher order component (container) for displaying listing of entities
 *
 * dependencies: entityIndexes module, entityStorage module
 *
 */
export default function entityIndex() {
	return function wrapWithEntityIndex(EntityIndexComponent) {

		@container(
			(state, props) => {
				const { collectionName, filter } = props;
				const defaultLimit = state.entityIndexes.limit;
				const existingCount = state.entityIndexes.existingCounts[collectionName];

				const indexId = hash({
					collectionName,
					filter
				});
				const entityIndex = state.entityIndexes.indexes[indexId];
				const entityDictionary = state.entityStorage.collections[collectionName];
				const entityStatuses = state.entityStorage.statuses[collectionName];
				const entitySchema = state.entityDescriptors.schemas[collectionName];
				const entityMapping = state.entityDescriptors.mappings[collectionName];
				const entityGridFieldset = state.entityDescriptors.fieldsets[collectionName].grid;
				const entityGridFields = entityGridFieldset || Object.keys(entitySchema.fields);

				// TODO switch to denormalize arrayOf when supported
				const entities = (entityIndex ? entityIndex.index.map((id) => {
					return denormalize(entityDictionary[id], state.entityStorage.collections, entityMapping);
				}) : []);

				return {
					entitySchema,
					entityGridFields,
					entities,
					entityStatuses,
					errors: !!entityIndex && entityIndex.errors,
					existingCount,
					fetching: !!entityIndex && entityIndex.fetching,
					ready: !!entityIndex && entityIndex.ready,
					filter,
					defaultLimit
				};
			},
			(dispatch, props) => {
				const { collectionName, filter } = props;
				return {
					ensureEntityIndex: () => {
						dispatch(entityIndexActions.ensureEntityIndex(collectionName, filter));
					}
				};
			}
		)
		class EntityIndexContainer extends React.Component {

			static propTypes = {
				collectionName: React.PropTypes.string.isRequired,
				filter: React.PropTypes.object
			};

			componentWillMount() {
				const { ensureEntityIndex } = this.props;
				ensureEntityIndex();
			}

			componentWillReceiveProps(props) {
				const { onEmptyIndex, entities, fetching, ready, existingCount, filter } = props;
				if ((!entities.length || existingCount === 0) && !fetching && ready) {
					onEmptyIndex(filter);
				}
			}

			render() {
				const { ensureEntityIndex, ...otherProps } = this.props;
				return (
					<EntityIndexComponent {...otherProps}/>
				);
			}
		}
		return EntityIndexContainer;
	};
}
