import { memoize } from 'lodash';
import deref from 'json-schema-deref-local';

export default memoize((schema) => deref(schema));
