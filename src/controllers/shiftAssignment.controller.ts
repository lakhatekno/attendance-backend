import { Request, Response, NextFunction } from 'express';
import { ShiftAssignmentServices, assignmentType, updateAssignment } from '../services/shiftAssignment.service';

const assignmentServices = new ShiftAssignmentServices();

export class ShiftAssingmentController {
	static async getAllAssignments(_req: Request, res: Response, next: NextFunction) {
		try {
			const assignments = await assignmentServices.getAllAssignments();
			res.json(assignments);
		} catch (e) {
			next(e);
		}
	}

	static async getAllAssignmentsByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.body;
			const parsedId = parseInt(userId);

			const assignments = await assignmentServices.getAllAssignmentsByUser(parsedId);
			res.json(assignments);
		} catch (e) {
			next(e);
		}
	}

	static async createAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const data: assignmentType = req.body;

			const assignment = await assignmentServices.createAssignment({
				shiftId: data.shiftId,
				userId: data.userId,
				shiftStart: data.shiftStart,
				shiftEnd: data.shiftEnd,
			});
			res.status(201).json(assignment.id);
		} catch (e) {
			next(e);
		}
	}

	static async createAssignments(req: Request, res: Response, next: NextFunction) {
		try {
			const assignmentDatas: assignmentType[] = req.body;

			await assignmentServices.createAssignments(assignmentDatas);
			res.status(201).json({ message: 'Success' });
		} catch (e) {
			next(e);
		}
	}

	static async updateAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const data: updateAssignment = req.body;

			await assignmentServices.updateAssignment(data);
			res.status(204);
		} catch (e) {
			next(e);
		}
	}

	static async updateAssignments(req: Request, res: Response, next: NextFunction) {
		try {
			const data: updateAssignment[] = req.body;

			await assignmentServices.updateAssignments(data);
			res.status(204);
		} catch (e) {
			next(e);
		}
	}

	static async softDeleteAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.body;

			await assignmentServices.softDeleteAssignment(id);
			res.status(204);
		} catch (e) {
			next(e);
		}
	}

	static async softDeleteAssignments(req: Request, res: Response, next: NextFunction) {
		try {
			const { ids } = req.body;

			await assignmentServices.softDeleteAssignments(ids);
			res.status(204);
		} catch (e) {
			next(e);
		}
	}
}
