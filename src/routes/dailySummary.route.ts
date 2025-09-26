import { Router } from "express";
import { DailySummaryController } from "../controllers/dailySummary.controller";

const router = Router();

router.get('/simple', DailySummaryController.getSimpleAllSummary)
router.get('/detail', DailySummaryController.getDetailAllSummary)
router.post('/simple', DailySummaryController.getSimpleFilteredSummary)
router.post('/detail', DailySummaryController.getDetailFilteredSummary)

export default router;