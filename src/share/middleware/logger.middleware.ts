import { Request, Response, NextFunction } from 'express';
import { CommonLogger } from '../common/logger/common.logger';

const logger = new CommonLogger('REQUEST');

export function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
	const { method, originalUrl } = request;
	const { statusCode } = response;

	logger.log(
		`${method} ${originalUrl} ${statusCode} - BODY: ${JSON.stringify(request.body)} - PARAM: ${JSON.stringify(
			request.params,
		)}`,
	);

	next();
}
