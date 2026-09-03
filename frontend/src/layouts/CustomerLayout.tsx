import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AIChatBot } from '../components/AIChatBot';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between">
      {/* Top Banner Switcher for Admin User */}
      {user?.role === 'ADMIN' && (
        <div className="bg-zinc-900 text-white px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Logged in as <b>Admin ({user.name})</b></span>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-3 py-1 rounded-lg transition"
          >
            Admin Dashboard →
          </button>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating AI Food Bot */}
      <AIChatBot />

      {/* Bottom Sticky Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-2 z-30 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                isActive ? 'text-brand-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.label === 'Orders' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};