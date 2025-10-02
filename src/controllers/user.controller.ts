import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserServices } from '../services/user.service';

const userService = new UserServices();

const userSchema = z.object({
	email: z.email(),
	username: z.string().min(1, 'Username required'),
	password: z.string().min(8, 'Password minimum 8 character'),
	name: z.string().min(1, 'Name required'),
	role: z.enum(['admin', 'user']),
});

export class UserController {
	static async getUsers(_req: Request, res: Response, next: NextFunction) {
		try {
			const users = await userService.getAllUsers();
			res.json(users);
		} catch (e) {
			next(e);
		}
	}

	static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const validate = userSchema.safeParse(req.body);
			if (!validate.success) {
				res.status(400).json({ message: validate.error.issues[0] });
			}
			const user = await userService.createUser({
				email: validate.data?.email!,
				username: validate.data?.username!,
				password: validate.data?.password!,
				name: validate.data?.name!,
				role: validate.data?.role!,
			});
			res.status(201).json(user.id);
		} catch (e) {
			next(e);
		}
	}

	static async createUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await userService.createUsers(req.body);
			res.status(201).json(users);
		} catch (e) {
			next(e);
		}
	}
}
