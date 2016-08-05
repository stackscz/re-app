/* eslint-disable  */
import expect from 'expect';

export default function nextEffect(saga, next, effect, result, message) {
	let caseMessage = message;
	if (!caseMessage) {
		caseMessage = JSON.stringify(effect);
	}
	it(JSON.stringify(caseMessage), () => {
		expect(next.value).toEqual(effect);
	});
	return saga.next(result);
}
