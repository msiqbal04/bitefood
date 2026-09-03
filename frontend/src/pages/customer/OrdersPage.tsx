import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Clock, 
  MapPin,
  Sparkles,
  
} from 'lucide-react';
import api from '../../services/api';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status progression mapping
  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 1;
      case 'accepted':
      case 'preparing':
        return 2;
      case 'ready':
      case 'out for delivery':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          text: 'Waiting for Restaurant to Accept',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-ping',
        };
      case 'accepted':
      case 'preparing':
        return {
          text: 'Order Accepted & In the Kitchen',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'ready':
      case 'out for delivery':
      case 'out_for_delivery':
        return {
          text: 'Rider Out For Delivery',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500 animate-bounce',
        };
      case 'delivered':
      case 'completed':
        return {
          text: 'Delivered Successfully',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          text: status || 'Processing',
          color: 'bg-zinc-50 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-400',
        };
    }
  };

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/orders');
      const list = res?.data?.data || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setOrders(list);
      } else if (location.state?.newOrder) {
        setOrders([location.state.newOrder]);
      }
    } catch (err) {
      console.error('Failed to fetch live orders:', err);
      if (location.state?.newOrder && orders.length === 0) {
        setOrders([location.state.newOrder]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);

    // Live polling: Har 4 seconds mein status check karega
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black text-zinc-900">Live Order Tracking</h1>
            <span className="text-[10px] text-zinc-400 font-bold block">
              Auto-refreshing live status
            </span>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
            <span className="text-xs font-medium">Connecting to restaurant desk...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-zinc-800">No Orders Found</h3>
            <p className="text-xs text-zinc-400 font-medium">
              You haven't placed any orders yet. Try our delicious menu!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-brand-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer hover:bg-brand-600"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          orders.map((ord: any, index: number) => {
            const orderKey = ord._id || ord.orderId || `order_${index}`;
            const items = ord.items || [];
            const currentStep = getStepIndex(ord.status);
            const badge = getStatusBadge(ord.status);

            return (
              <div
                key={orderKey}
                className="bg-white rounded-3xl p-4 border border-gray-100 shadow-soft space-y-4"
              >
                {/* Top Restaurant Title & Live Status */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 truncate">
                      {ord.restaurantName || 'BiteFood Kitchen'}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Ordered at{' '}
                      {ord.createdAt
                        ? new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Just now'}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${badge.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.text}</span>
                  </div>
                </div>

                {/* VISUAL 4-STEP LIVE TRACKER */}
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-zinc-800">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      Delivery Progress
                    </span>
                    <span className="text-[11px] text-brand-600">
                      {currentStep === 4 ? 'Completed' : 'Estimated 25-30 mins'}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="relative flex items-center justify-between pt-1">
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0">
                      <div
                        className="h-full bg-brand-500 transition-all duration-500"
                        style={{
                          width: `${((currentStep - 1) / 3) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Step 1: Placed */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 1
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-zinc-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black text-zinc-700">Placed</span>
                    </div>

                    {/* Step 2: Accepted / Preparing */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 2
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-zinc-400'
                        }`}
                      >
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black text-zinc-700">Accepted</span>
                    </div>

                    {/* Step 3: Out For Delivery */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 3
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-zinc-400'
                        }`}
                      >
                        <Bike className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black text-zinc-700">On Way</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 4
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-zinc-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black text-zinc-700">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-2 text-xs bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                      Delivery Destination
                    </span>
                    <p className="text-zinc-700 font-medium truncate">
                      {ord.deliveryAddress || 'Bandra West, Mumbai'}
                    </p>
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                    Order Summary ({items.length} items)
                  </span>
                  <div className="divide-y divide-gray-100">
                    {items.map((it: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`w-2.5 h-2.5 rounded-xs border flex items-center justify-center shrink-0 ${
                              it.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                it.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                          <span className="font-bold text-zinc-800 truncate">{it.name}</span>
                          <span className="text-zinc-400 text-[11px]">x{it.quantity || 1}</span>
                        </div>
                        <span className="font-bold text-zinc-900 shrink-0">
                          ₹{(it.price || 0) * (it.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Payment Method */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <span>Payment:</span>
                    <span className="text-zinc-800 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                      {ord.paymentMethod || 'COD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-400 text-[11px]">Total Paid:</span>
                    <span className="text-sm font-black text-brand-600">₹{ord.totalAmount}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};