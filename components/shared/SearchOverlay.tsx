'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ProductWithDetails } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { getPriceForQuantity } from '@/lib/cart-context';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select(`*, images:product_images(*), pricing_tiers:product_pricing_tiers(*)`)
        .neq('status', 'archived')
        .ilike('name', `%${query}%`)
        .limit(6);
      setResults((data as ProductWithDetails[]) ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-1/2 -translate-x-1/2 top-4 sm:top-8 w-full max-w-xl z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <Search className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 transition-colors ml-1 flex-shrink-0">
                  Закрыть
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading && (
                  <div className="py-8 flex justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-gray-200 border-t-[#0088CC] rounded-full"
                    />
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="py-10 flex flex-col items-center gap-2 text-center">
                    <Package className="w-8 h-8 text-gray-200" />
                    <p className="text-sm text-gray-400">Ничего не найдено по запросу «{query}»</p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="p-2">
                    {results.map(product => {
                      const img = product.images.find(i => i.is_primary) ?? product.images[0];
                      const price = getPriceForQuantity(product.pricing_tiers, 1);
                      return (
                        <Link
                          key={product.id}
                          href={`/catalog/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {img ? (
                              <Image src={img.url} alt={product.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-300 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#0088CC] transition-colors">{product.name}</p>
                            {price > 0 && <p className="text-xs text-gray-400">от {formatPrice(price)}</p>}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0088CC] transition-colors flex-shrink-0" />
                        </Link>
                      );
                    })}

                    <Link
                      href={`/catalog?q=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-2.5 mt-1 text-xs font-semibold text-[#0088CC] hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      Смотреть все результаты
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {!query && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-400">Начните вводить название товара</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
