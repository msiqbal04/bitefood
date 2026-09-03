import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Store, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  Settings, 
  ArrowLeft, 
  LogOut,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface OrderItem {
  _id?: string;
  id?: string;
  customerName?: string;
  user?: { name?: string; phone?: string; email?: string } | string;
  items?: Array<{ name: string; quantity: number }> | string;
  totalAmount?: number;
  total?: number;
  status: 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt?: string;
}

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      const list = Array.isArray(res) ? res : res?.orders || [];
      if (list.length > 0) {
        setOrders(list);
      } else {
        setOrders([
          {
            id: 'ORD-9821',
            customerName: 'Shahid Iqbal',
            items: '2x Paneer Butter Masala, 4x Butter Naan',
            totalAmount: 580,
            status: 'PREPARING',
            createdAt: '10 mins ago',
          },
          {
            id: 'ORD-9820',
            customerName: 'Aman Verma',
            items: '1x Veg Supreme Pizza, 1x Coke',
            totalAmount: 349,
            status: 'PENDING',
            createdAt: '25 mins ago',
          },
          {
            id: 'ORD-9819',
            customerName: 'Pooja Sharma',
            items: '1x Chicken Biryani, 1x Raita',
            totalAmount: 420,
            status: 'OUT_FOR_DELIVERY',
            createdAt: '40 mins ago',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        const id = ord._id || ord.id;
        return id === orderId ? { ...ord, status: newStatus } : ord;
      })
    );

    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const custName = (typeof ord.user === 'object' ? ord.user?.name : ord.customerName) || '';
    const id = ord._id || ord.id || '';
    const matchesSearch =
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'ALL') return matchesSearch;
    return matchesSearch && ord.status === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-zinc-900 text-brand-500 rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
              B
            </div>
            <div>
              <h2 className="font-black text-zinc-900 leading-none">BiteTown</h2>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-brand-500" />
              <span>Live Orders</span>
            </Link>
            <Link
              to="/admin/Restaurants"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Store className="w-4 h-4 text-zinc-400" />
              <span>Restaurants</span>
            </Link>
            <Link
              to="/admin/menus"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <UtensilsCrossed className="w-4 h-4 text-zinc-400" />
              <span>Dishes & Menu</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Store Settings</span>
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
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Kitchen Live Orders</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Manage customer orders and real-time delivery status</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-gray-50 shadow-xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Orders</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            {['ALL', 'PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                  selectedFilter === filter
                    ? 'bg-zinc-900 text-white'
                    : 'bg-gray-100 text-zinc-600 hover:bg-gray-200'
                }`}
              >
                {filter.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Dishes & Quantity</th>
                  <th className="p-4">Bill (INR)</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-zinc-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-400">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const id = ord._id || ord.id || 'ORD-000';
                    const customer = (typeof ord.user === 'object' ? ord.user?.name : ord.customerName) || 'Customer';
                    const itemsSummary = Array.isArray(ord.items)
                      ? ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')
                      : ord.items || 'Standard Meal';
                    const amount = ord.totalAmount || ord.total || 350;

                    return (
                      <tr key={id} className="hover:bg-gray-50/70 transition">
                        <td className="p-4 font-bold text-brand-600">{id.slice(-8)}</td>
                        <td className="p-4">
                          <div className="font-bold text-zinc-900">{customer}</div>
                          <span className="text-[10px] text-zinc-400">{ord.createdAt || 'Just now'}</span>
                        </td>
                        <td className="p-4 text-zinc-600 max-w-xs truncate">{itemsSummary}</td>
                        <td className="p-4 font-bold text-zinc-900">₹{Number(amount).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(id, e.target.value as OrderItem['status'])}
                            className="bg-white border border-gray-200 text-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer shadow-2xs"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
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