/* eslint-disable */
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityIndexActions } from 're-app/modules/entityIndexes';
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
				const filter = props.location.query.filter;
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
					entities
				};
			},
			(dispatch, props) => {
				return {
					ensureEntityIndex: () => {
						dispatch(entityIndexActions.ensureEntityIndex(props.routeParams.collectionName, props.location.query.filter));
					}
				};
			}
		)
		class EntityIndexContainer extends React.Component {

			componentDidMount() {
				const { ensureEntityIndex } = this.props;
				ensureEntityIndex();
			}

			render() {
				const { ensureEntityIndex, ...otherProps } = this.props;
				return (
					<EntityIndexComponent {...otherProps} />
				);
			}
		}
		return EntityIndexContainer;
	};
}
