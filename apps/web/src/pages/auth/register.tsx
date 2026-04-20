import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Store,
  User,
  CreditCard,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Globe,
  Sparkles,
  Zap,
  Crown,
  Building2,
  Check,
  Utensils,
  BarChart3,
  Users,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from '../../components/ui/toast';
import { useAuthStore } from '../../stores/auth-store';

// --- Schemas per step ---

const step1Schema = z.object({
  restaurantName: z
    .string()
    .min(1, 'Restaurant name is required')
    .min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

const step2Schema = z.object({
  ownerName: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: z.string().min(1, 'Phone number is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

// --- Plans ---

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    icon: Sparkles,
    color: '#9CA3AF',
    description: 'Perfect for small restaurants just getting started',
    features: [
      '1 branch',
      'Up to 100 orders/day',
      'Basic POS',
      'Menu management',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$79',
    period: '/month',
    icon: Zap,
    color: '#F97316',
    description: 'For growing restaurants ready to scale',
    features: [
      'Up to 3 branches',
      'Unlimited orders',
      'Full POS & KDS',
      'Delivery management',
      'Analytics dashboard',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$149',
    period: '/month',
    icon: Crown,
    color: '#4B1FA8',
    description: 'For multi-location restaurant businesses',
    features: [
      'Up to 10 branches',
      'Unlimited orders',
      'Advanced analytics',
      'Staff management',
      'Loyalty program',
      'API access',
      'Dedicated support',
    ],
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    icon: Building2,
    color: '#F97316',
    description: 'Tailored solutions for restaurant chains',
    features: [
      'Unlimited branches',
      'Unlimited everything',
      'White-label option',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
      '24/7 phone support',
    ],
    popular: false,
  },
] as const;

// --- Step config ---

const steps = [
  { number: 1, label: 'Restaurant', icon: Store },
  { number: 2, label: 'Account', icon: User },
  { number: 3, label: 'Plan', icon: CreditCard },
  { number: 4, label: 'Complete', icon: CheckCircle2 },
];

// --- Floating icons for left panel ---

const floatingIcons = [
  { icon: Utensils, x: '15%', y: '20%', delay: 0 },
  { icon: BarChart3, x: '70%', y: '15%', delay: 0.5 },
  { icon: Users, x: '25%', y: '70%', delay: 1 },
  { icon: ShoppingBag, x: '75%', y: '65%', delay: 1.5 },
  { icon: ChefHat, x: '50%', y: '40%', delay: 0.8 },
];

// --- Slide animation variants ---

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');

  // Accumulated form data across steps
  const [formData, setFormData] = useState({
    restaurantName: '',
    slug: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Step 1 form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      restaurantName: formData.restaurantName,
      slug: formData.slug,
    },
  });

  // Step 2 form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      ownerName: formData.ownerName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
    },
  });

  // Auto-generate slug from restaurant name
  const restaurantName = step1Form.watch('restaurantName');
  useEffect(() => {
    if (restaurantName) {
      const generated = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      step1Form.setValue('slug', generated);
    }
  }, [restaurantName, step1Form]);

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToStep(2);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToStep(3);
  });

  const handleStep3 = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      goToStep(4);
    } catch {
      toast.error('Registration failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    // Mock login after registration
    const mockUser = {
      id: '1',
      email: formData.email,
      name: formData.ownerName,
      role: 'owner' as const,
    };
    const mockTenant = {
      id: '1',
      name: formData.restaurantName,
      slug: formData.slug,
      plan: selectedPlan as 'free' | 'starter' | 'pro' | 'enterprise',
    };
    const mockBranches = [
      {
        id: '1',
        name: 'Main Branch',
        address: '',
        phone: formData.phone,
        isActive: true,
      },
    ];

    login(mockUser, mockTenant, mockBranches, 'mock-jwt-token');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#0F0A1E]">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4B1FA8] via-[#2D1170] to-[#0F0A1E]" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

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

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <ChefHat className="w-7 h-7 text-[#F97316]" />
              </div>
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                RestroFlow
              </span>
            </div>

            <h1
              className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Start managing your
              <br />
              restaurant{' '}
              <span className="text-[#F97316]">smarter</span>
            </h1>

            <p
              className="text-base text-white/60 max-w-sm leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Set up your account in minutes and unlock the full power of
              restaurant management.
            </p>

            <div className="mt-10 space-y-3">
              {[
                'No credit card required to start',
                '14-day free trial on all plans',
                'Cancel anytime, no questions asked',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 text-white/70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                >
                  <Check size={16} className="text-[#F97316] shrink-0" />
                  <span className="text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Multi-step Form */}
      <div className="w-full lg:w-[58%] flex flex-col px-6 py-8 lg:px-12 xl:px-20 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#4B1FA8] flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-[#F97316]" />
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            RestroFlow
          </span>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isComplete = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isComplete
                          ? 'bg-[#4B1FA8] border-[#4B1FA8]'
                          : isActive
                            ? 'bg-[#4B1FA8]/20 border-[#4B1FA8]'
                            : 'bg-[#1A1030] border-[#2D1F50]'
                      }`}
                      animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {isComplete ? (
                        <Check size={18} className="text-white" />
                      ) : (
                        <StepIcon
                          size={18}
                          className={isActive ? 'text-[#F97316]' : 'text-[#9CA3AF]'}
                        />
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block ${
                        isActive ? 'text-white' : 'text-[#9CA3AF]'
                      }`}
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3 h-0.5 rounded-full bg-[#2D1F50] relative mt-[-20px] sm:mt-[-32px]">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-[#4B1FA8]"
                        initial={false}
                        animate={{ width: isComplete ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Restaurant Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1"
              >
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Tell us about your restaurant
                  </h2>
                  <p
                    className="text-[#9CA3AF]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    This will be used to set up your workspace
                  </p>
                </div>

                <form onSubmit={handleStep1} className="space-y-6">
                  <Input
                    label="Restaurant Name"
                    placeholder="e.g. The Hungry Chef"
                    icon={<Store size={18} />}
                    error={step1Form.formState.errors.restaurantName?.message}
                    {...step1Form.register('restaurantName')}
                  />

                  <div>
                    <Input
                      label="URL Slug"
                      placeholder="the-hungry-chef"
                      icon={<Globe size={18} />}
                      error={step1Form.formState.errors.slug?.message}
                      {...step1Form.register('slug')}
                    />
                    <p
                      className="mt-2 text-xs text-[#9CA3AF]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Your dashboard will be at{' '}
                      <span className="text-[#F97316]">
                        restroflow.app/{step1Form.watch('slug') || 'your-restaurant'}
                      </span>
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="h-12 px-8 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold"
                      icon={<ArrowRight size={18} />}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Owner Account */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1"
              >
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Create your account
                  </h2>
                  <p
                    className="text-[#9CA3AF]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    You'll be the owner and admin of this restaurant
                  </p>
                </div>

                <form onSubmit={handleStep2} className="space-y-5">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<User size={18} />}
                    error={step2Form.formState.errors.ownerName?.message}
                    {...step2Form.register('ownerName')}
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@restaurant.com"
                    icon={<Mail size={18} />}
                    error={step2Form.formState.errors.email?.message}
                    {...step2Form.register('email')}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    icon={<Phone size={18} />}
                    error={step2Form.formState.errors.phone?.message}
                    {...step2Form.register('phone')}
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      icon={<Lock size={18} />}
                      error={step2Form.formState.errors.password?.message}
                      {...step2Form.register('password')}
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

                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      icon={<Lock size={18} />}
                      error={step2Form.formState.errors.confirmPassword?.message}
                      {...step2Form.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-[#9CA3AF] hover:text-white transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-12 px-6 text-[#9CA3AF] hover:text-white"
                      icon={<ArrowLeft size={18} />}
                      onClick={() => goToStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 px-8 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold"
                      icon={<ArrowRight size={18} />}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1"
              >
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Choose your plan
                  </h2>
                  <p
                    className="text-[#9CA3AF]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Start with a 14-day free trial. Upgrade or downgrade anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {plans.map((plan) => {
                    const PlanIcon = plan.icon;
                    const isSelected = selectedPlan === plan.id;

                    return (
                      <motion.button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#4B1FA8] bg-[#4B1FA8]/10'
                            : 'border-[#2D1F50] bg-[#1A1030] hover:border-[#4B1FA8]/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-4 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#F97316] text-white">
                            Popular
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${plan.color}20` }}
                          >
                            <PlanIcon size={18} style={{ color: plan.color }} />
                          </div>
                          <div>
                            <h3
                              className="text-sm font-bold text-white"
                              style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                              {plan.name}
                            </h3>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                          >
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-sm text-[#9CA3AF]">{plan.period}</span>
                          )}
                        </div>

                        <p
                          className="text-xs text-[#9CA3AF] mb-4"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {plan.description}
                        </p>

                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-xs text-white/70"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              <Check size={14} className="text-[#F97316] shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {isSelected && (
                          <motion.div
                            layoutId="plan-check"
                            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#4B1FA8] flex items-center justify-center"
                          >
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 px-6 text-[#9CA3AF] hover:text-white"
                    icon={<ArrowLeft size={18} />}
                    onClick={() => goToStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="h-12 px-8 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold"
                    icon={!isLoading ? <ArrowRight size={18} /> : undefined}
                    loading={isLoading}
                    onClick={handleStep3}
                  >
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center max-w-md">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-[#4B1FA8]/20 border-2 border-[#4B1FA8] flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <CheckCircle2 size={40} className="text-[#F97316]" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    You're all set!
                  </motion.h2>

                  <motion.p
                    className="text-[#9CA3AF] mb-3"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    We've sent a verification email to{' '}
                    <span className="text-[#F97316] font-medium">{formData.email}</span>.
                    Please verify your email to get started.
                  </motion.p>

                  <motion.p
                    className="text-sm text-[#9CA3AF]/70 mb-8"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    You can continue to your dashboard while you wait.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <Button
                      className="w-full h-12 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold text-base"
                      icon={<ArrowRight size={18} />}
                      onClick={handleGoToDashboard}
                    >
                      Go to Dashboard
                    </Button>
                    <p
                      className="text-xs text-[#9CA3AF]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Didn't receive the email?{' '}
                      <button
                        type="button"
                        className="text-[#F97316] hover:text-[#FB923C] font-medium transition-colors"
                        onClick={() =>
                          toast.success('Email sent', 'Verification email has been resent.')
                        }
                      >
                        Resend
                      </button>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Already have account link */}
        {currentStep < 4 && (
          <div className="w-full max-w-2xl mx-auto mt-8">
            <p
              className="text-center text-[#9CA3AF] text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-[#F97316] hover:text-[#FB923C] font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
