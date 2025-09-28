import { Router } from 'express';
import { ShiftController } from '../controllers/shift.controller';

const router = Router();

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Get all shifts
 *     responses:
 *       200:
 *         description: An array of shift objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shift'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', ShiftController.getShifts);

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Create a new shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shift_start:
 *                 type: string
 *                 format: time
 *               shift_end:
 *                 type: string
 *                 format: time
 *               cross_day:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: The created shift object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/', ShiftController.createShift);

/**
 * @swagger
 * /api/shifts:
 *   put:
 *     summary: Update a shift's information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               shift_start:
 *                 type: string
 *                 format: time
 *               shift_end:
 *                 type: string
 *                 format: time
 *               cross_day:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated shift object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', ShiftController.updateShiftInfo);

/**
 * @swagger
 * /api/shifts/activate-shift:
 *   put:
 *     summary: Activate a shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The activated shift object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/activate-shift', ShiftController.activateShift);

/**
 * @swagger
 * /api/shifts/inactivate-shift:
 *   put:
 *     summary: Inactivate a shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The inactivated shift object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/inactivate-shift', ShiftController.inactivateShift);

export default router;
