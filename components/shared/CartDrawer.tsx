'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import OrderModal from './OrderModal';

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalAmount, totalItems } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {state.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4.5 h-4.5 text-gray-600" />
                  <span className="text-base font-semibold text-gray-900">Корзина</span>
                  {totalItems > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-[#0088CC] text-white rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto">
                {state.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Корзина пуста</p>
                      <p className="text-xs text-gray-400 mt-1">Добавьте товары из каталога</p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="text-sm font-semibold text-[#0088CC] hover:underline"
                    >
                      Перейти в каталог
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {state.items.map(item => {
                      const primaryImage = item.product.images.find(i => i.is_primary) ?? item.product.images[0];
                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          {/* Image */}
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{item.product.name}</p>
                            <p className="text-[11px] text-[#0088CC] font-semibold mt-0.5">{formatPrice(item.unitPrice)} / шт</p>

                            {/* Quantity */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-semibold text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs font-bold text-gray-900">{formatPrice(item.totalPrice)}</span>
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Итого ({totalItems} шт)</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Финальная цена уточняется при оформлении</p>
                  <button
                    onClick={() => setOrderOpen(true)}
                    className="w-full py-3.5 bg-[#0088CC] text-white font-semibold rounded-xl hover:bg-[#0077BB] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    Оформить заявку
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        onSuccess={() => { setOrderOpen(false); closeCart(); }}
      />
    </>
  );
}
