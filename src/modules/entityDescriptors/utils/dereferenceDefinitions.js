import $RefParser from 'json-schema-ref-parser';

export default function dereferenceDefinitions(definitions) {
	return new Promise((resolve, reject) => {
		$RefParser.dereference(
			{ definitions },
			{
				dereference: {
					circular: false,
				},
			}
		).then((dereferencedDefinitions) => {
			resolve(dereferencedDefinitions.definitions);
		}).catch((err) => {
			reject(err);
		});
	});
}
