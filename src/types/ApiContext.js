// @flow
import type { Host } from 'types/Host';
import type { ApiService } from 'types/ApiService';
export type ApiContext = {
	host?: Host,
	service: ApiService,
};
