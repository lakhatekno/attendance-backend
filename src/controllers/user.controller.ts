import { Request, Response, NextFunction } from "express";
import { UserServices } from "../services/user.service";

const userService = new UserServices();

export class UserController {
  static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch(e) {
      next(e);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password, name, role } = req.body;
      const user = await userService.createUser({
          email: email,
          username: username,
          password: password,
          name: name,
          role: role
      });
      res.status(201).json(user.id);
    } catch(e) {
      next(e);
    }
  }

  static async createUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.createUsers(req.body);
      res.status(201).json(users);
    } catch(e) {
      next(e);
    }
  }
}