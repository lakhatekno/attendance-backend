import { Request, Response, NextFunction } from "express";
import { AttendanceRecordServices } from "../services/attendanceRecord.service";

const recordServices = new AttendanceRecordServices();

export class AttendanceRecordController {
     static async userTap(req: Request, res: Response, next: NextFunction) {
        try {
            const { shiftAssignmentId } = req.body;
            await recordServices.userTap(shiftAssignmentId);
            res.status(201).json({message: "Success"});
        } catch (e) {
            next(e);
        }
    }
}