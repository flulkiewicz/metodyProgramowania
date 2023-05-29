import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';

interface CustomRequest extends Request {
	userData?: { userId: string };
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			const error = new HttpError('Auth failed.', 401);
			return next(error);
		}
		const decodedToken = jwt.verify(token, 'jwt_constellation_app_token') as { userId: string };
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError('Auth failed.', 401);
		return next(error);
	}
};
