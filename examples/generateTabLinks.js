import React from 'react';
import Link from 're-app/lib/components/Link';

export default function generateTabLinks(group, examples) {
	return examples.map((exampleName) => (
		<Link
			to={{ name: 'example', params: { group, name: exampleName } }}
		>
			{exampleName}
		</Link>
	));
}
