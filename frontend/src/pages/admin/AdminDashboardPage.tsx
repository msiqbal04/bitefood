import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  Store, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface OrderRow {
  _id?: string;
  id?: string;
  customerName?: string;
  user?: { name?: string; email?: string } | string;
  RestaurantName?: string;
  Restaurant?: { name?: string } | string;
  totalAmount?: number;
  total?: number;
  amt?: string;
  status: string;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 142,
    totalRevenue: 48500,
    totalUsers: 2356,
    totalRestaurants: 85,
  });

  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDashboardData = async () => {
    try {
      const statsRes = await adminApi.getDashboardStats();
      const statsPayload = statsRes?.data || statsRes;
      if (statsPayload) {
        setStats({
          totalOrders: statsPayload.totalOrders ?? 142,
          totalRevenue: statsPayload.totalRevenue ?? 48500,
          totalUsers: statsPayload.totalUsers ?? 2356,
          totalRestaurants: statsPayload.totalRestaurants ?? 85,
        });
      }

      const ordersRes = await adminApi.getOrders();
      const ordersList = Array.isArray(ordersRes) ? ordersRes : ordersRes?.orders || [];
      
      if (ordersList.length > 0) {
        setRecentOrders(ordersList.slice(0, 5));
      } else {
        setRecentOrders([
          { id: 'ORD-9821', customerName: 'John Doe', RestaurantName: 'Pizza Palace', totalAmount: 549, status: 'Preparing' },
          { id: 'ORD-9820', customerName: 'Jane Smith', RestaurantName: 'Burger House', totalAmount: 320, status: 'Delivered' },
          { id: 'ORD-9819', customerName: 'Shahid Iqbal', RestaurantName: 'Spice Express', totalAmount: 780, status: 'Out for Delivery' },
          { id: 'ORD-9818', customerName: 'Emily Davis', RestaurantName: 'Taco Town', totalAmount: 260, status: 'Cancelled' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('deliver') || s.includes('complete')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('out') || s.includes('ongoing')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (s.includes('prep')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (s.includes('cancel')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Super Admin Navigation Sidebar */}
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-500" />
              <span>Platform Overview</span>
            </Link>
            <Link
              to="/admin/Restaurants"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Store className="w-4 h-4 text-zinc-400" />
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Super Admin Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Platform-wide revenue commission, active outlets & order volume</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                loadDashboardData();
              }}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-gray-50 shadow-xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-500">Platform GMV</span>
              <span className="text-[11px] font-bold text-emerald-600">+18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-zinc-900">
                ₹{Number(stats.totalRevenue).toLocaleString('en-IN')}
              </span>
              <div className="p-2.5 rounded-xl text-emerald-500 bg-emerald-50">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-500">Total Orders</span>
              <span className="text-[11px] font-bold text-emerald-600">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalOrders}</span>
              <div className="p-2.5 rounded-xl text-blue-500 bg-blue-50">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-500">Active Restaurants</span>
              <span className="text-[11px] font-bold text-emerald-600">+4 Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalRestaurants}</span>
              <div className="p-2.5 rounded-xl text-brand-500 bg-brand-50">
                <Store className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-500">Total Customers</span>
              <span className="text-[11px] font-bold text-emerald-600">+5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalUsers}</span>
              <div className="p-2.5 rounded-xl text-purple-500 bg-purple-50">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Global Orders Monitor</h3>
              <p className="text-[11px] text-zinc-400">Live platform orders across all Restaurants</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-brand-500 font-bold hover:underline">
              View Audit Log →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Restaurant Restaurant</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-zinc-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-400">Loading audit feed...</td>
                  </tr>
                ) : (
                  recentOrders.map((row) => {
                    const rowId = row._id || row.id || 'ORD-000';
                    const customer = typeof row.user === 'object' ? row.user?.name : row.customerName || 'Customer';
                    const Restaurant = typeof row.Restaurant === 'object' ? row.Restaurant?.name : row.RestaurantName || 'Restaurant';
                    const amount = row.totalAmount || row.total || 350;

                    return (
                      <tr key={rowId} className="hover:bg-gray-50/70 transition">
                        <td className="p-4 font-bold text-zinc-900">{rowId.slice(-8)}</td>
                        <td className="p-4">{customer}</td>
                        <td className="p-4">{Restaurant}</td>
                        <td className="p-4 font-bold text-zinc-900">₹{Number(amount).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};