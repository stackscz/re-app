import React, { PropTypes as T } from 'react';
import {
	filter,
	last,
	map as cappedMap,
	flatMap,
	reduce,
	isArray,
	find,
	get as g,
	flow,
	includes,
} from 'lodash/fp';

const map = cappedMap.convert({ cap: false });

import hash from 'object-hash';
import blissComponent from 'decorators/blissComponent';
import gonzales from 'gonzales-pe';
import jsxToString from 'jsx-to-string';

// Based on this gist: https://gist.github.com/ChrisJefferson/cb8db2a4c67a9506c56c
// JS Bin: https://jsbin.com/cefopi/edit?js,console
const cartesianProduct = (...rest) =>
	reduce((a, b) =>
		flatMap(x =>
			map(y =>
				x.concat([y])
			)(b)
		)(a)
	)([[]])(rest);

const findClassNameInRuleset = flow([
	find({ type: 'selector' }),
	g('content'),
	find({ type: 'class' }),
	g('content'),
	find({ type: 'ident' }),
	g('content'),
]);
const isSimpleClassNameInRuleset = flow([
	find({ type: 'selector' }),
	g('content'),
	(content) => content.length === 1,
]);
const findMutexInRuleset = flow([
	find({ type: 'block' }),
	g('content'),
	find({ type: 'multilineComment' }),
	g('content'),
	(x) => last(/@mutex ([a-zA-Z]+)/i.exec(x)),
]);

const generateModifiers = (configuration) => filter((x) => !!x, configuration).join(' ');

const extractModifiers = (node, modifierGroups, nestingLevel = 0) => {
	const { type, content } = node;
	let nextNestingLevel = nestingLevel;
	if (type === 'ruleset' && nestingLevel < 2) {
		nextNestingLevel += 1;
		const className = findClassNameInRuleset(content);
		const modifier = last(/^([A-Z][a-zA-Z]*)?--([a-zA-Z]+)/.exec(className));

		if (modifier && isSimpleClassNameInRuleset(content)) {
			const mutex = findMutexInRuleset(content);
			let resultingMutext = modifier;
			if (mutex) {
				resultingMutext = mutex;
			}
			if (!modifierGroups[resultingMutext]) {
				modifierGroups[resultingMutext] = [undefined]; // eslint-disable-line
			}
			if (!includes(modifier, modifierGroups[resultingMutext])) {
				modifierGroups[resultingMutext].push(modifier);
			}
		}
	}
	if (isArray(content)) {
		content.forEach((subnode) => {
			extractModifiers(subnode, modifierGroups, nextNestingLevel);
		});
	}
};

const generateConfigs = (modifierGroups) =>
	cartesianProduct(...Object.keys(modifierGroups).map(key => modifierGroups[key]));

const countConfigs = (modifierGroups) =>
	reduce((count, modifierGroup) => count * modifierGroup.length, 1, modifierGroups);

const generateSimpleConfigs = (modifierGroups) => reduce(
	(result, groupKey) => [
		...result,
		...filter((x) => !!x, modifierGroups[groupKey]).map((x) => [x]),
	],
	[[undefined]],
	Object.keys(modifierGroups)
);

@blissComponent
export default class BlissTile extends React.Component {

	static propTypes = {
		bm: T.func,
		be: T.func,
		componentName: T.string,
		component: T.func,
		stylesheet: T.string,
		propExamples: T.array,
		maxExamplesCount: T.number,
	};

	static defaultProps = {
		maxExamplesCount: 128,
	};

	render() {
		const {
			bm,
			be,
			componentName,
			component: DemoComponent,
			stylesheet,
			propExamples,
			maxExamplesCount,
		} = this.props;

		const modifierGroups = {};
		let configurations;

		let stylesheetAst;
		if (stylesheet) {
			stylesheetAst = gonzales.parse(stylesheet, { syntax: 'css' });
			extractModifiers(stylesheetAst, modifierGroups);
			console.log(modifierGroups);
		}

		const fullConfigsCount = countConfigs(modifierGroups);
		const fullExamplesCountLimitExceeded = fullConfigsCount > maxExamplesCount;
		if (!maxExamplesCount || fullExamplesCountLimitExceeded) {
			configurations = generateSimpleConfigs(modifierGroups);
		} else {
			configurations = generateConfigs(modifierGroups);
		}

		return (
			<div className={bm()}>

				<div className="container-fluid">

					<h1 className={be('componentName')}>
						<code>
							{componentName}
						</code>
					</h1>

					{!stylesheet && (
						<div className={be('message')}>
							<strong>No stylesheet found</strong>
						</div>
					)}

					{fullExamplesCountLimitExceeded && (
						<div className={be('message')}>
							<strong>
								Too many examples:&nbsp;
								{fullConfigsCount}&nbsp;
								- the number of possible combinations of modifiers
								exceeds configured limit of {maxExamplesCount}.
								Only one modifier at a time shown.
								Use <code>{'/* @mutex <group_name> */'}</code>&nbsp;
								annotation <em>inside</em> of modifier block
								to group mutually exclusive modifiers and narrow down possible combinations.
							</strong>
						</div>
					)}

					{propExamples && propExamples.length ? (
						map((propExample, j) => (
							<div key={j} className={be('propsSection')}>
								<h2 className={be('propsSectionTitle')}>
									Example properties set #{j + 1}
								</h2>
								<pre>
									<code>{JSON.stringify(propExample, null, 2)}</code>
								</pre>
								<div>
									{configurations.map((configuration, i) => {
										const exampleId = hash({ c: configuration, p: propExample });
										return (
											<div key={`${j}_${i}`} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
												<div className={be('example')} id={exampleId}>
													<a
														href={`#${exampleId}`}
														className={be('exampleAnchor')}
													>
														anchor
													</a>
													<pre className={be('code')}>
														<code>
															{jsxToString(
																<DemoComponent
																	modifiers={generateModifiers(configuration)}
																	{...propExample}
																/>,
																{
																	displayName: componentName,
																}
															)}
														</code>
													</pre>
													<div className={be('result')}>
														<div className={be('resultCanvas')}>
															<DemoComponent
																modifiers={generateModifiers(configuration)}
																{...propExample}
															/>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						), propExamples)
					) : (
						<div className={be('propsSection')}>
							<h2 className={be('propsSectionTitle')}>
								With defaultProps
							</h2>
							<div className="row row-eq-height">
								{configurations.map((configuration, i) => {
									const exampleId = hash({ c: configuration });
									return (
										<div key={i}>
											<div className={be('example')} id={exampleId}>
												<a
													href={`#${exampleId}`}
													className={be('exampleAnchor')}
												>
													anchor
												</a>
												<pre className={be('code')}>
													<code>
														{jsxToString(
															<DemoComponent
																modifiers={generateModifiers(configuration)}
															/>,
															{
																displayName: componentName,
															}
														)}
													</code>
												</pre>
												<div className={be('result')}>
													<div className={be('resultCanvas')}>
														<DemoComponent
															modifiers={generateModifiers(configuration)}
														/>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

				</div>
			</div>
		);
	}
}
