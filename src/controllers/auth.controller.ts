import { Request, Response, NextFunction } from 'express';
import { LoginType } from '../services/auth.service';
import { AuthServices } from '../services/auth.service';

const authServices = new AuthServices();
export class AuthController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password }: LoginType = req.body;
			const token = await authServices.login({ username: username, password: password });
      res.json(token);
		} catch (e) {
      next(e);
    }
	}

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const out = await authServices.logout(token);
      
      res.json(out);
    } catch (e) {
      next(e);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction){
    try {
      const { token } = req.body;
      const { accessToken } = await authServices.refresh(token);

      res.json({ accessToken });
    } catch (e) {
      next(e);
    }
  }
}
