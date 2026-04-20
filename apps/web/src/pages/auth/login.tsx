import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChefHat,
  ArrowRight,
  Utensils,
  BarChart3,
  Users,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuthStore } from '../../stores/auth-store';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const floatingIcons = [
  { icon: Utensils, x: '15%', y: '20%', delay: 0 },
  { icon: BarChart3, x: '70%', y: '15%', delay: 0.5 },
  { icon: Users, x: '25%', y: '70%', delay: 1 },
  { icon: ShoppingBag, x: '75%', y: '65%', delay: 1.5 },
  { icon: ChefHat, x: '50%', y: '40%', delay: 0.8 },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simulate API call -- replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser = {
        id: '1',
        email: data.email,
        name: 'Restaurant Owner',
        role: 'owner' as const,
      };
      const mockTenant = {
        id: '1',
        name: 'My Restaurant',
        slug: 'my-restaurant',
        plan: 'pro' as const,
      };
      const mockBranches = [
        {
          id: '1',
          name: 'Main Branch',
          address: '123 Main St',
          phone: '+1234567890',
          isActive: true,
        },
      ];
      const mockToken = 'mock-jwt-token';

      login(mockUser, mockTenant, mockBranches, mockToken);
      navigate('/dashboard');
    } catch {
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F0A1E]">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4B1FA8] via-[#2D1170] to-[#0F0A1E]" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Animated glow orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#4B1FA8]/30 blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-[#F97316]/20 blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '15%', right: '10%' }}
        />

        {/* Floating icons */}
        {floatingIcons.map(({ icon: Icon, x, y, delay }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{ left: x, top: y }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 5,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={40} />
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <ChefHat className="w-7 h-7 text-[#F97316]" />
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                RestroFlow
              </span>
            </div>

            <h1
              className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              From Kitchen to Customer
              <br />
              <span className="text-[#F97316]">All in One</span>
            </h1>

            <p
              className="text-lg text-white/60 max-w-md leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Manage orders, kitchen operations, deliveries, staff, and analytics
              from a single powerful dashboard.
            </p>

            {/* Feature highlights */}
            <div className="mt-12 space-y-4">
              {[
                'Real-time POS & order management',
                'Kitchen display & production tracking',
                'Delivery fleet management',
                'Smart analytics & insights',
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3 text-white/70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#4B1FA8] flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-[#F97316]" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              RestroFlow
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome back
            </h2>
            <p className="text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Sign in to your restaurant dashboard
            </p>
          </div>

          {/* Error toast */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@restaurant.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2D1F50] bg-[#1A1030] text-[#4B1FA8] focus:ring-[#4B1FA8] focus:ring-offset-0"
                  {...register('rememberMe')}
                />
                <span
                  className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Remember me
                </span>
              </label>

              <Link
                to="/auth/forgot-password"
                className="text-sm text-[#F97316] hover:text-[#FB923C] transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold text-base"
              loading={isLoading}
              icon={!isLoading ? <ArrowRight size={18} /> : undefined}
            >
              Sign In
            </Button>
          </form>

          <p
            className="mt-8 text-center text-[#9CA3AF] text-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-[#F97316] hover:text-[#FB923C] font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
