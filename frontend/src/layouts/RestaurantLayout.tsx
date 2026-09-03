import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  UtensilsCrossed, 
  Store, 
  LogOut, 
  ArrowLeft,
  Bell,
  Power,
  IndianRupee,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RestaurantLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);

  const navItems = [
    { label: 'Live Kitchen (KDS)', path: '/restaurant', icon: ChefHat },
    { label: 'Menu & Dishes', path: '/restaurant/menu', icon: UtensilsCrossed },
    { label: 'Earnings & Payouts', path: '/restaurant/earnings', icon: IndianRupee },
    { label: 'Ratings & Reviews', path: '/restaurant/reviews', icon: Star },
    { label: 'Outlet Profile', path: '/restaurant/profile', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Restaurant Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white p-5 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-white leading-none">BiteTown</h2>
              <span className="text-[10px] font-bold text-brand-400 tracking-wider uppercase">Restaurant Desk</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isKitchenOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-xs font-bold text-zinc-300">
                {isKitchenOpen ? 'Accepting Orders' : 'Kitchen Closed'}
              </span>
            </div>
            <button
              onClick={() => setIsKitchenOpen(!isKitchenOpen)}
              className={`p-1.5 rounded-lg border transition ${
                isKitchenOpen 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
              title="Toggle Outlet Status"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-zinc-900 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customer View</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Staff</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 bg-brand-500 text-white rounded-lg flex items-center justify-center font-black">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="font-black text-sm text-zinc-900">Restaurant Desk</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Outlet:</span>
            <span className="text-xs font-black text-zinc-900 bg-gray-100 px-2.5 py-1 rounded-md">Pizza Palace - Bandra</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-xl text-xs font-bold">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Live KDS Connected</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};