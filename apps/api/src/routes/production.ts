import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ==================== RAW MATERIALS ====================

// GET /api/production/raw-materials
router.get('/raw-materials', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (req.query.category) where.category = req.query.category;
    if (req.query.search) {
      where.name = { contains: req.query.search as string };
    }
    if (req.query.lowStock === 'true') {
      // We'll filter after fetching since SQLite can't compare two columns
    }

    let [materials, total] = await Promise.all([
      prisma.rawMaterial.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.rawMaterial.count({ where }),
    ]);

    if (req.query.lowStock === 'true') {
      materials = materials.filter(m => m.currentStock <= m.reorderLevel);
      total = materials.length;
    }

    const data = materials.map(m => ({
      ...m,
      totalValue: Math.round(m.currentStock * m.avgCost * 100) / 100,
    }));

    res.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get raw materials error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/raw-materials
router.post('/raw-materials', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      unit: z.string().min(1),
      currentStock: z.number().min(0).optional(),
      reorderLevel: z.number().min(0).optional(),
      reorderQty: z.number().min(0).optional(),
      avgCost: z.number().min(0).optional(),
    });

    const data = schema.parse(req.body);

    const material = await prisma.rawMaterial.create({
      data: {
        tenantId,
        ...data,
      },
    });

    res.status(201).json({ success: true, data: material });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create raw material error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/production/raw-materials/:id
