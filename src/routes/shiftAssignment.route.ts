import { Router } from 'express';
import { ShiftAssingmentController } from '../controllers/shiftAssignment.controller';

const router = Router();

/**
 * @swagger
 * /api/shift-assignments:
 *   get:
 *     summary: Get all shift assignments
 *     responses:
 *       200:
 *         description: An array of shift assignment objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftAssignment'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', ShiftAssingmentController.getAllAssignments);

/**
 * @swagger
 * /api/shift-assignments:
 *   post:
 *     summary: Create multiple new shift assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 shift_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 shift_start:
 *                   type: string
 *                   format: date
 *                 shift_end:
 *                   type: string
 *                   format: date
 *     responses:
 *       201:
 *         description: An array of the created shift assignment objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftAssignment'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/', ShiftAssingmentController.createAssignments);

/**
 * @swagger
 * /api/shift-assignments:
 *   put:
 *     summary: Update multiple shift assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 shift_id:
 *                   type: integer
 *                 shift_start:
 *                   type: string
 *                   format: date
 *                 shift_end:
 *                   type: string
 *                   format: date
 *     responses:
 *       200:
 *         description: An array of the updated shift assignment objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftAssignment'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift assignment not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', ShiftAssingmentController.updateAssignments);

/**
 * @swagger
 * /api/shift-assignments/delete-batch:
 *   put:
 *     summary: Soft delete multiple shift assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: A success message
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift assignment not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/delete-batch', ShiftAssingmentController.softDeleteAssignments);

/**
 * @swagger
 * /api/shift-assignments/per-user:
 *   get:
 *     summary: Get all shift assignments for a specific user
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of shift assignment objects for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftAssignment'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/per-user', ShiftAssingmentController.getAllAssignmentsByUser);

/**
 * @swagger
 * /api/shift-assignments/per-user:
 *   post:
 *     summary: Create a new shift assignment for a specific user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shift_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               shift_start:
 *                 type: string
 *                 format: date
 *               shift_end:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: The created shift assignment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftAssignment'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/per-user', ShiftAssingmentController.createAssignment);

/**
 * @swagger
 * /api/shift-assignments/per-user:
 *   put:
 *     summary: Update a shift assignment for a specific user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               shift_id:
 *                 type: integer
 *               shift_start:
 *                 type: string
 *                 format: date
 *               shift_end:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: The updated shift assignment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftAssignment'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift assignment not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/per-user', ShiftAssingmentController.updateAssignment);

/**
 * @swagger
 * /api/shift-assignments/delete-per-user:
 *   put:
 *     summary: Soft delete a shift assignment for a specific user
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
 *         description: A success message
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift assignment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @route POST /api/shift-assignments
 * @description Create multiple new shift assignments
 * @param {Array<object>} request.body - An array of shift assignments to create
 * @param {number} request.body[].shift_id - The ID of the shift
 * @param {number} request.body[].user_id - The ID of the user
 * @param {string} request.body[].shift_start - The start date of the shift assignment (e.g., "2025-09-29")
 * @param {string} request.body[].shift_end - The end date of the shift assignment (e.g., "2025-10-29")
 * @returns {Array<ShiftAssignment>} 201 - An array of the created shift assignment objects
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
router.post('/', ShiftAssingmentController.createAssignments);

/**
 * @route PUT /api/shift-assignments
 * @description Update multiple shift assignments
 * @param {Array<object>} request.body - An array of shift assignments to update
 * @param {number} request.body[].id - The ID of the shift assignment to update
 * @param {number} [request.body[].shift_id] - The new ID of the shift
 * @param {string} [request.body[].shift_start] - The new start date of the shift assignment
 * @param {string} [request.body[].shift_end] - The new end date of the shift assignment
 * @returns {Array<ShiftAssignment>} 200 - An array of the updated shift assignment objects
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 404 - Shift assignment not found
 * @returns {Error} 500 - Internal Server Error
 */
router.put('/', ShiftAssingmentController.updateAssignments);

/**
 * @route PUT /api/shift-assignments/delete-batch
 * @description Soft delete multiple shift assignments
 * @param {object} request.body - The shift assignments to delete
 * @param {Array<number>} request.body.ids - An array of shift assignment IDs to delete
 * @returns {object} 200 - A success message
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 404 - Shift assignment not found
 * @returns {Error} 500 - Internal Server Error
 */
router.put('/delete-batch', ShiftAssingmentController.softDeleteAssignments);

/**
 * @route GET /api/shift-assignments/per-user
 * @description Get all shift assignments for a specific user
 * @param {object} request.query - The query parameters
 * @param {number} request.query.user_id - The ID of the user
 * @returns {Array<ShiftAssignment>} 200 - An array of shift assignment objects for the specified user
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
router.get('/per-user', ShiftAssingmentController.getAllAssignmentsByUser);

/**
 * @route POST /api/shift-assignments/per-user
 * @description Create a new shift assignment for a specific user
 * @param {object} request.body - The shift assignment to create
 * @param {number} request.body.shift_id - The ID of the shift
 * @param {number} request.body.user_id - The ID of the user
 * @param {string} request.body.shift_start - The start date of the shift assignment (e.g., "2025-09-29")
 * @param {string} request.body.shift_end - The end date of the shift assignment (e.g., "2025-10-29")
 * @returns {ShiftAssignment} 201 - The created shift assignment object
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 500 - Internal Server Error
 */
router.post('/per-user', ShiftAssingmentController.createAssignment);

/**
 * @route PUT /api/shift-assignments/per-user
 * @description Update a shift assignment for a specific user
 * @param {object} request.body - The shift assignment to update
 * @param {number} request.body.id - The ID of the shift assignment to update
 * @param {number} [request.body.shift_id] - The new ID of the shift
 * @param {string} [request.body.shift_start] - The new start date of the shift assignment
 * @param {string} [request.body.shift_end] - The new end date of the shift assignment
 * @returns {ShiftAssignment} 200 - The updated shift assignment object
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 404 - Shift assignment not found
 * @returns {Error} 500 - Internal Server Error
 */
router.put('/per-user', ShiftAssingmentController.updateAssignment);

/**
 * @route PUT /api/shift-assignments/delete-per-user
 * @description Soft delete a shift assignment for a specific user
 * @param {object} request.body - The shift assignment to delete
 * @param {number} request.body.id - The ID of the shift assignment to delete
 * @returns {object} 200 - A success message
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 404 - Shift assignment not found
 * @returns {Error} 500 - Internal Server Error
 */
router.put('/delete-per-user', ShiftAssingmentController.softDeleteAssignment);

export default router;
