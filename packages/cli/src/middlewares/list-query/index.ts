import type { RequestHandler } from 'express';

import { filterListQueryMiddleware } from './filter';
import { paginationListQueryMiddleware } from './pagination';
import { selectListQueryMiddleware } from './select';
import { sortByQueryMiddleware } from './sort-by';

/**
 * @deprecated Please create Zod validators in `@n8n/api-types` instead.
 */
export const listQueryMiddleware: RequestHandler[] = [
	filterListQueryMiddleware,
	selectListQueryMiddleware,
	paginationListQueryMiddleware,
	sortByQueryMiddleware,
];
