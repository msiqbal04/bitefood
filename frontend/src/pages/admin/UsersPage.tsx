import React, { useState } from 'react';
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
  Search,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  ordersCount: number;
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
}

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'USR-001',
      name: 'Shahid Iqbal',
      email: 'admin@bitetown.com',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      ordersCount: 42,
      joinedDate: 'Aug 15, 2026',
      status: 'ACTIVE',
    },
    {
      id: 'USR-002',
      name: 'Aman Verma',
      email: 'aman@example.com',
      phone: '+91 91234 56789',
      role: 'CUSTOMER',
      ordersCount: 8,
      joinedDate: 'Aug 22, 2026',
      status: 'ACTIVE',
    },
    {
      id: 'USR-003',
      name: 'Pooja Sharma',
      email: 'pooja.s@example.com',
      phone: '+91 99887 76655',
      role: 'CUSTOMER',
      ordersCount: 15,
      joinedDate: 'Aug 29, 2026',
      status: 'ACTIVE',
    },
    {
      id: 'USR-004',
      name: 'Rahul Mehta',
      email: 'rahul.m@example.com',
      phone: '+91 94567 12345',
      role: 'CUSTOMER',
      ordersCount: 2,
      joinedDate: 'Sep 01, 2026',
      status: 'BLOCKED',
    },
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : u
      )
    );
  };

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN' } : u
      )
    );
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Left Sidebar Navigation */}
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:bg-gray-100 transition"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white shadow-xs"
            >
              <Users className="w-4 h-4 text-brand-500" />
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Registered Customers & Staff</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Manage user access permissions, view order activity & block accounts</p>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft flex items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
            Total Users: {filteredUsers.length}
          </span>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Joined On</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-zinc-800 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-zinc-900">{u.name}</span>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        <span>{u.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {u.role === 'ADMIN' && <Shield className="w-2.5 h-2.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-zinc-900">{u.ordersCount} orders</td>
                    <td className="p-4 text-zinc-400 text-[11px]">{u.joinedDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRole(u.id)}
                          className="px-2.5 py-1 text-[11px] font-bold border rounded-lg border-gray-200 hover:bg-gray-100 transition"
                          title="Toggle Customer/Admin Role"
                        >
                          Make {u.role === 'ADMIN' ? 'Customer' : 'Admin'}
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                            u.status === 'ACTIVE'
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </button>
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