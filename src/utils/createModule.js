export default function(moduleName, reducer, sagas) {
	return {
		reducers: {
			[moduleName]: reducer
		},
		sagas
	};
}
