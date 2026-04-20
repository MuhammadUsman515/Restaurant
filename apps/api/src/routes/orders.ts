import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const createOrderSchema = z.object({
  branchId: z.string().uuid(),
  type: z.enum(['DELIVERY', 'TAKEAWAY', 'DINE_IN', 'POS']),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().int().min(1),
    modifiers: z.array(z.string()).optional(),
    variant: z.string().optional(),
  })).min(1),
  customerId: z.string().uuid().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'JAZZCASH', 'EASYPAISA', 'SPLIT']).optional(),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  deliveryCharge: z.number().min(0).optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (req.query.branchId) where.branchId = req.query.branchId;
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;
    if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus;

    if (req.query.search) {
      const search = req.query.search as string;
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
      ];
    }

    if (req.query.dateFrom || req.query.dateTo) {
      where.createdAt = {};
      if (req.query.dateFrom) where.createdAt.gte = new Date(req.query.dateFrom as string);
      if (req.query.dateTo) where.createdAt.lte = new Date(req.query.dateTo as string);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          customer: true,
          branch: true,
          rider: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
      include: {
        items: { include: { menuItem: true } },
        customer: true,
        branch: true,
        rider: true,
        loyaltyTransactions: true,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const data = createOrderSchema.parse(req.body);

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const deliveryCharge = data.deliveryCharge || 0;
    const total = subtotal - discount + tax + deliveryCharge;

    // Generate order number
    const todayCount = await prisma.order.count({
      where: {
        tenantId,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(todayCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        tenantId,
        branchId: data.branchId,
        orderNumber,
        type: data.type,
        status: 'PENDING',
        subtotal,
        discount,
        tax,
        deliveryCharge,
        total,
        customerId: data.customerId || null,
        paymentMethod: data.paymentMethod || 'CASH',
        paymentStatus: 'PENDING',
        notes: data.notes || null,
        deliveryAddress: data.deliveryAddress || null,
        items: {
          create: data.items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            modifiers: JSON.stringify(item.modifiers || []),
            variant: item.variant || null,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
        branch: true,
      },
    });

    // Update customer stats if linked
    if (data.customerId) {
      await prisma.customer.update({
        where: { id: data.customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastOrderAt: new Date(),
          loyaltyPoints: { increment: Math.floor(total / 10) },
        },
      });

      // Create loyalty transaction
      await prisma.loyaltyTransaction.create({
        data: {
          customerId: data.customerId,
          type: 'EARNED',
          points: Math.floor(total / 10),
          orderId: order.id,
          description: `Points earned for order ${orderNumber}`,
        },
      });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`tenant:${tenantId}`).emit('new-order', order);
      io.to(`branch:${data.branchId}`).emit('new-order', order);
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = z.object({
      status: z.enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED']),
    }).parse(req.body);

    const order = await prisma.order.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const updatedData: any = { status };

    // If completed or delivered, mark payment as paid
    if (status === 'COMPLETED' || status === 'DELIVERED') {
      updatedData.paymentStatus = 'PAID';
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: updatedData,
      include: {
        items: true,
        customer: true,
        branch: true,
        rider: true,
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`tenant:${req.user!.tenantId}`).emit('order-updated', updated);
      io.to(`branch:${order.branchId}`).emit('order-updated', updated);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Update order status error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const { discount, tax, deliveryCharge, notes, paymentMethod, riderId } = req.body;

    const updateData: any = {};
    if (discount !== undefined) updateData.discount = discount;
    if (tax !== undefined) updateData.tax = tax;
    if (deliveryCharge !== undefined) updateData.deliveryCharge = deliveryCharge;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (riderId !== undefined) updateData.riderId = riderId;

    // Recalculate total if pricing fields changed
    if (discount !== undefined || tax !== undefined || deliveryCharge !== undefined) {
      updateData.total = order.subtotal
        - (discount ?? order.discount)
        + (tax ?? order.tax)
        + (deliveryCharge ?? order.deliveryCharge);
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: { items: true, customer: true, branch: true, rider: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    await prisma.order.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
