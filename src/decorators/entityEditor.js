/* eslint-disable */
import _ from 're-app/utils/lodash';
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityEditorsActions } from 're-app/modules/entityEditors';
import { actions as entityIndexesActions } from 're-app/modules/entityIndexes';
import { denormalize } from 'denormalizr';
import { getEntityGetter } from 're-app/selectors';
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
				const editorHash = hash({collectionName, id});

				const entitySchema = state.entityDescriptors.schemas[collectionName];
				const entityFormFieldset = state.entityDescriptors.fieldsets[collectionName].form;
				//const entityFormFields = entityFormFieldset || Object.keys(entitySchema.fields);
				const entityFormFields = (entityFormFieldset || Object.keys(entitySchema.fields)).map((fieldName) => {
					const { validations } = entitySchema.fields[fieldName];
					return {
						name: fieldName,
						validations
					}
				});

				const entityEditor = state.entityEditors.editors[editorHash] || {
						ready: false,
						collectionName
					};

				const entityId = _.revealNumber(entityEditor.entityId);
				const initialData = getEntityGetter(collectionName, entityId)(state);

				return {
					entitySchema,
					entitySchemas: state.entityDescriptors.schemas,
					entityCollections: state.entityStorage.collections,
					entityFormFields,
					entityEditor,
					initialData,
					entityEditorId: editorHash,
					errors: _.get(state, ['entityStorage', 'errors', collectionName, entityId], {}),
					persisting: _.get(state, ['entityStorage', 'statuses', collectionName, entityId, 'persisting'], false)
				};
			},
			(dispatch, props) => {
				return {
					loadEditor: (preloadCollectionNames) => {
						const { collectionName, id } = props.routeParams;
						const editorHash = hash({collectionName, id});
						dispatch(entityEditorsActions.loadEditor(editorHash, collectionName, _.revealNumber(id)));
						_.each(preloadCollectionNames, (collectionName) => {
							dispatch(entityIndexesActions.ensureEntityIndex(collectionName, {limit: 10}));
						});
					},
					destroyEditor: () => {
						const { collectionName, id } = props.routeParams;
						const editorHash = hash({collectionName, id});
						dispatch(entityEditorsActions.destroyEditor(editorHash));
					},
					save: (data) => {
						const { collectionName, id } = props.routeParams;
						const editorHash = hash({collectionName, id});
						dispatch(entityEditorsActions.save(editorHash, data));
					}
				};
			}
		)
		class EntityEditorContainer extends React.Component {

			componentWillMount() {
				const { loadEditor, entitySchema } = this.props;
				loadEditor(_(entitySchema.fields).filter({type: 'association'}).map('collectionName').value());
			}

			componentWillUnmount() {
				const { destroyEditor } = this.props;
				destroyEditor();
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
