import { Router } from "express";
import { AttendanceLogController } from "../controllers/attendanceLog.controller";

const router = Router();

router.get('/', AttendanceLogController.getAllLogs);
router.get('/filtered', AttendanceLogController.getFilteredLogs);
router.put('/', AttendanceLogController.updateArbitraryLog);

export default router;