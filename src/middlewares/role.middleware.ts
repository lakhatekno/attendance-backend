import { Request, Response, NextFunction } from "express";
import { resourceUsage } from "process";

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
  
    if(!user) {
      return res.status(401).json({ message: "Unauthorized"});
    }

    if(!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden'});
    }

    next();
  }
}