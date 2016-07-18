import React, { PropTypes as T } from 'react';

import _ from 'lodash';

import LabeledArea from 're-app-examples/LabeledArea';
import LabeledJsonInspector from 're-app-examples/LabeledJsonInspector';
import DevTools from 're-app-examples/DevTools';

import { createStore } from 're-app/lib/utils';
import { app, container } from 're-app/lib/decorators';
import apiModule from 're-app/lib/modules/api';
import entityDescriptorsModule from 're-app/lib/modules/entityDescriptors';
import entityStorageModule from 're-app/lib/modules/entityStorage';
import entityIndexesModule from 're-app/lib/modules/entityIndexes';
import ApiService from 're-app/lib/mocks/ApiService';
import {
	ensureEntityIndex,
} from 're-app/lib/modules/entityIndexes/actions';
import {
	mergeEntity,
	deleteEntity,
} from 're-app/lib/modules/entityStorage/actions';
import {
	getDynamicEntityIndexContentSelector,
} from 're-app/lib/modules/entityIndexes/selectors';
import {
	getDenormalizedEntitiesSelector,
} from 're-app/lib/modules/entityStorage/selectors';

import hash from 'object-hash';
import moment from 'moment';

const store = createStore(
	{
		modules: [
			apiModule,
			entityDescriptorsModule,
			entityStorageModule,
			entityIndexesModule,
		],
		enhancers: [
			DevTools.instrument(),
		],
	},
	{
		api: {
			service: ApiService,
		},
	}
);

@app(
	store,
	(state) => state.entityDescriptors.initialized, // show splashscreen until schemas are loaded
	(() => <div>loading schemas</div>)() // splashscreen element
)
@container(
	(state) => ({
		state,
		postsSchema: state.entityDescriptors.schemas.posts,
		postsStatuses: _.get(state.entityStorage.statuses, ['posts'], {}),
		posts: getDenormalizedEntitiesSelector(
			'posts',
			getDynamicEntityIndexContentSelector(
				hash({ collectionName: 'posts', filter: { order: ['title'] } })
			)(state)
		)(state),
	}),
	(dispatch) => ({
		loadPosts: () => {
			dispatch(ensureEntityIndex('posts', { order: ['title'] }));
		},
		createPost: (postsSchema, postData, e) => {
			e.preventDefault();
			const postHash = hash({ postData, time: moment().format(), random: Math.random() });
			dispatch(
				mergeEntity(
					'posts',
					_.assign({}, postData, { [postsSchema.idFieldName]: postHash })
				)
			);
		},
		deletePost: (postId, e) => {
			e.preventDefault();
			dispatch(deleteEntity('posts', postId));
		},
	})
)
export default class App extends React.Component {

	static propTypes = {
		state: T.object,
		postsStatuses: T.object,
		posts: T.array,
		postsSchema: T.object,
		loadPosts: T.func,
		loadPost: T.func,
		createPost: T.func,
		updatePost: T.func,
		deletePost: T.func,
	};

	constructor(props) {
		super(props);
		this.setPostTitle = this.setPostTitle.bind(this);
		this.state = {
			postData: {
				title: 'New post title',
			},
		};
	}

	componentWillMount() {
		const { loadPosts } = this.props;
		loadPosts();
	}

	setPostTitle(e) {
		this.setState({ postData: { ...this.state.postData, title: e.target.value } });
	}

	render() {
		const {
			state,
			postsSchema,
			posts,
			postsStatuses,
			createPost,
			deletePost,
		} = this.props;

		return (
			<div className="row">
				<div className="col-xs-12">
					{postsSchema ?
						<div className="well">
							<h1>Actions</h1>
							<div className="row">
								<div className="col-xs-12">
									<div className="form-horizontal">
										<div className="form-group">
											<label
												htmlFor="inputPassword3"
												className="col-sm-2 control-label"
											>
												Post title
											</label>
											<div className="col-sm-10">
												<input
													type="text"
													className="form-control"
													value={this.state.postData.title}
													onChange={this.setPostTitle}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<ul className="nav nav-pills">
								<li>
									<button
										className="btn btn-success"
										onClick={(e) => { createPost(postsSchema, this.state.postData, e); }}
									>
										Create post
									</button>
								</li>
							</ul>
							<h1>Posts</h1>
							<ul className="list-group">
								{posts && posts.length ?
									_.map(posts, (post) => {
										const transient = _.get(postsStatuses, [post.id, 'transient'], false);
										return (
											<li
												className="list-group-item"
												key={post.id}
												style={{ opacity: transient ? 0.5 : 1 }}
											>
												{post.id} - {post.title}&nbsp;
												[tags: {Object.values(post.tags || []).map((tag) => tag).join(', ')}]
												<a
													href="#"
													onClick={(e) => { deletePost(post[postsSchema.idFieldName], e); }}
													className="btn btn-xs btn-danger"
												>
													&times;
												</a>
											</li>
										);
									}) :
									<li className="list-group-item">no posts loaded</li>
								}
							</ul>
						</div> :
						<div className="well">
							<i className="fa fa-cog fa-spin" /> Loading entity descriptors...
						</div>
					}

				</div>
				<div className="col-xs-6">
					<LabeledJsonInspector title="Complete app state" data={state} />
				</div>
				<div className="col-xs-6">
					<LabeledArea title="Redux action log">
						<DevTools />
					</LabeledArea>
				</div>
			</div>
		);
	}
}
