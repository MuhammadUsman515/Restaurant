import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  ChefHat,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from '../../components/ui/toast';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch {
      toast.error('Something went wrong', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0A1E] px-6 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#4B1FA8]/15 blur-[150px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-10%', left: '-5%' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-[#F97316]/10 blur-[130px]"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-10%', right: '-5%' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-11 h-11 rounded-xl bg-[#4B1FA8] flex items-center justify-center border border-[#4B1FA8]/50">
            <ChefHat className="w-6 h-6 text-[#F97316]" />
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            RestroFlow
          </span>
        </div>

        {/* Card */}
        <div className="bg-[#1A1030] border border-[#2D1F50] rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-[#4B1FA8]/15 border border-[#4B1FA8]/30 flex items-center justify-center mb-6">
                  <KeyRound size={24} className="text-[#F97316]" />
                </div>

                <h2
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Forgot your password?
                </h2>
                <p
                  className="text-[#9CA3AF] text-sm mb-8"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  No worries. Enter the email address associated with your account and we'll send
                  you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@restaurant.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold text-base"
                    loading={isLoading}
                    icon={!isLoading ? <ArrowRight size={18} /> : undefined}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#4B1FA8]/20 border-2 border-[#4B1FA8] flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle2 size={32} className="text-[#F97316]" />
                  </motion.div>
                </motion.div>

                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Check your email
                </h2>
                <p
                  className="text-[#9CA3AF] text-sm mb-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  We've sent a password reset link to
                </p>
                <p
                  className="text-[#F97316] font-medium mb-6"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {submittedEmail}
                </p>
                <p
                  className="text-xs text-[#9CA3AF]/70 mb-6"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  The link will expire in 15 minutes. If you don't see it, check your spam folder.
                </p>

                <div className="space-y-3">
                  <Link to="/auth/login">
                    <Button
                      className="w-full h-12 bg-[#4B1FA8] hover:bg-[#5B2FC0] text-white font-semibold"
                      icon={<ArrowLeft size={18} />}
                    >
                      Back to Login
                    </Button>
                  </Link>

                  <button
                    type="button"
                    className="w-full text-sm text-[#9CA3AF] hover:text-white transition-colors py-2"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                    onClick={() => {
                      setIsSubmitted(false);
                      toast.info('Try again', 'Enter your email to receive a new reset link.');
                    }}
                  >
                    Didn't receive it? Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to login */}
        {!isSubmitted && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors group"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
