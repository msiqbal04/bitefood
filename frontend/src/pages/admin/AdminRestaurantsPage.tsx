import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Store, 
  LayoutDashboard, 
  Users, 
  Settings, 
  ArrowLeft, 
  LogOut,
  CheckCircle,
  XCircle,
  Percent,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RestaurantRestaurant {
  id: string;
  name: string;
  ownerEmail: string;
  location: string;
  commissionRate: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  totalOrders: number;
}

export const AdminRestaurantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [Restaurants, setRestaurants] = useState<RestaurantRestaurant[]>([
    {
      id: 'res-101',
      name: 'Pizza Palace',
      ownerEmail: 'Restaurant.pizza@bitetown.com',
      location: 'Bandra West, Mumbai',
      commissionRate: 18,
      status: 'ACTIVE',
      totalOrders: 320,
    },
    {
      id: 'res-102',
      name: 'Burger House',
      ownerEmail: 'Restaurant.burger@bitetown.com',
      location: 'BKC, Mumbai',
      commissionRate: 15,
      status: 'ACTIVE',
      totalOrders: 280,
    },
    {
      id: 'res-103',
      name: 'Royal Biryani Darbar',
      ownerEmail: 'darbar.biryani@gmail.com',
      location: 'Kurla West, Mumbai',
      commissionRate: 20,
      status: 'PENDING_APPROVAL',
      totalOrders: 0,
    },
    {
      id: 'res-104',
      name: 'Midnight Tacos',
      ownerEmail: 'tacos.support@yahoo.com',
      location: 'Andheri West, Mumbai',
      commissionRate: 18,
      status: 'SUSPENDED',
      totalOrders: 45,
    },
  ]);

  const updateStatus = (id: string, newStatus: RestaurantRestaurant['status']) => {
    setRestaurants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const updateCommission = (id: string, rate: number) => {
    setRestaurants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, commissionRate: rate } : p))
    );
  };

  const filteredRestaurants = Restaurants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-zinc-900 text-brand-500 rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
              B
            </div>
            <div>
              <h2 className="font-black text-zinc-900 leading-none">BiteTown</h2>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Platform Admin</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-400" />
              <span>Platform Overview</span>
            </Link>
            <Link
              to="/admin/Restaurants"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white shadow-xs"
            >
              <Store className="w-4 h-4 text-brand-500" />
              <span>Restaurants & Onboarding</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              <span>Global Orders Log</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Users & Staff</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Commission & Fees</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-100 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-zinc-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold transition"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Restaurant Restaurant Management</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Approve new kitchen applications, manage commission rates and contracts</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft flex items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Restaurant by name or owner email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
            Total Restaurants: {filteredRestaurants.length}
          </span>
        </div>

        {/* Restaurants Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Restaurant & Owner</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Platform Commission (%)</th>
                  <th className="p-4">Lifetime Orders</th>
                  <th className="p-4">Contract Status</th>
                  <th className="p-4">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-zinc-800 font-medium">
                {filteredRestaurants.map((Restaurant) => (
                  <tr key={Restaurant.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{Restaurant.name}</div>
                      <span className="text-[11px] text-zinc-400">{Restaurant.ownerEmail}</span>
                    </td>
                    <td className="p-4 text-zinc-600">{Restaurant.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={Restaurant.commissionRate}
                          onChange={(e) => updateCommission(Restaurant.id, Number(e.target.value))}
                          className="w-14 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-zinc-900"
                        />
                        <Percent className="w-3 h-3 text-zinc-400" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-zinc-900">{Restaurant.totalOrders}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          Restaurant.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : Restaurant.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {Restaurant.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {Restaurant.status === 'PENDING_APPROVAL' ? (
                          <>
                            <button
                              onClick={() => updateStatus(Restaurant.id, 'ACTIVE')}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => updateStatus(Restaurant.id, 'SUSPENDED')}
                              className="flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : Restaurant.status === 'ACTIVE' ? (
                          <button
                            onClick={() => updateStatus(Restaurant.id, 'SUSPENDED')}
                            className="px-2.5 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
                          >
                            Suspend Restaurant
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(Restaurant.id, 'ACTIVE')}
                            className="px-2.5 py-1 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold transition"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};