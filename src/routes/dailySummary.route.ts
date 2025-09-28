import { Router } from "express";
import { DailySummaryController } from "../controllers/dailySummary.controller";

const router = Router();

/**
 * @swagger
 * /api/daily-summary/simple:
 *   get:
 *     summary: Get a simple summary of all daily summaries
 *     responses:
 *       200:
 *         description: An array of simple daily summary objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error
 */
router.get('/simple', DailySummaryController.getSimpleAllSummary)

/**
 * @swagger
 * /api/daily-summary/detail:
 *   get:
 *     summary: Get a detailed summary of all daily summaries
 *     responses:
 *       200:
 *         description: An array of detailed daily summary objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailySummary'
 *       500:
 *         description: Internal Server Error
 */
router.get('/detail', DailySummaryController.getDetailAllSummary)

/**
 * @swagger
 * /api/daily-summary/simple:
 *   post:
 *     summary: Get a simple filtered summary of daily summaries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: An array of simple filtered daily summary objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/simple', DailySummaryController.getSimpleFilteredSummary)

/**
 * @swagger
 * /api/daily-summary/detail:
 *   post:
 *     summary: Get a detailed filtered summary of daily summaries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: An array of detailed filtered daily summary objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailySummary'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/detail', DailySummaryController.getDetailFilteredSummary)

export default router;