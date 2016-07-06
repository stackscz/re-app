// @flow
import type Error from 'types/Error';
export type EntityValidationError = Error & {
	validationResults?: {}
}
