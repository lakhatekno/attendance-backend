import { Request, Response, NextFunction } from 'express';
import { DailySummaryServices, filterType } from '../services/dailySummary.service';

const summaryService = new DailySummaryServices();

export class DailySummaryController {
	static async getSimpleAllSummary(_req: Request, res: Response, next: NextFunction) {
		try {
			const summary = await summaryService.getSimpleAllSummary();
			res.json(summary);
		} catch (e) {
			next(e);
		}
	}

  static async getDetailAllSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await summaryService.getDetailAllSummary();
      res.json(summary);
    } catch (e) {
      next(e);
    }
  }

  static async getSimpleFilteredSummary(req: Request, res: Response, next: NextFunction) {
    const filter: filterType = req.body;
    const summary = await summaryService.getSimpleFilteredSummary(filter);
    res.json(summary);
  }
  
  static async getDetailFilteredSummary(req: Request, res: Response, next: NextFunction) {
    const filter: filterType = req.body;
    const summary = await summaryService.getDetailFilteredSummary(filter);
    res.json(summary);
  }
}
