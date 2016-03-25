import test from 'tape';
import createConstants from '../../src/utils/createConstants';

test('createConstants test', (t) => {

	t.throws(createConstants.bind(null), 'Throws when constant names not supplied.');
	t.throws(createConstants.bind(null, 'some bad val'), 'Throws when constant names not correct type.');
	t.throws(createConstants.bind(null, [], ['bad prefix val']), 'Throws when prefix not correct type.');

	const constantsNames = [
		'CONST1',
		'CONST2',
		'CONST3'
	];
	const expectedResult = {
		CONST1: 'CONST1',
		CONST2: 'CONST2',
		CONST3: 'CONST3'
	};

	const constants = createConstants(constantsNames);
	t.deepEqual(constants, expectedResult, 'Result has proper structure.');

	const expectedResultPrefixed = {
		CONST1: 'some-prefix-CONST1',
		CONST2: 'some-prefix-CONST2',
		CONST3: 'some-prefix-CONST3'
	};
	const prefixedConstants = createConstants(constantsNames, 'some-prefix-');
	t.deepEqual(prefixedConstants, expectedResultPrefixed, 'Values are prefixed.');

	t.end();
});
