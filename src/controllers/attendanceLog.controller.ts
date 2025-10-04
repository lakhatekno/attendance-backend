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

	static async updateArbitraryLog(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, record, category, status } = req.body;
			await attendanceService.updateArbitraryLog({
				id,
				record,
				category,
				status,
			});
			res.status(200).json({ message: 'Success' });
		} catch (error) {
      next(error);
    }
	}
}

