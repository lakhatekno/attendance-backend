import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../libs/httpError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
	console.error(err);

	if (err instanceof HttpError) {
		res.status(err.statusCode).json({
			error: err.message,
		});
	}

	res.status(500).json({ error: 'Internal server error' });
}
