import { Request, Response, NextFunction } from 'express';
import { AttendanceLogServices, AttendanceFilterType } from '../services/attendanceLog.service';

const attendanceService = new AttendanceLogServices();

export class AttendanceLogController {
	static async getAllLogs(_req: Request, res: Response, next: NextFunction) {
		try {
			const logs = await attendanceService.getAllLogs();
			res.json(logs);
		} catch (e) {
			next(e);
		}
	}

	static async getFilteredLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const filter: AttendanceFilterType = req.body;
			const logs = await attendanceService.getFilteredLogs(filter);
			res.json(logs);
		} catch (e) {
			next(e);
		}
	}
}
