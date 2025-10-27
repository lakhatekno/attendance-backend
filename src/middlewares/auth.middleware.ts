import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface jwtPayload {
	id: number;
	role: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		return res.status(401).json("No token provided");
	}

	const token = authHeader?.split(" ")[1];
	if (!token) {
		return res.status(401).json("Invalid token format");
	}

	try {
		const secret = process.env.JWT_SECRET as string;
		const decoded = jwt.verify(token!, secret) as JwtPayload;

		(req as any).user = decoded;
		next();
	} catch (e) {
		return res.status(401).json({ message: "Invalid or expiry token" });
	}
}
