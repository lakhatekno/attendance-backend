import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { LoginType } from '../services/auth.service';
import { AuthServices } from '../services/auth.service';
import { HttpError } from '../libs/httpError';

const authServices = new AuthServices();
const loginSchema = z.object({
	username: z.string().min(1, 'Username required'),
	password: z.string().min(1, 'Password required'),
});

const tokenSchema = z.object({
	token: z.string().min(1, 'Token required'),
});

export class AuthController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const validate = loginSchema.safeParse(req.body);
			if (!validate.success) {
        throw new HttpError(400, "Harap isi username dan password")
			}
			const token = await authServices.login(validate.data!);
			res.json(token);
		} catch (e) {
			next(e);
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const validate = tokenSchema.safeParse(req.body);
			if (!validate.success) {
				res.status(400).json({ message: validate.error });
			}
			const out = await authServices.logout(validate.data?.token!);

			res.json(out);
		} catch (e) {
			next(e);
		}
	}

	static async refreshToken(req: Request, res: Response, next: NextFunction) {
		try {
			const validate = tokenSchema.safeParse(req.body);
			if (!validate.success) {
				res.status(400).json({ message: validate.error });
			}
			const { accessToken } = await authServices.refresh(validate.data?.token!);

			res.json({ accessToken });
		} catch (e) {
			next(e);
		}
	}
}
