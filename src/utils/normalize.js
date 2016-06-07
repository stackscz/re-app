import { normalize as normalizrNormalize } from 'normalizr';

const defaultOptions = {
	assignEntity: (obj, propertyName, propertyValue, entity, entityMapping) => {
		obj[propertyName] = propertyValue;
		if (propertyName === entityMapping.getIdAttribute()) {
			obj[propertyName] = obj[propertyName] + '';
		}
	}
};

export default function normalize(obj, schema, options) {
	return normalizrNormalize(obj, schema, {...defaultOptions, ...options})
}