router.put('/raw-materials/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const material = await prisma.rawMaterial.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!material) {
      res.status(404).json({ success: false, message: 'Raw material not found' });
      return;
    }

    const updateData: any = {};
    const fields = ['name', 'category', 'unit', 'currentStock', 'reorderLevel', 'reorderQty', 'avgCost'];
    for (const f of fields) {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    }

    const updated = await prisma.rawMaterial.update({
      where: { id: req.params.id },
      data: { ...updateData, lastUpdated: new Date() },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update raw material error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/production/raw-materials/:id
router.delete('/raw-materials/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const material = await prisma.rawMaterial.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!material) {
      res.status(404).json({ success: false, message: 'Raw material not found' });
      return;
    }

    await prisma.rawMaterial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Raw material deleted' });
  } catch (err) {
    console.error('Delete raw material error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/raw-materials/:id/adjust
router.post('/raw-materials/:id/adjust', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      type: z.enum(['ADDITION', 'SUBTRACTION', 'DAMAGE', 'WASTAGE', 'AUDIT']),
      quantity: z.number().positive(),
      reason: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const material = await prisma.rawMaterial.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!material) {
      res.status(404).json({ success: false, message: 'Raw material not found' });
      return;
    }

    const previousStock = material.currentStock;
    let newStock: number;

    if (data.type === 'ADDITION') {
      newStock = previousStock + data.quantity;
    } else if (data.type === 'AUDIT') {
      newStock = data.quantity;
    } else {
      newStock = previousStock - data.quantity;
      if (newStock < 0) newStock = 0;
    }

    const [adjustment] = await prisma.$transaction([
      prisma.stockAdjustment.create({
        data: {
          tenantId: req.user!.tenantId,
          rawMaterialId: req.params.id,
          type: data.type,
          quantity: data.quantity,
          previousStock,
          newStock,
          reason: data.reason || null,
          adjustedBy: req.user!.userId,
        },
      }),
      prisma.rawMaterial.update({
        where: { id: req.params.id },
        data: { currentStock: newStock, lastUpdated: new Date() },
      }),
    ]);

    res.status(201).json({ success: true, data: adjustment });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Stock adjustment error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== RECIPES ====================

// GET /api/production/recipes
router.get('/recipes', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const where: any = { tenantId };
    if (req.query.category) where.category = req.query.category;
    if (req.query.search) where.name = { contains: req.query.search as string };

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: { include: { rawMaterial: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: recipes });
  } catch (err) {
    console.error('Get recipes error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/production/recipes/:id
router.get('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
      include: {
        ingredients: { include: { rawMaterial: true } },
        productionOrders: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    res.json({ success: true, data: recipe });
  } catch (err) {
    console.error('Get recipe error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/recipes
router.post('/recipes', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      description: z.string().optional(),
      yield: z.number().positive().optional(),
      yieldUnit: z.string().optional(),
      sellingPrice: z.number().min(0).optional(),
      method: z.string().optional(),
      linkedMenuItemId: z.string().uuid().optional(),
      ingredients: z.array(z.object({
        rawMaterialId: z.string().uuid(),
        quantity: z.number().positive(),
        unit: z.string(),
        wastePercent: z.number().min(0).max(100).optional(),
      })),
    });

    const data = schema.parse(req.body);

    // Calculate costs
    const rawMaterialIds = data.ingredients.map(i => i.rawMaterialId);
    const materials = await prisma.rawMaterial.findMany({
      where: { id: { in: rawMaterialIds } },
    });
    const materialMap = new Map(materials.map(m => [m.id, m]));

    let totalCost = 0;
    const ingredientData = data.ingredients.map(ing => {
      const mat = materialMap.get(ing.rawMaterialId);
      const waste = ing.wastePercent || 0;
      const netQty = ing.quantity * (1 + waste / 100);
      const costPerUnit = mat?.avgCost || 0;
      const ingredientTotal = netQty * costPerUnit;
      totalCost += ingredientTotal;

      return {
        rawMaterialId: ing.rawMaterialId,
        quantity: ing.quantity,
        unit: ing.unit,
        wastePercent: waste,
        netQuantity: netQty,
        costPerUnit,
        totalCost: Math.round(ingredientTotal * 100) / 100,
      };
    });

    const yieldVal = data.yield || 1;
    const costPerUnit = Math.round((totalCost / yieldVal) * 100) / 100;
    const sellingPrice = data.sellingPrice || 0;
    const marginPercent = sellingPrice > 0
      ? Math.round(((sellingPrice - costPerUnit) / sellingPrice) * 10000) / 100
      : 0;

    const recipe = await prisma.recipe.create({
      data: {
        tenantId,
        name: data.name,
        category: data.category,
        description: data.description || null,
        yield: yieldVal,
        yieldUnit: data.yieldUnit || 'piece',
        costPerUnit,
        sellingPrice,
        marginPercent,
        method: data.method || null,
        linkedMenuItemId: data.linkedMenuItemId || null,
        ingredients: { create: ingredientData },
      },
      include: {
        ingredients: { include: { rawMaterial: true } },
      },
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create recipe error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/production/recipes/:id
router.put('/recipes/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    const updateData: any = {};
    const fields = ['name', 'category', 'description', 'yield', 'yieldUnit', 'sellingPrice', 'method', 'linkedMenuItemId', 'isActive'];
    for (const f of fields) {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    }

    const updated = await prisma.recipe.update({
      where: { id: req.params.id },
      data: updateData,
      include: { ingredients: { include: { rawMaterial: true } } },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update recipe error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/production/recipes/:id
router.delete('/recipes/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    await prisma.recipe.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) {
    console.error('Delete recipe error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== PRODUCTION ORDERS ====================

// GET /api/production/orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (req.query.status) where.status = req.query.status;

    const [orders, total] = await Promise.all([
      prisma.productionOrder.findMany({
        where,
        include: { recipe: { include: { ingredients: { include: { rawMaterial: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.productionOrder.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get production orders error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/orders
router.post('/orders', authorize('OWNER', 'BRANCH_MANAGER', 'KITCHEN_STAFF'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      recipeId: z.string().uuid(),
      quantity: z.number().positive(),
      scheduledAt: z.string(),
      assignedTo: z.string().optional(),
      notes: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const count = await prisma.productionOrder.count({ where: { tenantId } });
    const orderNumber = `PRD-${String(count + 1).padStart(5, '0')}`;

    const order = await prisma.productionOrder.create({
      data: {
        tenantId,
        recipeId: data.recipeId,
        orderNumber,
        quantity: data.quantity,
        scheduledAt: new Date(data.scheduledAt),
        assignedTo: data.assignedTo || null,
        notes: data.notes || null,
      },
      include: { recipe: true },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create production order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PATCH /api/production/orders/:id/status
router.patch('/orders/:id/status', authorize('OWNER', 'BRANCH_MANAGER', 'KITCHEN_STAFF'), async (req: Request, res: Response) => {
  try {
    const { status, actualYield, actualCost } = z.object({
      status: z.enum(['DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
      actualYield: z.number().optional(),
      actualCost: z.number().optional(),
    }).parse(req.body);

    const order = await prisma.productionOrder.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
      include: { recipe: { include: { ingredients: { include: { rawMaterial: true } } } } },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Production order not found' });
      return;
    }

    const updateData: any = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
      if (actualYield !== undefined) updateData.actualYield = actualYield;
      if (actualCost !== undefined) updateData.actualCost = actualCost;

      // Deduct raw materials from stock
      for (const ingredient of order.recipe.ingredients) {
        const deduction = ingredient.netQuantity * order.quantity;
        await prisma.rawMaterial.update({
          where: { id: ingredient.rawMaterialId },
          data: {
            currentStock: { decrement: deduction },
            lastUpdated: new Date(),
          },
        });
      }
    }

    const updated = await prisma.productionOrder.update({
      where: { id: req.params.id },
      data: updateData,
      include: { recipe: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Update production order status error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== SUPPLIERS ====================

// GET /api/production/suppliers
router.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const where: any = { tenantId };
    if (req.query.search) where.name = { contains: req.query.search as string };
    if (req.query.category) where.category = req.query.category;

    const suppliers = await prisma.supplier.findMany({
      where,
      include: { _count: { select: { purchaseOrders: true } } },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: suppliers });
  } catch (err) {
    console.error('Get suppliers error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/suppliers
router.post('/suppliers', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const supplier = await prisma.supplier.create({
      data: {
        tenantId,
        name: data.name,
        category: data.category,
        phone: data.phone,
        email: data.email || null,
        city: data.city || '',
        address: data.address || null,
      },
    });

    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create supplier error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/production/suppliers/:id
router.put('/suppliers/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!supplier) {
      res.status(404).json({ success: false, message: 'Supplier not found' });
      return;
    }

    const updateData: any = {};
    const fields = ['name', 'category', 'phone', 'email', 'city', 'address', 'rating'];
    for (const f of fields) {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    }

    const updated = await prisma.supplier.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update supplier error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/production/suppliers/:id
router.delete('/suppliers/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!supplier) {
      res.status(404).json({ success: false, message: 'Supplier not found' });
      return;
    }

    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (err) {
    console.error('Delete supplier error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== PURCHASE ORDERS ====================

// GET /api/production/purchase-orders
router.get('/purchase-orders', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (req.query.status) where.status = req.query.status;
    if (req.query.supplierId) where.supplierId = req.query.supplierId;

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: true,
          items: { include: { rawMaterial: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get purchase orders error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/purchase-orders
router.post('/purchase-orders', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      supplierId: z.string().uuid(),
      deliveryDate: z.string().optional(),
      notes: z.string().optional(),
      items: z.array(z.object({
        rawMaterialId: z.string().uuid(),
        name: z.string(),
        quantity: z.number().positive(),
        unit: z.string(),
        pricePerUnit: z.number().min(0),
      })).min(1),
    });

    const data = schema.parse(req.body);

    const count = await prisma.purchaseOrder.count({ where: { tenantId } });
    const orderNumber = `PO-${String(count + 1).padStart(5, '0')}`;

    const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

    const order = await prisma.purchaseOrder.create({
      data: {
        tenantId,
        supplierId: data.supplierId,
        orderNumber,
        totalAmount: Math.round(totalAmount * 100) / 100,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        notes: data.notes || null,
        items: {
          create: data.items.map(item => ({
            rawMaterialId: item.rawMaterialId,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit,
            totalPrice: Math.round(item.quantity * item.pricePerUnit * 100) / 100,
          })),
        },
      },
      include: {
        supplier: true,
        items: { include: { rawMaterial: true } },
      },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create purchase order error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PATCH /api/production/purchase-orders/:id/status
router.patch('/purchase-orders/:id/status', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const { status } = z.object({
      status: z.enum(['DRAFT', 'SENT', 'RECEIVED', 'PARTIAL', 'CANCELLED']),
    }).parse(req.body);

    const order = await prisma.purchaseOrder.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Purchase order not found' });
      return;
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: { status },
      include: { supplier: true, items: { include: { rawMaterial: true } } },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Update PO status error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== GOODS RECEIPT NOTES ====================

// GET /api/production/grn
router.get('/grn', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const grns = await prisma.goodsReceiptNote.findMany({
      where: { tenantId },
      include: {
        items: { include: { rawMaterial: true } },
        purchaseOrder: { include: { supplier: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: grns });
  } catch (err) {
    console.error('Get GRNs error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/production/grn
router.post('/grn', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      purchaseOrderId: z.string().uuid().optional(),
      receivedBy: z.string().min(1),
      notes: z.string().optional(),
      items: z.array(z.object({
        rawMaterialId: z.string().uuid(),
        quantity: z.number().positive(),
        unit: z.string(),
        pricePerUnit: z.number().min(0),
        batchNumber: z.string().optional(),
        expiryDate: z.string().optional(),
      })).min(1),
    });

    const data = schema.parse(req.body);

    const grn = await prisma.$transaction(async (tx) => {
      const created = await tx.goodsReceiptNote.create({
        data: {
          tenantId,
          purchaseOrderId: data.purchaseOrderId || null,
          receivedBy: data.receivedBy,
          notes: data.notes || null,
          items: {
            create: data.items.map(item => ({
              rawMaterialId: item.rawMaterialId,
              quantity: item.quantity,
              unit: item.unit,
              pricePerUnit: item.pricePerUnit,
              batchNumber: item.batchNumber || null,
              expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
            })),
          },
        },
        include: {
          items: { include: { rawMaterial: true } },
          purchaseOrder: true,
        },
      });

      // Update stock levels
      for (const item of data.items) {
        await tx.rawMaterial.update({
          where: { id: item.rawMaterialId },
          data: {
            currentStock: { increment: item.quantity },
            avgCost: item.pricePerUnit,
            lastUpdated: new Date(),
          },
        });
      }

      // Update PO status if linked
      if (data.purchaseOrderId) {
        await tx.purchaseOrder.update({
          where: { id: data.purchaseOrderId },
          data: { status: 'RECEIVED' },
        });
      }

      return created;
    });

    res.status(201).json({ success: true, data: grn });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create GRN error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
