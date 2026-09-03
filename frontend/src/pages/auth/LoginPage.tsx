import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Shield, Store, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type RoleTab = 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<RoleTab>('CUSTOMER');
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill demo credentials on tab change
  const handleTabChange = (selectedRole: RoleTab) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'CUSTOMER') {
      setEmail('customer@example.com');
    } else if (selectedRole === 'RESTAURANT') {
      setEmail('manager@pizzapalace.com');
    } else {
      setEmail('admin@bitetown.com');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const mockToken = `token-${Date.now()}`;
      const mockUser = {
        id: `${role.toLowerCase()}-1`,
        name: role === 'CUSTOMER' ? 'Aman Verma' : role === 'RESTAURANT' ? 'Pizza Palace Kitchen' : 'Super Admin',
        email: email,
        role: role,
      };

      if (login) {
        login(mockToken as any, mockUser as any);
      }

      // Redirection based on active role tab
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'RESTAURANT') {
        navigate('/restaurant');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
        
        {/* Role Switcher (3 Roles) */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('CUSTOMER')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'CUSTOMER'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('RESTAURANT')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'RESTAURANT'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurant</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('ADMIN')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'ADMIN'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Brand Logo & Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-brand-500 text-white rounded-2xl mx-auto flex items-center justify-center text-xl font-black shadow-md shadow-brand-500/20">
            {role === 'CUSTOMER' ? 'B' : role === 'RESTAURANT' ? <Store className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            {role === 'CUSTOMER' && 'Welcome Back'}
            {role === 'RESTAURANT' && 'Restaurant Portal'}
            {role === 'ADMIN' && 'Platform Admin'}
          </h2>
          <p className="text-xs text-zinc-400">
            {role === 'CUSTOMER' && 'Sign in to place and track your food orders'}
            {role === 'RESTAURANT' && 'Sign in to access kitchen KDS and live orders'}
            {role === 'ADMIN' && 'Platform controls and oversight system'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <button type="button" className="text-xs font-bold text-brand-500 hover:text-brand-600">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/25 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {role === 'CUSTOMER' && (
          <div className="text-center text-xs text-zinc-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};