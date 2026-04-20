import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/customers
router.get('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (req.query.segment) where.segment = req.query.segment;
    if (req.query.loyaltyTier) where.loyaltyTier = req.query.loyaltyTier;
    if (req.query.search) {
      const search = req.query.search as string;
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get customers error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/customers/segments
router.get('/segments', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const customers = await prisma.customer.findMany({ where: { tenantId } });

    const segments = {
      NEW: customers.filter(c => c.segment === 'NEW').length,
      REGULAR: customers.filter(c => c.segment === 'REGULAR').length,
      VIP: customers.filter(c => c.segment === 'VIP').length,
      CHURNED: customers.filter(c => c.segment === 'CHURNED').length,
    };

    const tiers = {
      SILVER: customers.filter(c => c.loyaltyTier === 'SILVER').length,
      GOLD: customers.filter(c => c.loyaltyTier === 'GOLD').length,
      PLATINUM: customers.filter(c => c.loyaltyTier === 'PLATINUM').length,
    };

    const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);

    res.json({
      success: true,
      data: {
        segments,
        tiers,
        totalCustomers: customers.length,
        totalLoyaltyPoints,
        avgOrderValue: customers.length > 0
          ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / Math.max(customers.reduce((s, c) => s + c.totalOrders, 0), 1))
          : 0,
      },
    });
  } catch (err) {
    console.error('Get segments error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { items: true, branch: true },
        },
        loyaltyTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    res.json({ success: true, data: customer });
  } catch (err) {
    console.error('Get customer error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/customers
router.post('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email().optional(),
      addresses: z.array(z.string()).optional(),
      birthday: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const existing = await prisma.customer.findFirst({
      where: { tenantId, phone: data.phone },
    });

    if (existing) {
      res.status(409).json({ success: false, message: 'Customer with this phone already exists' });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        tenantId,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        addresses: JSON.stringify(data.addresses || []),
        birthday: data.birthday ? new Date(data.birthday) : null,
      },
    });

    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create customer error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.addresses !== undefined) updateData.addresses = JSON.stringify(req.body.addresses);
    if (req.body.segment !== undefined) updateData.segment = req.body.segment;
    if (req.body.loyaltyTier !== undefined) updateData.loyaltyTier = req.body.loyaltyTier;
    if (req.body.birthday !== undefined) updateData.birthday = req.body.birthday ? new Date(req.body.birthday) : null;

    const updated = await prisma.customer.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    await prisma.customer.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    console.error('Delete customer error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/customers/:id/loyalty
router.post('/:id/loyalty', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      type: z.enum(['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS']),
      points: z.number().int(),
      description: z.string().min(1),
      orderId: z.string().uuid().optional(),
    });

    const data = schema.parse(req.body);

    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const pointsChange = data.type === 'REDEEMED' || data.type === 'EXPIRED'
      ? -Math.abs(data.points)
      : Math.abs(data.points);

    if (customer.loyaltyPoints + pointsChange < 0) {
      res.status(400).json({ success: false, message: 'Insufficient loyalty points' });
      return;
    }

    const [transaction] = await prisma.$transaction([
      prisma.loyaltyTransaction.create({
        data: {
          customerId: req.params.id,
          type: data.type,
          points: data.points,
          orderId: data.orderId || null,
          description: data.description,
        },
      }),
      prisma.customer.update({
        where: { id: req.params.id },
        data: { loyaltyPoints: { increment: pointsChange } },
      }),
    ]);

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Loyalty transaction error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
