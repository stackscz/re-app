export const OPEN_MODAL = 're-app/modals/OPEN_MODAL';
export function openModal(modalId, contentElement) {
	return { type: OPEN_MODAL, payload: { modalId, contentElement } };
}

export const CLOSE_MODAL = 're-app/modals/CLOSE_MODAL';
export function closeModal(modalId) {
	return { type: CLOSE_MODAL, payload: { modalId } };
}
