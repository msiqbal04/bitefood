import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Restaurants', path: '/admin/Restaurants', icon: UtensilsCrossed },
    { label: 'Menus', path: '/admin/menus', icon: BookOpen },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar matching Dark Navy/Black Concept Design */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-64 bg-[#18181B] text-gray-300 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                BiteTown <span className="text-brand-500 text-xs uppercase px-2 py-0.5 bg-brand-500/10 rounded">Admin</span>
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                        : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer / Logout */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 text-brand-500 font-bold flex items-center justify-center text-sm border border-zinc-700">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
              System Online
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};