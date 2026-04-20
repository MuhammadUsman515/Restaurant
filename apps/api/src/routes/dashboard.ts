import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const branchId = req.query.branchId as string | undefined;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const whereBase: any = { tenantId, status: { not: 'CANCELLED' } };
    if (branchId) whereBase.branchId = branchId;

    const [todayOrders, yesterdayOrders, activeDeliveries, lowStockCount] = await Promise.all([
      prisma.order.findMany({
        where: { ...whereBase, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.order.findMany({
        where: { ...whereBase, createdAt: { gte: yesterdayStart, lte: yesterdayEnd } },
      }),
      prisma.order.count({
        where: { tenantId, status: 'OUT_FOR_DELIVERY', ...(branchId ? { branchId } : {}) },
      }),
      prisma.rawMaterial.count({
        where: {
          tenantId,
          currentStock: { lte: prisma.rawMaterial.fields.reorderLevel as any },
        },
      }),
    ]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : todayRevenue > 0 ? 100 : 0;

    const online = todayOrders.filter(o => o.type === 'DELIVERY').length;
    const pos = todayOrders.filter(o => o.type === 'POS' || o.type === 'TAKEAWAY').length;
    const dineIn = todayOrders.filter(o => o.type === 'DINE_IN').length;

    // Count low stock manually since Prisma can't compare two fields easily in SQLite
    const allMaterials = await prisma.rawMaterial.findMany({ where: { tenantId } });
    const lowStock = allMaterials.filter(m => m.currentStock <= m.reorderLevel).length;

    res.json({
      success: true,
      data: {
        todayRevenue,
        revenueChange: Math.round(revenueChange * 10) / 10,
        todayOrders: todayOrders.length,
        ordersBreakdown: { online, pos, dineIn },
        activeDeliveries,
        lowStockAlerts: lowStock,
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/dashboard/revenue-trend
router.get('/revenue-trend', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const branchId = req.query.branchId as string | undefined;
    const days = parseInt(req.query.days as string) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const where: any = {
      tenantId,
      status: { not: 'CANCELLED' },
      createdAt: { gte: startDate },
    };
    if (branchId) where.branchId = branchId;

    const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'asc' } });

    const revenueByDate = new Map<string, { revenue: number; orders: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().split('T')[0];
      revenueByDate.set(key, { revenue: 0, orders: 0 });
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      const existing = revenueByDate.get(key);
      if (existing) {
        existing.revenue += order.total;
        existing.orders += 1;
      }
    }

    const data = Array.from(revenueByDate.entries()).map(([date, val]) => ({
      date,
      revenue: Math.round(val.revenue),
      orders: val.orders,
      avgOrderValue: val.orders > 0 ? Math.round(val.revenue / val.orders) : 0,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Revenue trend error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/dashboard/top-items
router.get('/top-items', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const branchId = req.query.branchId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 5;

    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      order: {
        tenantId,
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate },
      },
    };
    if (branchId) where.order.branchId = branchId;

    const orderItems = await prisma.orderItem.findMany({
      where,
      include: { order: true },
    });

    const itemMap = new Map<string, { name: string; revenue: number; quantity: number }>();
    for (const item of orderItems) {
      const existing = itemMap.get(item.menuItemId);
      if (existing) {
        existing.revenue += item.price * item.quantity;
        existing.quantity += item.quantity;
      } else {
        itemMap.set(item.menuItemId, {
          name: item.name,
          revenue: item.price * item.quantity,
          quantity: item.quantity,
        });
      }
    }

    const sorted = Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);

    res.json({ success: true, data: sorted });
  } catch (err) {
    console.error('Top items error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/dashboard/recent-orders
router.get('/recent-orders', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const branchId = req.query.branchId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    const where: any = { tenantId };
    if (branchId) where.branchId = branchId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: true,
        branch: true,
        rider: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Recent orders error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
