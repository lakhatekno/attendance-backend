import { Request, Response, NextFunction } from 'express';
import { ShiftServices } from '../services/shift.service';

const shiftService = new ShiftServices();

export class ShiftController {
	static async getAllShifts(_req: Request, res: Response, next: NextFunction) {
		try {
			const shifts = await shiftService.getAllShifts();
			res.json(shifts);
		} catch (e) {
			next(e);
		}
	}
	
	static async getActiveShifts(_req: Request, res: Response, next: NextFunction) {
		try {
			const shifts = await shiftService.getActiveShifts();
			res.json(shifts);
		} catch (e) {
			next(e);
		}
	}
	
	static async getInactiveShifts(_req: Request, res: Response, next: NextFunction) {
		try {
			const shifts = await shiftService.getInactiveShifts();
			res.json(shifts);
		} catch (e) {
			next(e);
		}
	}

	static async createShift(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, shiftStart, shiftEnd, crossDay } = req.body;
			const shift = await shiftService.createShift({
				name: name,
				shift_start: shiftStart,
				shift_end: shiftEnd,
				cross_day: crossDay,
				active: true,
			});
			res.status(201).json(shift);
		} catch (e) {
			next(e);
		}
	}

	static async updateShiftInfo(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, name, shiftStart, shiftEnd, crossDay, active } = req.body;

			await shiftService.updateShiftInfo({
				id: id,
				name: name,
				shift_start: shiftStart,
				shift_end: shiftEnd,
				cross_day: crossDay,
				active: active,
			});
			res.status(204);
		} catch (e) {
			next(e);
		}
	}

	static async activateShift(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.body;

			await shiftService.activateShift(id);
			res.status(200).json({ message: 'Success' });
		} catch (e) {
			next(e);
		}
	}
	
  static async inactivateShift(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.body;

			await shiftService.inactivateShift(id);
			res.status(200).json({ message: 'Success' });
		} catch (e) {
			next(e);
		}
	}
}
