import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bitetown_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bitetown_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prev.filter((ci) => ci.id !== itemId);
    });
  };

  const clearCart = () => setCartItems([]);

  const getTotalAmount = () => {
    return cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalAmount,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};