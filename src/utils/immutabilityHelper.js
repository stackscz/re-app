import update from 'immutability-helper';

update.extend('$delete', (value, original) => {
	const result = update(original, { [value]: { $set: undefined } });
	delete result[value];
	return result;
});

export default update;
