import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/analytics/sales
router.get('/sales', async (_req: Request, res: Response) => {
  res.json({ success: true, data: { revenueOverTime: [], revenueByBranch: [], revenueByOrderType: [], revenueByPaymentMethod: [] } });
});

// GET /api/analytics/menu
router.get('/menu', async (_req: Request, res: Response) => {
  res.json({ success: true, data: { topItemsByRevenue: [], topItemsByQuantity: [], menuMix: [] } });
});

// GET /api/analytics/delivery
router.get('/delivery', async (_req: Request, res: Response) => {
  res.json({ success: true, data: { avgDeliveryTimeTrend: [], onTimeRate: 0, riderPerformance: [] } });
});

// GET /api/analytics/production
router.get('/production', async (_req: Request, res: Response) => {
  res.json({ success: true, data: { theoreticalVsActual: [], wastageTrend: [], costPerDish: [] } });
});

export default router;
