import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChefHat, 
  AlertCircle, 
  Bike, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  X 
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'REJECTED';
  prepTimeMinutes: number;
  orderedAt: string;
  deliveryType: 'DELIVERY' | 'TAKEAWAY';
  rejectionReason?: string;
}

export const RestaurantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: 'ord-101',
      orderNumber: '#BT-8821',
      customerName: 'Rahul Sharma',
      items: [
        { id: 'i1', name: 'Farmhouse Pizza (Large)', quantity: 1, price: 450, notes: 'Extra oregano, crisper crust' },
        { id: 'i2', name: 'Garlic Breadsticks', quantity: 2, price: 180 },
        { id: 'i3', name: 'Cold Coke (500ml)', quantity: 1, price: 60 },
      ],
      totalAmount: 870,
      status: 'PENDING',
      prepTimeMinutes: 20,
      orderedAt: 'Just now',
      deliveryType: 'DELIVERY',
    },
    {
      id: 'ord-102',
      orderNumber: '#BT-8820',
      customerName: 'Pooja Verma',
      items: [
        { id: 'i4', name: 'Paneer Makhani Roll', quantity: 2, price: 260 },
        { id: 'i5', name: 'Masala Lemonade', quantity: 1, price: 80 },
      ],
      totalAmount: 600,
      status: 'PREPARING',
      prepTimeMinutes: 15,
      orderedAt: '6 mins ago',
      deliveryType: 'TAKEAWAY',
    },
    {
      id: 'ord-103',
      orderNumber: '#BT-8819',
      customerName: 'Amit Saxena',
      items: [
        { id: 'i6', name: 'Cheese Burst Veggie Burst', quantity: 1, price: 520 },
      ],
      totalAmount: 520,
      status: 'READY',
      prepTimeMinutes: 25,
      orderedAt: '18 mins ago',
      deliveryType: 'DELIVERY',
    },
  ]);

  // Audio Buzzer State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Modal States
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState('Item out of stock');
  const [customRejectReason, setCustomRejectReason] = useState('');

  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const [selectedPrepTime, setSelectedPrepTime] = useState<number>(20);

  const rejectionReasons = [
    'Item out of stock',
    'Kitchen at maximum capacity',
    'Outlet closing soon',
    'Ingredient quality issue',
    'Other reason',
  ];

  // Synthesize Kitchen Chime via Web Audio API (Zero external file dependency)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Ring alert if any order is PENDING
  useEffect(() => {
    const hasPending = orders.some((o) => o.status === 'PENDING');
    if (hasPending && soundEnabled) {
      playChime();
    }
  }, [orders, soundEnabled]);

  // Handle Order Accept with Chosen Prep Time
  const confirmAcceptOrder = () => {
    if (!acceptingOrderId) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === acceptingOrderId
          ? { ...ord, status: 'PREPARING', prepTimeMinutes: selectedPrepTime }
          : ord
      )
    );
    setAcceptingOrderId(null);
  };

  // Handle Order Rejection
  const confirmRejectOrder = () => {
    if (!rejectingOrderId) return;
    const finalReason = selectedRejectReason === 'Other reason' 
      ? customRejectReason.trim() || 'Kitchen unavailable' 
      : selectedRejectReason;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === rejectingOrderId
          ? { ...ord, status: 'REJECTED', rejectionReason: finalReason }
          : ord
      )
    );
    setRejectingOrderId(null);
    setSelectedRejectReason('Item out of stock');
    setCustomRejectReason('');
  };

  // Mark as Ready for Pickup / Delivery
  const markAsReady = (id: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: 'READY' } : ord))
    );
  };

  // Quick simulate incoming order
  const simulateIncomingOrder = () => {
    const newId = `ord-${Date.now().toString().slice(-4)}`;
    const randomOrder: KitchenOrder = {
      id: newId,
      orderNumber: `#BT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Ananya Roy',
      items: [
        { id: 'i7', name: 'BBQ Chicken Supreme', quantity: 1, price: 490 },
        { id: 'i8', name: 'Spicy Dip', quantity: 2, price: 50 },
      ],
      totalAmount: 590,
      status: 'PENDING',
      prepTimeMinutes: 20,
      orderedAt: 'Just now',
      deliveryType: 'DELIVERY',
    };
    setOrders((prev) => [randomOrder, ...prev]);
    playChime();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Audio Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Live Kitchen KDS</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time incoming kitchen tickets & preparation timer</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Kitchen Bell Active' : 'Sound Muted'}</span>
          </button>

          <button
            onClick={simulateIncomingOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Order</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.map((order) => {
          const isPending = order.status === 'PENDING';
          const isPreparing = order.status === 'PREPARING';
          const isReady = order.status === 'READY';
          const isRejected = order.status === 'REJECTED';

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-soft transition ${
                isPending
                  ? 'border-brand-300 ring-2 ring-brand-500/20 shadow-brand-500/5'
                  : isPreparing
                  ? 'border-amber-200'
                  : isReady
                  ? 'border-emerald-200'
                  : 'border-zinc-200 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-zinc-900">{order.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isPending
                        ? 'bg-brand-50 text-brand-700 border-brand-200 animate-pulse'
                        : isPreparing
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : isReady
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
                  <span className="font-bold text-zinc-800">{order.customerName}</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{order.orderedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-zinc-600">
                    <Bike className="w-3 h-3 text-brand-500" />
                    {order.deliveryType}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">
                    Target: {order.prepTimeMinutes} mins
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex-1 space-y-2.5">
                {order.items.map((item) => (
                  <div key={item.id} className="text-xs">
                    <div className="flex items-center justify-between font-semibold text-zinc-800">
                      <span>
                        <strong className="text-brand-600 mr-1.5">{item.quantity}x</strong>
                        {item.name}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-amber-700 bg-amber-50/70 px-2 py-0.5 rounded mt-1 border border-amber-100">
                        ⚠️ Note: {item.notes}
                      </div>
                    )}
                  </div>
                ))}

                {isRejected && order.rejectionReason && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-semibold flex items-start gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Reason: {order.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Card Footer & Action Buttons */}
              <div className="p-4 bg-gray-50/75 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900 pb-1">
                  <span>Bill Total</span>
                  <span className="text-sm font-black">₹{order.totalAmount}</span>
                </div>

                {isPending && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setRejectingOrderId(order.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => {
                        setAcceptingOrderId(order.id);
                        setSelectedPrepTime(order.prepTimeMinutes || 20);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-xs active:scale-98 transition"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  </div>
                )}

                {isPreparing && (
                  <button
                    onClick={() => markAsReady(order.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs active:scale-98 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Order Ready</span>
                  </button>
                )}

                {isReady && (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-700 text-center rounded-xl text-xs font-bold border border-emerald-200">
                    Dispatched / Waiting for Driver
                  </div>
                )}

                {isRejected && (
                  <div className="w-full py-2 bg-gray-100 text-zinc-400 text-center rounded-xl text-xs font-bold">
                    Order Cancelled
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. ACCEPT ORDER MODAL (PREPARATION TIME SELECTION) */}
      {acceptingOrderId && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-brand-500" />
                <h3 className="font-black text-sm text-zinc-900">Set Kitchen Prep Time</h3>
              </div>
              <button onClick={() => setAcceptingOrderId(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Select estimated preparation time. Customer & delivery driver will be notified accordingly:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 25, 30, 40, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedPrepTime(mins)}
                  className={`py-2.5 rounded-xl text-xs font-black border transition ${
                    selectedPrepTime === mins
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-zinc-700 hover:bg-gray-100'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setAcceptingOrderId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptOrder}
                className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-xs"
              >
                Send to Kitchen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REJECT ORDER MODAL (REASON SELECTION) */}
      {rejectingOrderId && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-sm text-zinc-900">Decline Kitchen Order</h3>
              </div>
              <button onClick={() => setRejectingOrderId(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Please state why this order cannot be prepared right now:
            </p>

            <div className="space-y-1.5">
              {rejectionReasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={selectedRejectReason === reason}
                    onChange={() => setSelectedRejectReason(reason)}
                    className="accent-brand-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {selectedRejectReason === 'Other reason' && (
              <textarea
                rows={2}
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                placeholder="Specify rejection reason..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={confirmRejectOrder}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};