import { Router } from "express";
import { AttendanceLogController } from "../controllers/attendanceLog.controller";

const router = Router();

/**
 * @swagger
 * /api/attendance-logs:
 *   get:
 *     summary: Get all attendance logs
 *     responses:
 *       200:
 *         description: An array of attendance log objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceLog'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', AttendanceLogController.getAllLogs);

/**
 * @swagger
 * /api/attendance-logs/filtered:
 *   get:
 *     summary: Get filtered attendance logs
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of filtered attendance log objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceLog'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/filtered', AttendanceLogController.getFilteredLogs);

export default router;