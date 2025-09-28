import { Router } from "express";
import { AttendanceRecordController } from "../controllers/attendanceRecord.controller";

const router = Router();

router.post('/tap', AttendanceRecordController.userTap);

export default router;