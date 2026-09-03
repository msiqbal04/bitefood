import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_values: ForgotPasswordFormValues) => {
    setLoading(true);
    // Simulate password reset request
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card border border-gray-100">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 rounded-2xl mb-3">
            <Mail className="w-6 h-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Enter your email address and we'll send you a recovery link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-800 font-medium">
                If an account exists for that email, a password reset link has been sent.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-xs shadow-md shadow-brand-500/20 transition-all text-center"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};