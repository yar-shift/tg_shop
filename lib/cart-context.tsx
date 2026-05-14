'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ProductWithDetails, PricingTier } from './supabase';

export type CartItem = {
  product: ProductWithDetails;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; product: ProductWithDetails; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

export function getPriceForQuantity(tiers: PricingTier[], qty: number): number {
  if (!tiers.length) return 0;
  const sorted = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  let price = sorted[0].price_rub;
  for (const tier of sorted) {
    if (qty >= tier.min_quantity) {
      price = tier.price_rub;
    }
  }
  return price;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      const newQty = (existing?.quantity ?? 0) + action.quantity;
      const unitPrice = getPriceForQuantity(action.product.pricing_tiers, newQty);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: newQty, unitPrice, totalPrice: unitPrice * newQty }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity, unitPrice, totalPrice: unitPrice * action.quantity },
        ],
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map(i => {
          if (i.product.id !== action.productId) return i;
          const unitPrice = getPriceForQuantity(i.product.pricing_tiers, action.quantity);
          return { ...i, quantity: action.quantity, unitPrice, totalPrice: unitPrice * action.quantity };
        }),
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.productId) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

type CartContextValue = {
  state: CartState;
  addItem: (product: ProductWithDetails, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem = useCallback((product: ProductWithDetails, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  }, []);
  const removeItem = useCallback((productId: string) => dispatch({ type: 'REMOVE_ITEM', productId }), []);
  const updateQuantity = useCallback((productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = state.items.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
