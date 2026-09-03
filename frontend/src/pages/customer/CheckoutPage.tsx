import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { placeRealOrder } from '../../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cartContext = useCart() as any;

  const cartItems: any[] = cartContext.items || cartContext.cart || [];
  const [address, setAddress] = useState('Flat 402, Sea Green Apts, Bandra West, Mumbai');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [loading, setLoading] = useState(false);

  const itemTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const grandTotal = itemTotal + 40 + Math.round(itemTotal * 0.05);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        restaurantId: cartItems[0]?.restaurantId || 'rest_1',
        restaurantName: cartItems[0]?.restaurantName || 'BiteFood Outlet',
        items: cartItems.map((it: any) => ({
          dishId: it.dishId || it._id || it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity || 1,
          isVeg: it.isVeg ?? true
        })),
        totalAmount: grandTotal,
        deliveryAddress: address,
        paymentMethod: paymentMethod
      };

      await placeRealOrder(orderPayload);

      // Clear the cart on successful order
      if (typeof cartContext.clearCart === 'function') {
        cartContext.clearCart();
      }

      // Redirect to live order tracking page
      navigate('/orders');
    } catch (err: any) {
      console.error('Order creation failed:', err);
      alert('Order place karne me problem aayi. Server active hai ya nahi check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-32">
      {/* Top Bar */}
      <div className="bg-white p-4 sticky top-0 z-30 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-black text-zinc-900">Checkout & Payment</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Delivery Address Section */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-zinc-900">
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>Delivery Location</span>
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft space-y-3">
          <div className="text-xs font-black text-zinc-900">Choose Payment Method</div>

          <div
            onClick={() => setPaymentMethod('COD')}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              paymentMethod === 'COD'
                ? 'border-brand-500 bg-brand-50/40 text-brand-700'
                : 'border-gray-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Banknote className="w-4 h-4" />
              <span className="text-xs font-bold">Cash on Delivery (COD)</span>
            </div>
            {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
          </div>

          <div
            onClick={() => setPaymentMethod('Online')}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              paymentMethod === 'Online'
                ? 'border-brand-500 bg-brand-50/40 text-brand-700'
                : 'border-gray-200 text-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-bold">UPI / Cards / NetBanking</span>
            </div>
            {paymentMethod === 'Online' && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
          </div>
        </div>
      </div>

      {/* Pay & Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-100 shadow-xl z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Amount</span>
          <span className="text-base font-black text-zinc-900">₹{grandTotal}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 active:scale-98 transition text-white rounded-xl text-xs font-black shadow-lg shadow-brand-500/30 flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Placing Order...</span>
            </>
          ) : (
            <span>Place Order Now</span>
          )}
        </button>
      </div>
    </div>
  );
};