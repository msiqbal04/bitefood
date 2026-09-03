import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus,  ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartContext = useCart() as any;

  const cartItems: any[] = cartContext.items || cartContext.cart || [];

  const handleUpdate = (dishId: string, delta: number) => {
    if (delta > 0) {
      if (typeof cartContext.addItem === 'function') cartContext.addItem({ id: dishId });
      else if (typeof cartContext.addToCart === 'function') cartContext.addToCart({ id: dishId });
    } else {
      if (typeof cartContext.removeItem === 'function') cartContext.removeItem(dishId);
      else if (typeof cartContext.removeFromCart === 'function') cartContext.removeFromCart(dishId);
    }
  };

  const itemTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + taxes;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-base font-black text-zinc-900">Aapka cart khali hai</h2>
        <p className="text-xs text-zinc-400">Apne pasandeeda restaurant se dishes add karein.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

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
        <h1 className="text-sm font-black text-zinc-900">Your Food Basket</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Items List */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft space-y-3">
          <div className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Added Items ({cartItems.length})
          </div>

          <div className="divide-y divide-gray-100">
            {cartItems.map((item: any) => {
              const dishKey = item.dishId || item._id || item.id;
              const qty = item.quantity || 1;

              return (
                <div key={dishKey} className="py-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 border flex items-center justify-center rounded-xs ${
                          item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                      </span>
                      <span className="font-bold text-xs text-zinc-800 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-zinc-900">₹{item.price}</span>
                  </div>

                  <div className="bg-brand-50 border border-brand-200 text-brand-700 flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-black">
                    <button
                      onClick={() => handleUpdate(dishKey, -1)}
                      className="cursor-pointer hover:opacity-75"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() => handleUpdate(dishKey, 1)}
                      className="cursor-pointer hover:opacity-75"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft space-y-2 text-xs">
          <div className="font-black text-zinc-800 pb-1 border-b border-gray-100">Bill Breakdown</div>
          <div className="flex justify-between text-zinc-500">
            <span>Item Total</span>
            <span className="font-bold text-zinc-800">₹{itemTotal}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Delivery Partner Fee</span>
            <span className="font-bold text-zinc-800">₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Govt Taxes & Charges (5%)</span>
            <span className="font-bold text-zinc-800">₹{taxes}</span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-zinc-900">
            <span>To Pay</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px] px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Safe & hygienic contactless food delivery</span>
        </div>
      </div>

      {/* Checkout Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-gray-100 shadow-xl z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Payable</span>
          <span className="text-base font-black text-zinc-900">₹{grandTotal}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 active:scale-98 transition text-white rounded-xl text-xs font-black shadow-lg shadow-brand-500/30 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Select Address & Pay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};