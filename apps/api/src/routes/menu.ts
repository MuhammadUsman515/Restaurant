import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ==================== CATEGORIES ====================

// GET /api/menu/categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const categories = await prisma.category.findMany({
      where: { tenantId },
      include: { _count: { select: { menuItems: true } } },
      orderBy: { sortOrder: 'asc' },
    });

    const data = categories.map(c => ({
      ...c,
      itemCount: c._count.menuItems,
      _count: undefined,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/menu/categories
router.post('/categories', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      nameUrdu: z.string().optional(),
      sortOrder: z.number().int().optional(),
      image: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        tenantId,
        name: data.name,
        nameUrdu: data.nameUrdu || null,
        sortOrder: data.sortOrder || 0,
        image: data.image || null,
      },
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create category error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/menu/categories/:id
router.put('/categories/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name ?? category.name,
        nameUrdu: req.body.nameUrdu !== undefined ? req.body.nameUrdu : category.nameUrdu,
        sortOrder: req.body.sortOrder ?? category.sortOrder,
        image: req.body.image !== undefined ? req.body.image : category.image,
        isActive: req.body.isActive ?? category.isActive,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/menu/categories/:id
router.delete('/categories/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const itemCount = await prisma.menuItem.count({ where: { categoryId: req.params.id } });
    if (itemCount > 0) {
      res.status(400).json({ success: false, message: 'Cannot delete category with menu items' });
      return;
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== MENU ITEMS ====================

// GET /api/menu/items
router.get('/items', async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.isAvailable !== undefined) where.isAvailable = req.query.isAvailable === 'true';
    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search as string } },
        { description: { contains: req.query.search as string } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: {
          category: true,
          variants: true,
          modifierGroups: {
            include: { modifierGroup: { include: { modifiers: true } } },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.menuItem.count({ where }),
    ]);

    const data = items.map(item => ({
      ...item,
      images: JSON.parse(item.images),
      tags: JSON.parse(item.tags),
      modifierGroups: item.modifierGroups.map(mg => mg.modifierGroup),
    }));

    res.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get menu items error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/menu/items/:id
router.get('/items/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.menuItem.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
      include: {
        category: true,
        variants: true,
        modifierGroups: {
          include: { modifierGroup: { include: { modifiers: true } } },
        },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...item,
        images: JSON.parse(item.images),
        tags: JSON.parse(item.tags),
        modifierGroups: item.modifierGroups.map(mg => mg.modifierGroup),
      },
    });
  } catch (err) {
    console.error('Get menu item error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/menu/items
router.post('/items', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      categoryId: z.string().uuid(),
      name: z.string().min(1),
      nameUrdu: z.string().optional(),
      description: z.string().optional(),
      price: z.number().min(0),
      images: z.array(z.string()).optional(),
      isAvailable: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      recipeId: z.string().uuid().optional(),
      sortOrder: z.number().int().optional(),
      variants: z.array(z.object({
        name: z.string(),
        price: z.number().min(0),
      })).optional(),
      modifierGroupIds: z.array(z.string().uuid()).optional(),
    });

    const data = schema.parse(req.body);

    const item = await prisma.menuItem.create({
      data: {
        tenantId,
        categoryId: data.categoryId,
        name: data.name,
        nameUrdu: data.nameUrdu || null,
        description: data.description || null,
        price: data.price,
        images: JSON.stringify(data.images || []),
        isAvailable: data.isAvailable ?? true,
        tags: JSON.stringify(data.tags || []),
        recipeId: data.recipeId || null,
        sortOrder: data.sortOrder || 0,
        variants: data.variants ? {
          create: data.variants.map(v => ({ name: v.name, price: v.price })),
        } : undefined,
        modifierGroups: data.modifierGroupIds ? {
          create: data.modifierGroupIds.map(gId => ({ modifierGroupId: gId })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
        modifierGroups: {
          include: { modifierGroup: { include: { modifiers: true } } },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...item,
        images: JSON.parse(item.images),
        tags: JSON.parse(item.tags),
        modifierGroups: item.modifierGroups.map(mg => mg.modifierGroup),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create menu item error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/menu/items/:id
router.put('/items/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const item = await prisma.menuItem.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    const updateData: any = {};
    if (req.body.categoryId !== undefined) updateData.categoryId = req.body.categoryId;
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.nameUrdu !== undefined) updateData.nameUrdu = req.body.nameUrdu;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.images !== undefined) updateData.images = JSON.stringify(req.body.images);
    if (req.body.isAvailable !== undefined) updateData.isAvailable = req.body.isAvailable;
    if (req.body.tags !== undefined) updateData.tags = JSON.stringify(req.body.tags);
    if (req.body.recipeId !== undefined) updateData.recipeId = req.body.recipeId;
    if (req.body.sortOrder !== undefined) updateData.sortOrder = req.body.sortOrder;

    const updated = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        category: true,
        variants: true,
        modifierGroups: {
          include: { modifierGroup: { include: { modifiers: true } } },
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...updated,
        images: JSON.parse(updated.images),
        tags: JSON.parse(updated.tags),
        modifierGroups: updated.modifierGroups.map(mg => mg.modifierGroup),
      },
    });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/menu/items/:id
router.delete('/items/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const item = await prisma.menuItem.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    await prisma.menuItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    console.error('Delete menu item error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== MODIFIER GROUPS ====================

// GET /api/menu/modifier-groups
router.get('/modifier-groups', async (req: Request, res: Response) => {
  try {
    const groups = await prisma.modifierGroup.findMany({
      where: { tenantId: req.user!.tenantId },
      include: { modifiers: true },
    });

    res.json({ success: true, data: groups });
  } catch (err) {
    console.error('Get modifier groups error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/menu/modifier-groups
router.post('/modifier-groups', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const schema = z.object({
      name: z.string().min(1),
      isRequired: z.boolean().optional(),
      min: z.number().int().min(0).optional(),
      max: z.number().int().min(1).optional(),
      modifiers: z.array(z.object({
        name: z.string().min(1),
        price: z.number().min(0).optional(),
      })).min(1),
    });

    const data = schema.parse(req.body);

    const group = await prisma.modifierGroup.create({
      data: {
        tenantId,
        name: data.name,
        isRequired: data.isRequired || false,
        min: data.min || 0,
        max: data.max || 1,
        modifiers: {
          create: data.modifiers.map(m => ({ name: m.name, price: m.price || 0 })),
        },
      },
      include: { modifiers: true },
    });

    res.status(201).json({ success: true, data: group });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Create modifier group error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/menu/modifier-groups/:id
router.put('/modifier-groups/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const group = await prisma.modifierGroup.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!group) {
      res.status(404).json({ success: false, message: 'Modifier group not found' });
      return;
    }

    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.isRequired !== undefined) updateData.isRequired = req.body.isRequired;
    if (req.body.min !== undefined) updateData.min = req.body.min;
    if (req.body.max !== undefined) updateData.max = req.body.max;

    // If modifiers array provided, replace all
    if (req.body.modifiers) {
      await prisma.modifier.deleteMany({ where: { groupId: req.params.id } });
      updateData.modifiers = {
        create: req.body.modifiers.map((m: any) => ({ name: m.name, price: m.price || 0 })),
      };
    }

    const updated = await prisma.modifierGroup.update({
      where: { id: req.params.id },
      data: updateData,
      include: { modifiers: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update modifier group error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/menu/modifier-groups/:id
router.delete('/modifier-groups/:id', authorize('OWNER', 'BRANCH_MANAGER'), async (req: Request, res: Response) => {
  try {
    const group = await prisma.modifierGroup.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!group) {
      res.status(404).json({ success: false, message: 'Modifier group not found' });
      return;
    }

    await prisma.modifierGroup.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Modifier group deleted' });
  } catch (err) {
    console.error('Delete modifier group error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
