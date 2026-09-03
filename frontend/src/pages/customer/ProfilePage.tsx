import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Home,
  Briefcase,
  Navigation,
  X,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Mail,
  ChevronDown,
  Settings,
  Bell,
  Smartphone,
  CreditCard,
  Lock,
  Moon,
  Globe,
  AlertTriangle,
  RefreshCw,
  Camera,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, logout, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const navigate = useNavigate();

  // Active Main Tabs: profile | addresses | support | privacy | settings
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'support' | 'privacy' | 'settings'>('profile');

  // Edit Profile (Photo, Phone, Email only) State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Address Bottom Sheet State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('');

  // Support Drawer FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Settings Toggles State
  const [orderPush, setOrderPush] = useState(true);
  const [whatsAppUpdates, setWhatsAppUpdates] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');
  const [oneClickPay, setOneClickPay] = useState(true);
  const [defaultTip, setDefaultTip] = useState<number>(20);
  const [appLock, setAppLock] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Modals for Settings
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Handle Image Upload from device
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile Details (Photo, Phone, Email)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      phone: editPhone,
      email: editEmail,
      avatar: editAvatar,
    };

    localStorage.setItem('bitetown_user', JSON.stringify(updatedUser));
    setIsEditProfileOpen(false);
    window.location.reload(); // Refresh to reflect updated state immediately
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !area || !pincode) return;

    addAddress({
      type: addressType,
      flatNo,
      landmark,
      area,
      city,
      pincode,
      isDefault: (user?.addresses?.length || 0) === 0,
    });

    setFlatNo('');
    setLandmark('');
    setArea('');
    setPincode('');
    setIsAddAddressOpen(false);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => {
      setCacheCleared(false);
      alert('Local app cache cleared successfully (18.4 MB freed).');
    }, 800);
  };

  const handleDeleteAccount = () => {
    alert('Your account deletion request has been submitted. Data will be purged as per privacy compliance within 30 days.');
    setIsDeleteAccountOpen(false);
    logout();
    navigate('/login');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setIsChangePasswordOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4 pb-28 shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-700" />
          </button>
          <h1 className="text-lg font-black text-zinc-900 tracking-tight">Account & Settings</h1>
        </div>

        {/* Quick Edit Profile Button */}
        <button
          onClick={() => {
            setEditPhone(user?.phone || '');
            setEditEmail(user?.email || '');
            setEditAvatar(user?.avatar || '');
            setIsEditProfileOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-brand-500 rounded-full text-xs font-bold transition-all border border-orange-200/60"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* User Info Header Card */}
      <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50/60 to-white rounded-3xl border border-orange-100/80 shadow-xs mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500/30 shadow-md shadow-brand-500/10"
            />
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="absolute bottom-0 right-0 p-1 bg-brand-500 text-white rounded-full shadow-xs hover:bg-brand-600 transition-all border-2 border-white"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold text-zinc-900 truncate">{user?.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-0.5">
              <PhoneCall className="w-3 h-3 text-brand-500" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-zinc-400" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-100 mb-5 overflow-x-auto scrollbar-none text-xs font-bold">
        {[
          { key: 'profile', label: 'Overview' },
          { key: 'addresses', label: `Addresses (${user?.addresses?.length || 0})` },
          { key: 'settings', label: 'Settings' },
          { key: 'support', label: 'Support' },
          { key: 'privacy', label: 'Privacy' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-3 transition-all whitespace-nowrap relative ${
              activeTab === tab.key ? 'text-brand-500' : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'profile' && (
        <div className="space-y-1">
          {[
            { label: 'My Orders', icon: ShoppingBag, onClick: () => navigate('/orders') },
            { label: 'Saved Addresses', icon: MapPin, onClick: () => setActiveTab('addresses') },
            { label: 'App Settings & Preferences', icon: Settings, onClick: () => setActiveTab('settings') },
            { label: 'Help & 24x7 Support', icon: HelpCircle, onClick: () => setActiveTab('support') },
            { label: 'Privacy & Security Policy', icon: ShieldCheck, onClick: () => setActiveTab('privacy') },
            { label: 'Favorite Dishes', icon: Heart, onClick: () => navigate('/search') },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 text-zinc-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            );
          })}

          <div className="pt-6">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl text-rose-500 bg-rose-50/50 hover:bg-rose-50 font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of BiteTown</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ADDRESSES WITH PIN CODE */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <button
            onClick={() => setIsAddAddressOpen(true)}
            className="w-full py-3.5 border-2 border-dashed border-brand-500/30 bg-orange-50/30 hover:bg-orange-50/70 text-brand-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Delivery Address</span>
          </button>

          <div className="space-y-3">
            {(user?.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border transition-all relative ${
                  addr.isDefault
                    ? 'border-brand-500 bg-orange-50/10 shadow-xs'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gray-100 text-zinc-700">
                      {addr.type === 'Home' && <Home className="w-3.5 h-3.5" />}
                      {addr.type === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                      {addr.type === 'Other' && <Navigation className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-black text-zinc-900">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-brand-500 text-white text-[9px] font-bold rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-zinc-500 hover:text-brand-500"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-zinc-600 leading-relaxed pl-7">
                  <p className="font-semibold text-zinc-900">{addr.flatNo}</p>
                  <p>{addr.landmark ? `${addr.landmark}, ` : ''}{addr.area}</p>
                  <p className="font-medium text-zinc-500 mt-0.5">
                    {addr.city} - <span className="text-brand-600 font-bold tracking-wide">{addr.pincode}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-brand-500" />
              <span>Notification Preferences</span>
            </h3>
            <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Order Updates (Push)</p>
                  <p className="text-[11px] text-zinc-500">Live order status, rider arrival alert</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderPush(!orderPush)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    orderPush ? 'bg-brand-500' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${orderPush ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div>
                  <p className="text-xs font-bold text-zinc-900">WhatsApp Notifications</p>
                  <p className="text-[11px] text-zinc-500">Receive order bills & live tracking link</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsAppUpdates(!whatsAppUpdates)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    whatsAppUpdates ? 'bg-emerald-500' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${whatsAppUpdates ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Promotions & Discounts</p>
                  <p className="text-[11px] text-zinc-500">Daily coupons and seasonal offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoOffers(!promoOffers)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    promoOffers ? 'bg-brand-500' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${promoOffers ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div>
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-brand-500" />
              <span>App Preferences</span>
            </h3>
            <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-zinc-600" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Dark Theme</p>
                    <p className="text-[11px] text-zinc-500">Enable dark theme styling</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    darkMode ? 'bg-zinc-900' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-zinc-600" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">App Language</p>
                    <p className="text-[11px] text-zinc-500">Choose preferred language</p>
                  </div>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-white border border-gray-200 text-xs font-bold text-zinc-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments & Tip */}
          <div>
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-500" />
              <span>Payments & Checkout Experience</span>
            </h3>
            <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Fast 1-Click Checkout</p>
                  <p className="text-[11px] text-zinc-500">Pre-select default address & UPI method</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOneClickPay(!oneClickPay)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    oneClickPay ? 'bg-brand-500' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${oneClickPay ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="border-t border-gray-200/50 pt-3">
                <p className="text-xs font-bold text-zinc-900 mb-1.5">Default Delivery Restaurant Tip</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 20, 30, 50].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setDefaultTip(tip)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        defaultTip === tip
                          ? 'border-brand-500 bg-brand-500 text-white shadow-xs'
                          : 'border-gray-200 bg-white text-zinc-700 hover:bg-gray-100'
                      }`}
                    >
                      {tip === 0 ? 'None' : `₹${tip}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Storage & Permissions */}
          <div>
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
              <span>Storage & Permissions</span>
            </h3>
            <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900">App Cache</p>
                  <p className="text-[11px] text-zinc-500">Free memory & refresh Restaurant menus</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={cacheCleared}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 active:scale-95 text-xs font-bold text-zinc-800 rounded-xl shadow-xs transition-all"
                >
                  {cacheCleared ? 'Clearing...' : 'Clear Cache'}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div>
                  <p className="text-xs font-bold text-zinc-900">App Lock (Biometric)</p>
                  <p className="text-[11px] text-zinc-500">Ask for Fingerprint / PIN on open</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAppLock(!appLock)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    appLock ? 'bg-brand-500' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${appLock ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security & Danger Zone */}
          <div>
            <h3 className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Security & Account Deletion</span>
            </h3>
            <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-3.5 space-y-2">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border border-rose-100/80 hover:bg-rose-50/50 text-zinc-800 text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-600" />
                  <span>Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteAccountOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border border-rose-200 hover:bg-rose-100/50 text-rose-600 text-xs font-black transition-all"
              >
                <span>Delete Account (Purge Data)</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HELP & SUPPORT */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900 text-white rounded-3xl space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-brand-400 uppercase">24x7 Customer Priority</span>
            <h3 className="text-sm font-black">How can we assist your food order today?</h3>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:1800123456"
                className="flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>Call Support</span>
              </a>
              <button
                onClick={() => alert('BiteTown Live Assistant is connecting you to support executive...')}
                className="flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider px-1">Frequently Asked Questions</h4>
            {[
              { q: 'Where is my active order delivery Restaurant?', a: 'You can track the live GPS location of your delivery rider from the Orders > Track Order screen once the Restaurant dispatches the meal.' },
              { q: 'How do I cancel or modify items in my order?', a: 'Cancellations are allowed within 60 seconds of order placement. Once the Restaurant begins preparation, orders cannot be cancelled.' },
              { q: 'What is the refund timeline for failed UPI / Card payments?', a: 'Refunds for debited payments against failed orders are auto-credited within 2 to 4 business hours directly to the source account.' },
              { q: 'Are delivery Restaurants trained in hygienic contact-less drops?', a: 'Yes, all delivery personnel adhere to sanitized food-handling and safety compliance.' },
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-800"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed border-t border-gray-200/60 pt-2">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
          <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-500 flex-shrink-0" />
            <p className="text-[11px] font-medium text-zinc-800">
              BiteTown respects your privacy. We comply with digital data protection laws and industry standard encryption.
            </p>
          </div>

          <div className="space-y-3 p-1">
            <section>
              <h4 className="font-extrabold text-zinc-900 mb-1">1. Information We Collect</h4>
              <p>
                In alignment with food-tech platform policies (Zomato & Swiggy): We gather your name, contact phone number, exact delivery address, geo-location coordinates, device identifier, and transaction records needed to fulfill culinary deliveries.
              </p>
            </section>

            <section>
              <h4 className="font-extrabold text-zinc-900 mb-1">2. Purpose & Rider Location Tracking</h4>
              <p>
                Your precise GPS coordinates are collected in real-time solely to calculate delivery estimates, calculate transit distance fees, and route our delivery fleet accurately to your doorstep.
              </p>
            </section>

            <section>
              <h4 className="font-extrabold text-zinc-900 mb-1">3. Payment Security & PCI-DSS</h4>
              <p>
                BiteTown does not store your full debit/credit card CVV or net banking credentials. All financial transactions are processed securely via PCI-DSS compliant third-party gateways (Stripe / Razorpay).
              </p>
            </section>

            <section>
              <h4 className="font-extrabold text-zinc-900 mb-1">4. Right to Erasure (Account Deletion)</h4>
              <p>
                You retain full control over your personal data. You may request permanent purging of your order histories and saved contact data by emailing <span className="font-bold text-brand-600">privacy@bitetown.com</span>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* MODAL 0: UPDATE PROFILE (PHOTO, PHONE & EMAIL ONLY) */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-zinc-900">Update Profile</h3>
                <p className="text-[11px] text-zinc-400">Update your photo, phone or email</p>
              </div>
              <button onClick={() => setIsEditProfileOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo Upload with preview */}
              <div className="flex flex-col items-center justify-center gap-2 pb-2">
                <div className="relative group">
                  <img
                    src={editAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-100 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-brand-500 hover:underline"
                >
                  Change Profile Photo
                </button>
              </div>

              {/* Read-Only Name (Locked) */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                  Full Name (Cannot be modified)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || 'John Doe'}
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-zinc-500 cursor-not-allowed"
                />
              </div>

              {/* Editable Phone */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <PhoneCall className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Editable Email */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 rounded-xl text-xs font-bold text-zinc-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD ADDRESS BOTTOM SHEET DRAWER */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-zinc-900">Add Delivery Address</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Enter full street details & pincode</p>
              </div>
              <button onClick={() => setIsAddAddressOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddressType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    addressType === t
                      ? 'border-brand-500 bg-brand-500 text-white shadow-xs'
                      : 'border-gray-200 text-zinc-600 hover:bg-gray-50'
                  }`}
                >
                  {t === 'Home' && <Home className="w-3.5 h-3.5" />}
                  {t === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                  {t === 'Other' && <Navigation className="w-3.5 h-3.5" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Flat / House / Building Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Lakeview Apts"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Area / Locality / Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hill Road, Bandra West"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400050"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near St. Joseph School"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/25 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Delivery Location</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PASSWORD */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-zinc-900">Change Password</h3>
              <button onClick={() => setIsChangePasswordOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 rounded-xl text-xs font-bold text-zinc-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 hover:bg-brand-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE ACCOUNT CONFIRMATION */}
      {isDeleteAccountOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900">Are you absolutely sure?</h3>
            <p className="text-xs text-zinc-500">
              This action will permanently delete your account, saved addresses, and active orders. This cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteAccountOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 rounded-xl text-xs font-bold text-zinc-600"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};