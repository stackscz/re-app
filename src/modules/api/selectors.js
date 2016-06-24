export const getApiContext = state => state.api;
export const getApiService = state => (state.api ? state.api.service : undefined);
