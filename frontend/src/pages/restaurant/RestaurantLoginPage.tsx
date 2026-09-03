import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const RestaurantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('manager@pizzapalace.com');
  const [password, setPassword] = useState('password123');
  const [outletCode, setOutletCode] = useState('OUTLET-9921');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (email && password) {
        if (login) {
          // Providing both required arguments: (token, user)
          const mockToken = `mock-jwt-token-${Date.now()}`;
          const mockUser = {
            id: 'rest-owner-1',
            name: 'Pizza Palace Manager',
            email: email,
            role: 'RESTAURANT',
          };
          login(mockToken as any, mockUser as any);
        }
        navigate('/restaurant');
      } else {
        setError('Please enter both email and password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid kitchen terminal credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 shadow-lg shadow-brand-500/25">
            <ChefHat className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Restaurant Portal</h1>
          <p className="text-xs text-zinc-400 font-medium">Kitchen Terminal & Order Dispatch Log</p>
        </div>

        {/* Form Box */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-7 shadow-2xl backdrop-blur-md space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Outlet POS Code
              </label>
              <input
                type="text"
                required
                value={outletCode}
                onChange={(e) => setOutletCode(e.target.value)}
                placeholder="e.g. OUTLET-9921"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono tracking-wider transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Staff Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@restaurant.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                PIN / Terminal Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Open Kitchen KDS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-[11px] text-zinc-400 space-y-1">
            <div className="font-bold text-zinc-300">Demo Kitchen Credentials:</div>
            <div className="flex justify-between">
              <span>Staff: <code className="text-brand-400">manager@pizzapalace.com</code></span>
              <span>Pass: <code className="text-brand-400">password123</code></span>
            </div>
          </div>
        </div>

        {/* Marketplace Redirect */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold transition inline-flex items-center gap-1"
          >
            ← Back to Customer Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};