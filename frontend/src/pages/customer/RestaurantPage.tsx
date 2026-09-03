import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  Loader2, 
  AlertCircle,
  X,
  MapPin,
  Banknote,
  CreditCard,
  CheckCircle2,
  Receipt,
  Tag,
  PlusCircle,
  Edit3,
  Smartphone,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { restaurantService, placeRealOrder } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cartContext = useCart() as any;

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [showAddMoreList, setShowAddMoreList] = useState(false);

  // Address State
  const savedAddresses = [
    'Flat 402, Sea Green Apts, Bandra West, Mumbai',
    'Office 12B, Trade Center, BKC, Mumbai',
  ];
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Realistic Payment System State
  const [paymentType, setPaymentType] = useState<'COD' | 'UPI' | 'CARD'>('COD');
  
  // UPI Sub-states
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');

  // Card Sub-states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const res = await restaurantService.getRestaurantDetails(id);
        
        if (isMounted) {
          const data = res?.data?.data || res?.data || res;
          if (data && data.name) {
            setRestaurant(data);
          } else {
            setError('Restaurant details nahi mili.');
          }
        }
      } catch (err: any) {
        console.error('Fetch restaurant error:', err);
        if (isMounted) {
          setError('Kitchen menu load nahi ho paaya.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOpenBilling = (dish: any) => {
    const dishKey = dish.dishId || dish._id || dish.id;
    const existingIndex = modalItems.findIndex((it) => it.dishId === dishKey);

    if (existingIndex > -1) {
      const updated = [...modalItems];
      updated[existingIndex].quantity += 1;
      setModalItems(updated);
    } else {
      setModalItems([
        ...modalItems,
        {
          dishId: dishKey,
          name: dish.name,
          price: Number(dish.price),
          quantity: 1,
          isVeg: dish.isVeg ?? true,
          image: dish.image,
        },
      ]);
    }
    setIsModalOpen(true);
  };

  const updateModalItemQty = (dishKey: string, delta: number) => {
    const updated = modalItems
      .map((it) => {
        if (it.dishId === dishKey) {
          return { ...it, quantity: it.quantity + delta };
        }
        return it;
      })
      .filter((it) => it.quantity > 0);

    setModalItems(updated);
    if (updated.length === 0) {
      setIsModalOpen(false);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const subtotal = modalItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    if (code === 'BITEFOOD') {
      const disc = Math.min(Math.round(subtotal * 0.5), 120);
      setDiscountAmount(disc);
      setAppliedCoupon('BITEFOOD');
    } else if (code === 'WELCOME20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscountAmount(disc);
      setAppliedCoupon('WELCOME20');
    } else {
      setCouponError('Invalid Coupon! BITEFOOD ya WELCOME20 try karein.');
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
    setCouponError('');
  };

  const itemSubtotal = modalItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const deliveryFee = itemSubtotal > 0 ? 40 : 0;
  const taxAmount = Math.round(itemSubtotal * 0.05);
  const grandTotal = Math.max(0, itemSubtotal + deliveryFee + taxAmount - discountAmount);

  // Card input formatters
  const handleCardNumberChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  // Place Order Execution with Gateway Logic
  const handleConfirmOrder = async () => {
    if (modalItems.length === 0) return;

    // Frontend validations for realistic feel
    if (paymentType === 'UPI' && selectedUpiApp === 'custom' && !customUpiId.includes('@')) {
      alert('Kripya valid UPI ID daalein (e.g. name@okaxis)');
      return;
    }

    if (paymentType === 'CARD') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        alert('Kripya 16-digit ka complete card number daalein.');
        return;
      }
      if (cardExpiry.length < 5) {
        alert('Kripya valid MM/YY expiry date daalein.');
        return;
      }
      if (cardCvv.length < 3) {
        alert('Kripya 3-digit ka valid CVV code daalein.');
        return;
      }
    }

    try {
      if (paymentType !== 'COD') {
        setProcessingPayment(true);
        // Realistic gateway verification delay
        await new Promise((res) => setTimeout(res, 1200));
        setProcessingPayment(false);
      }

      setPlacingOrder(true);

      const activeAddress = isEditingAddress && customAddress.trim() ? customAddress.trim() : selectedAddress;

      let paymentLabel = 'Cash on Delivery (COD)';
      if (paymentType === 'UPI') {
        paymentLabel = selectedUpiApp === 'custom' ? `UPI (${customUpiId})` : `UPI (${selectedUpiApp.toUpperCase()})`;
      } else if (paymentType === 'CARD') {
        paymentLabel = `Card Ending In ****${cardNumber.slice(-4)}`;
      }

      const orderPayload = {
        restaurantId: restaurant?.RestaurantId || restaurant?.restaurantId || restaurant?._id || id,
        restaurantName: restaurant?.name || 'BiteFood Kitchen',
        items: modalItems.map((item) => ({
          dishId: item.dishId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isVeg: item.isVeg,
        })),
        totalAmount: grandTotal,
        deliveryAddress: activeAddress,
        paymentMethod: paymentLabel,
        paymentStatus: paymentType === 'COD' ? 'Pending' : 'Paid',
      };

      const res = await placeRealOrder(orderPayload);

      if (typeof cartContext.clearCart === 'function') {
        cartContext.clearCart();
      }

      setIsModalOpen(false);
      setModalItems([]);
      navigate('/orders', { state: { newOrder: res?.data || orderPayload } });
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Order confirm karne me samasya aayi. Dobara try karein.');
    } finally {
      setPlacingOrder(false);
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <span className="text-xs font-bold text-zinc-500">Loading menu & kitchen...</span>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <h2 className="text-sm font-bold text-zinc-800">{error || 'Restaurant not found'}</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const menuList = restaurant.menu || [];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 relative">
      {/* Top Banner */}
      <div className="relative h-56 bg-zinc-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-black/40" />

        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <h1 className="text-xl font-black">{restaurant.name}</h1>
          <p className="text-xs text-zinc-300 line-clamp-1">{restaurant.cuisine}</p>
          <div className="flex items-center gap-3 pt-1 text-[11px] font-bold">
            <span className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded text-white">
              <Star className="w-3 h-3 fill-white" />
              {restaurant.rating || 4.5}
            </span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Clock className="w-3 h-3 text-brand-400" />
              {restaurant.deliveryTime || '20-25 mins'}
            </span>
            <span className="text-zinc-300">₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
            Menu Items ({menuList.length})
          </h2>
        </div>

        <div className="space-y-3">
          {menuList.map((dish: any) => {
            const dishKey = dish.dishId || dish._id || dish.id || dish.name;
            const isAvailable = dish.inStock ?? dish.isAvailable ?? true;
            const inModalItem = modalItems.find((it) => it.dishId === dishKey);

            return (
              <div
                key={dishKey}
                onClick={() => isAvailable && handleOpenBilling(dish)}
                className={`bg-white rounded-2xl p-3.5 border border-gray-100 flex gap-3.5 items-center justify-between shadow-soft cursor-pointer hover:border-brand-200 active:scale-99 transition ${
                  !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                        dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </span>
                    <h3 className="font-bold text-xs text-zinc-900 truncate">{dish.name}</h3>
                  </div>

                  <div className="text-xs font-black text-zinc-900">₹{dish.price}</div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                    {dish.description}
                  </p>
                </div>

                <div className="relative w-24 h-24 shrink-0 flex flex-col items-center justify-end">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="absolute inset-0 w-full h-20 object-cover rounded-xl bg-gray-100"
                  />

                  {!isAvailable ? (
                    <span className="relative z-10 bg-zinc-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Sold Out
                    </span>
                  ) : inModalItem ? (
                    <div className="relative z-10 bg-brand-500 text-white flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-black shadow-md">
                      <span>{inModalItem.quantity} In Order</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBilling(dish);
                      }}
                      className="relative z-10 bg-white border border-brand-500 text-brand-600 px-4 py-1 rounded-lg text-xs font-black shadow-md hover:bg-brand-50 active:scale-95 transition cursor-pointer"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL REALISTIC ORDER & BILLING SUMMARY MODAL */}
      {isModalOpen && modalItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 no-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-500" />
                <div>
                  <h3 className="font-black text-sm text-zinc-900">Order & Billing Summary</h3>
                  <span className="text-[10px] text-zinc-400 font-bold block">{restaurant.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-zinc-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Items List */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider block">
                Selected Dishes
              </span>
              <div className="divide-y divide-gray-100 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                {modalItems.map((item) => (
                  <div key={item.dishId} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">{item.name}</h4>
                      <p className="text-xs font-black text-zinc-700">₹{item.price * item.quantity}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-2 py-0.5 rounded-xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateModalItemQty(item.dishId, -1)}
                        className="text-zinc-600 hover:text-brand-500 cursor-pointer p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-zinc-900 min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateModalItemQty(item.dishId, 1)}
                        className="text-zinc-600 hover:text-brand-500 cursor-pointer p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add More Items Drawer */}
            <div className="bg-brand-50/50 rounded-2xl p-3 border border-brand-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-brand-700">
                  <PlusCircle className="w-4 h-4" />
                  <span>Add More Items From {restaurant.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMoreList(!showAddMoreList)}
                  className="text-[11px] font-bold text-brand-600 underline cursor-pointer"
                >
                  {showAddMoreList ? 'Hide Menu' : 'View Menu'}
                </button>
              </div>

              {showAddMoreList && (
                <div className="pt-2 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {menuList.map((dish: any) => {
                    const dishKey = dish.dishId || dish._id || dish.id;
                    const inList = modalItems.find((it) => it.dishId === dishKey);

                    return (
                      <div
                        key={dishKey}
                        className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100 text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-bold text-zinc-900 truncate">{dish.name}</p>
                          <span className="text-zinc-500 font-bold text-[11px]">₹{dish.price}</span>
                        </div>
                        {inList ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Added ({inList.quantity})
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenBilling(dish)}
                            className="bg-brand-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs hover:bg-brand-600 cursor-pointer"
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Apply Coupon Box */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-zinc-800">
                <Tag className="w-4 h-4 text-brand-500" />
                <span>Offers & Coupons</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-black text-emerald-800">
                      '{appliedCoupon}' Applied (Save ₹{discountAmount})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-600 cursor-pointer hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter BITEFOOD or WELCOME20"
                      className="flex-1 text-xs font-bold uppercase p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-zinc-900 text-white text-xs font-bold px-4 rounded-xl cursor-pointer hover:bg-zinc-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>}
                </div>
              )}
            </div>

            {/* Address Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-zinc-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span>Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[11px] text-brand-600 flex items-center gap-1 cursor-pointer font-bold hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingAddress ? 'Select Saved' : '+ New / Edit'}</span>
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  rows={2}
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="Enter house no, building name, street, area..."
                  className="w-full text-xs font-medium p-2.5 bg-gray-50 border border-brand-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <div className="space-y-1.5">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                        selectedAddress === addr
                          ? 'border-brand-500 bg-brand-50/40 font-bold text-zinc-900'
                          : 'border-gray-200 text-zinc-600 bg-gray-50'
                      }`}
                    >
                      <span className="truncate pr-2">{addr}</span>
                      {selectedAddress === addr && (
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* REALISTIC PAYMENT GATEWAY SELECTOR */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black text-zinc-800">
                <span>Select Payment Mode</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> 100% Secure Gateway
                </span>
              </div>

              {/* 3 Main Tabs: COD, UPI, Card */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('COD')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${
                    paymentType === 'COD'
                      ? 'border-brand-500 bg-brand-50/60 text-brand-700 font-bold'
                      : 'border-gray-200 text-zinc-600 bg-gray-50'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[11px]">Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('UPI')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${
                    paymentType === 'UPI'
                      ? 'border-brand-500 bg-brand-50/60 text-brand-700 font-bold'
                      : 'border-gray-200 text-zinc-600 bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[11px]">UPI (Apps)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('CARD')}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${
                    paymentType === 'CARD'
                      ? 'border-brand-500 bg-brand-50/60 text-brand-700 font-bold'
                      : 'border-gray-200 text-zinc-600 bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Debit/Credit</span>
                </button>
              </div>

              {/* DYNAMIC UPI SECTION */}
              {paymentType === 'UPI' && (
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2.5 animate-in fade-in duration-150">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">
                    Choose UPI Application
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gpay', name: 'GPay', icon: '🟢' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵' },
                    ].map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-xl border text-center text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 ${
                          selectedUpiApp === app.id
                            ? 'bg-white border-brand-500 text-brand-600 shadow-2xs'
                            : 'bg-white/60 border-gray-200 text-zinc-600'
                        }`}
                      >
                        <span>{app.icon}</span>
                        <span>{app.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <div
                      onClick={() => setSelectedUpiApp('custom')}
                      className="flex items-center justify-between text-xs font-bold text-zinc-700 cursor-pointer pb-1.5"
                    >
                      <span>Or Enter Any UPI ID</span>
                      <span className="text-[10px] text-brand-600 underline">Custom VPA</span>
                    </div>
                    {selectedUpiApp === 'custom' && (
                      <input
                        type="text"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                        placeholder="e.g. mobile@oksbi, user@paytm"
                        className="w-full text-xs font-medium p-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* DYNAMIC CARD GATEWAY SECTION */}
              {paymentType === 'CARD' && (
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                      Card Details
                    </span>
                    <div className="flex gap-1 text-[10px] font-bold text-zinc-400">
                      <span>VISA</span> • <span>Mastercard</span> • <span>RuPay</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      className="w-full text-xs font-medium p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full text-xs font-medium p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-center"
                    />
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="CVV (3-digits)"
                      className="w-full text-xs font-medium p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-center"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Cardholder Name"
                      className="w-full text-xs font-medium p-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit Encrypted Payments. No card data saved.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Breakdown */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-zinc-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-bold text-zinc-800">₹{itemSubtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600 font-medium">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-zinc-800">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-zinc-600 font-medium">
                <span>Taxes & Kitchen Charges (5%)</span>
                <span className="font-bold text-zinc-800">₹{taxAmount}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-black text-zinc-900">
                <span>Grand Total</span>
                <span className="text-brand-600">₹{grandTotal}</span>
              </div>
            </div>

            {/* Place & Pay Order Button */}
            <button
              type="button"
              disabled={placingOrder || processingPayment}
              onClick={handleConfirmOrder}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:scale-98 transition disabled:opacity-60 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Bank Gateway...</span>
                </>
              ) : placingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting to Kitchen Desk...</span>
                </>
              ) : (
                <span>
                  {paymentType === 'COD' ? 'Place Order with COD' : `Pay ₹${grandTotal} via ${paymentType}`}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};