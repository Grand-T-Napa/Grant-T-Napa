/* eslint-disable no-unused-vars */
import { Response, Request, NextFunction } from 'express';

export interface ExtendRequest extends Request {
	policy: any,
	user: any,
	query: {
		offset: string,
		limit: string,
		page: string,
		[key: string]: string
	}
}

export interface ExtendResponse extends Response {
	success(data: any): ExtendResponse
}

export const customResponse = async (req: ExtendRequest, res: Response, next: NextFunction) => {
	(res as any).success = (data: any) => {
		if (data.count) {
			data = handlePaginationResponseData(data, req);
		}

		return res.status(200).json({
			success: true,
			data,
		});
	};

	next();
};

const handlePaginationResponseData = (data: any, req: ExtendRequest) => {
	const total_pages = Math.ceil(data.count / +req.query.limit);

	data = {
		...data,
		total_pages: Math.ceil(data.count / +req.query.limit),
		total_items: data.count,
		page: +req.query.page,
		limit: +req.query.limit,
		has_previous_page: +req.query.page > 1 && +req.query.page <= total_pages,
		has_next_page: +req.query.page < total_pages,
	};

	delete data.count;

	return data;
};

export { NextFunction } from 'express';
