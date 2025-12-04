import type { NextFunction, RequestHandler, Response } from 'express';
import { validate } from 'jsonschema';
import type { JsonObject } from 'n8n-workflow';
import { jsonParse, UnexpectedError } from 'n8n-workflow';

import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import * as ResponseHelper from '@/response-helper';

import {
	allowedExecutionsQueryFilterFields as ALLOWED_FILTER_FIELDS,
	schemaGetExecutionsQueryFilter as SCHEMA,
} from './execution.service';
import type { ExecutionRequest } from './execution.types';

const isValid = (arg: JsonObject) => validate(arg, SCHEMA).valid;

/**
 * Middleware to parse the query string in a request to retrieve a range of execution summaries.
 */
export const parseRangeQuery: RequestHandler = (req, res: Response, next: NextFunction) => {
	const executionReq = req as unknown as ExecutionRequest.GetMany;
	const { limit, firstId, lastId } = executionReq.query;

	try {
		executionReq.rangeQuery = {
			kind: 'range',
			range: { limit: limit ? Math.min(parseInt(limit, 10), 100) : 20 },
		};

		if (firstId) executionReq.rangeQuery.range.firstId = firstId;
		if (lastId) executionReq.rangeQuery.range.lastId = lastId;

		if (executionReq.query.filter) {
			const jsonFilter = jsonParse<JsonObject>(executionReq.query.filter, {
				errorMessage: 'Failed to parse query string',
			});

			for (const key of Object.keys(jsonFilter)) {
				if (!ALLOWED_FILTER_FIELDS.includes(key)) delete jsonFilter[key];
			}

			if (jsonFilter.waitTill) jsonFilter.waitTill = Boolean(jsonFilter.waitTill);

			if (!isValid(jsonFilter)) throw new UnexpectedError('Query does not match schema');

			executionReq.rangeQuery = { ...executionReq.rangeQuery, ...jsonFilter };
		}

		next();
	} catch (error) {
		if (error instanceof Error) {
			ResponseHelper.sendErrorResponse(res, new BadRequestError(error.message));
		}
	}
};
