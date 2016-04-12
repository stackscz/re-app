/* eslint-disable */
import _ from 're-app/utils/lodash';
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityEditorsActions } from 're-app/modules/entityEditors';
import { denormalize } from 'denormalizr';
import { getDenormalizedEntityGetter } from 're-app/selectors';
import hash from 'object-hash';

/**
 *
 *
 */
export default function entityEditor() {
	return function wrapWithEntityEditor(EntityEditorComponent) {

		@container(
			(state, props) => {
				const { collectionName, id } = props.routeParams;
				const entityId = _.revealNumber(id);

				const entitySchema = state.entityDescriptors.schemas[collectionName];
				const entityFormFieldset = state.entityDescriptors.fieldsets[collectionName].form;
				const entityFormFields = entityFormFieldset || Object.keys(entitySchema.fields);
				const entityEditor = _.get(state.entityEditors, ['editors', collectionName, entityId], {
					ready: false,
					collectionName,
					entityId
				});

				return {
					entitySchema,
					entityFormFields,
					entityEditor
				};
			},
			(dispatch, props) => {
				return {
					loadEditor: () => {
						const { collectionName, id } = props.routeParams;
						dispatch(entityEditorsActions.loadEditor(collectionName, _.revealNumber(id)));
					},
					mergeEntity: (collectionName, entity) => {
						dispatch(entityEditorsActions.mergeEntity(collectionName, entity));
					}
				};
			}
		)
		class EntityEditorContainer extends React.Component {

			componentDidMount() {
				const { loadEditor } = this.props;
				loadEditor();
			}

			render() {
				const { loadEditor, ...otherProps } = this.props;
				return (
					<EntityEditorComponent {...otherProps} />
				);
			}
		}
		return EntityEditorContainer;
	};
}
