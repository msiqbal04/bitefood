import React, { useState } from 'react';
import { Save, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';

export const RestaurantProfilePage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    outletName: 'Pizza Palace',
    branch: 'Bandra West Branch',
    phone: '+91 98200 12345',
    address: 'Shop 4, Linking Road, Near Bandra Station, Mumbai',
    avgPrepTime: '25-30 mins',
    pureVegOnly: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Outlet Profile & Settings</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Manage kitchen dispatch timing, contact numbers & store location</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Outlet profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5">Outlet Brand Name</label>
            <input
              type="text"
              value={profile.outletName}
              disabled
              className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-zinc-500 cursor-not-allowed font-semibold"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Brand name cannot be changed without Super Admin approval</span>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1.5">Branch Identifier</label>
            <input
              type="text"
              value={profile.branch}
              onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1 font-bold text-zinc-700 mb-1.5">
              <Phone className="w-3 h-3 text-zinc-400" /> Kitchen Hotline Phone
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 font-bold text-zinc-700 mb-1.5">
              <Clock className="w-3 h-3 text-zinc-400" /> Average Kitchen Prep Time
            </label>
            <input
              type="text"
              value={profile.avgPrepTime}
              onChange={(e) => setProfile({ ...profile, avgPrepTime: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 font-bold text-zinc-700 mb-1.5">
            <MapPin className="w-3 h-3 text-zinc-400" /> Physical Kitchen Address
          </label>
          <textarea
            rows={3}
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-md shadow-brand-500/20 active:scale-98 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};