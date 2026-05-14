'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleCheck as CheckCircle2, Send, User, Phone, MessageSquare } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CONTACT_METHODS = [
  { value: 'telegram', label: 'Telegram', icon: '✈' },
  { value: 'phone', label: 'Телефон', icon: '📞' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
] as const;

export default function OrderModal({ isOpen, onClose, onSuccess }: OrderModalProps) {
  const { state, totalAmount, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: '',
    customer_telegram: '',
    customer_phone: '',
    contact_method: 'telegram' as 'telegram' | 'phone' | 'whatsapp',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...form,
          total_amount: totalAmount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (order && state.items.length > 0) {
        await supabase.from('order_items').insert(
          state.items.map(item => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          }))
        );
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        setForm({ customer_name: '', customer_telegram: '', customer_phone: '', contact_method: 'telegram', comment: '' });
      }, 2500);
    } catch {
      setError('Ошибка при отправке. Попробуйте ещё раз или напишите в Telegram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
            style={{ zIndex: 60 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-60 overflow-hidden"
            style={{ zIndex: 61 }}
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Заявка отправлена!</h3>
                  <p className="text-sm text-gray-500 mt-1">Мы свяжемся с вами в ближайшее время</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Оформить заявку</h2>
                  <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Order summary */}
                  {state.items.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                      {state.items.map(item => (
                        <div key={item.product.id} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                          <span className="text-gray-900 font-semibold flex-shrink-0">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-gray-200 flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">Итого</span>
                        <span className="font-bold text-gray-900">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  )}

                  {/* Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Имя *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={form.customer_name}
                          onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                          placeholder="Ваше имя"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0088CC] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Telegram</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                        <input
                          type="text"
                          value={form.customer_telegram}
                          onChange={e => setForm(f => ({ ...f, customer_telegram: e.target.value }))}
                          placeholder="username"
                          className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0088CC] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={form.customer_phone}
                          onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                          placeholder="+7 (999) 000-00-00"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0088CC] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Contact method */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">Предпочтительный способ связи</label>
                      <div className="grid grid-cols-3 gap-2">
                        {CONTACT_METHODS.map(m => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, contact_method: m.value }))}
                            className={cn(
                              'py-2 px-2 text-xs font-semibold rounded-xl border transition-all',
                              form.contact_method === m.value
                                ? 'border-[#0088CC] bg-[#0088CC]/5 text-[#0088CC]'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            )}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Комментарий</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          value={form.comment}
                          onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                          placeholder="Уточнения по заказу, количеству, срокам..."
                          rows={3}
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0088CC] focus:bg-white transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#0088CC] text-white font-semibold rounded-xl hover:bg-[#0077BB] active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
