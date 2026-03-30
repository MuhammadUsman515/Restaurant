import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, generateToken, generateRefreshToken, JwtPayload } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  tenantName: z.string().min(2),
  phone: z.string().optional(),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        branch: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const payload: JwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      branchId: user.branchId,
      role: user.role,
      email: user.email,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const branches = await prisma.branch.findMany({
      where: { tenantId: user.tenantId, isActive: true },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          branchId: user.branchId,
          isActive: user.isActive,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt.toISOString(),
        },
        token,
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          plan: user.tenant.plan,
          status: user.tenant.status,
          trialEndsAt: user.tenant.trialEndsAt?.toISOString() || null,
          createdAt: user.tenant.createdAt.toISOString(),
        },
        branches,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    const slug = data.tenantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const passwordHash = await bcrypt.hash(data.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.tenantName,
          slug: `${slug}-${Date.now()}`,
          plan: 'STARTER',
          status: 'TRIAL',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      const branch = await tx.branch.create({
        data: {
          tenantId: tenant.id,
          name: 'Main Branch',
          address: '',
          phone: data.phone || '',
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          branchId: branch.id,
          email: data.email,
          passwordHash,
          name: data.name,
          phone: data.phone || '',
          role: 'OWNER',
        },
      });

      return { tenant, branch, user };
    });

    const payload: JwtPayload = {
      userId: result.user.id,
      tenantId: result.tenant.id,
      branchId: result.branch.id,
      role: 'OWNER',
      email: result.user.email,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          tenantId: result.tenant.id,
          branchId: result.branch.id,
          isActive: true,
          twoFactorEnabled: false,
          createdAt: result.user.createdAt.toISOString(),
        },
        token,
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
          plan: result.tenant.plan,
          status: result.tenant.status,
          trialEndsAt: result.tenant.trialEndsAt?.toISOString() || null,
          createdAt: result.tenant.createdAt.toISOString(),
        },
        branches: [result.branch],
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    });

    if (user) {
      // In production, send actual email here
      console.log(`Password reset requested for ${email}`);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }

    const secret = process.env.JWT_REFRESH_SECRET || 'restroflow-dev-refresh-secret-key';
    const decoded = jwt.verify(refreshToken, secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { tenant: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    const payload: JwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      branchId: user.branchId,
      role: user.role,
      email: user.email,
    };

    const newToken = generateToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { tenant: true, branch: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const branches = await prisma.branch.findMany({
      where: { tenantId: user.tenantId, isActive: true },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          branchId: user.branchId,
          isActive: user.isActive,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt.toISOString(),
        },
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          plan: user.tenant.plan,
          status: user.tenant.status,
          trialEndsAt: user.tenant.trialEndsAt?.toISOString() || null,
          createdAt: user.tenant.createdAt.toISOString(),
        },
        branches,
      },
    });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
