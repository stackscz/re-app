import _ from 're-app/utils/lodash';
import React from 'react';
import { container } from 're-app/decorators';
import { actions as entityEditorsActions } from 're-app/modules/entityEditors';
import { actions as entityIndexesActions } from 're-app/modules/entityIndexes';
import { getEntityGetter } from 're-app/modules/entityStorage/selectors';
import hash from 'object-hash';

/**
 *
 *
 */
export default function entityEditor() {
	return function wrapWithEntityEditor(EntityEditorComponent) {

		@container(
			(state, props) => {
				const { collectionName, entityId, fieldset} = props;

				const editorHash = hash({collectionName, entityId});
				const entitySchema = state.entityDescriptors.schemas[collectionName];
				const entityFormFieldset = fieldset || state.entityDescriptors.fieldsets[collectionName].form;
				//debugger;
				//const entityFormFields = entityFormFieldset || Object.keys(entitySchema.fields);
				const entityFormFields = (entityFormFieldset || Object.keys(entitySchema.fields)).map((fieldName) => {
					const { validations } = entitySchema.fields[fieldName];
					return {
						name: fieldName,
						validations
					};
				});

				const entityEditor = state.entityEditors.editors[editorHash]
					|| {
						ready: false,
						collectionName
					};

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
						const { collectionName, entityId } = props;
						const editorHash = hash({collectionName, entityId});
						dispatch(entityEditorsActions.loadEditor(editorHash, collectionName, entityId));
						_.each(preloadCollectionNames, (collectionName) => {
							dispatch(entityIndexesActions.ensureEntityIndex(collectionName, {limit: 100}));
						});
					},
					destroyEditor: () => {
						const { collectionName, entityId } = props;
						const editorHash = hash({collectionName, entityId});
						dispatch(entityEditorsActions.destroyEditor(editorHash));
					},
					save: (data) => {
						const { collectionName, entityId } = props;
						const editorHash = hash({collectionName, entityId});
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
				return (
					<EntityEditorComponent {...this.props} />
				);
			}
		}
		return EntityEditorContainer;
	};
}
