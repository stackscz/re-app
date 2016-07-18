import ensureEntityIndexFlow from './ensureEntityIndexFlow';
import invalidationPersistFlow from './invalidationPersistFlow';
import invalidationDeleteFlow from './invalidationDeleteFlow';

export default [
	ensureEntityIndexFlow,
	invalidationPersistFlow,
	invalidationDeleteFlow,
];
