import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = z
  .object({
    name: z.string().min(4, 'Name must be at least 4 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const res = await authApi.register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      // Handle both direct response and nested axios response
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (token && user) {
        login(token, user);
        navigate('/', { replace: true });
      } else {
        throw new Error(res?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-zinc-500 mt-1">Discover & order from the best Restaurants near you</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1 234 567 8900"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              {...register('terms')}
              type="checkbox"
              id="terms"
              className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 w-4 h-4"
            />
            <label htmlFor="terms" className="text-xs text-zinc-600">
              I agree to the <span className="text-brand-500 font-semibold">Terms & Conditions</span>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-rose-500">{errors.terms.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};