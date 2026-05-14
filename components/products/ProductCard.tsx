'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight, Package } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/supabase';
import { formatPrice, getStatusLabel, getStatusColor, cn } from '@/lib/utils';
import { getPriceForQuantity, useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: ProductWithDetails;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCart();

  const primaryImage = product.images.find(i => i.is_primary) ?? product.images[0];
  const minPrice = getPriceForQuantity(product.pricing_tiers, 1);
  const maxTierPrice = product.pricing_tiers.length > 1
    ? product.pricing_tiers.sort((a, b) => b.min_quantity - a.min_quantity)[0].price_rub
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem(product, 1);
    await new Promise(r => setTimeout(r, 600));
    setAdding(false);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/catalog/${product.slug}`} className="group block">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            {primaryImage ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                )}
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  className={cn(
                    'object-cover transition-all duration-500 group-hover:scale-105',
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImgLoaded(true)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_new && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500 text-white rounded-lg shadow-sm">
                  Новинка
                </span>
              )}
              {product.is_featured && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#0088CC] text-white rounded-lg shadow-sm flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" /> Хит
                </span>
              )}
            </div>

            {/* Status badge */}
            <div className="absolute top-2 right-2">
              <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-lg', getStatusColor(product.status))}>
                {getStatusLabel(product.status)}
              </span>
            </div>

            {/* Quick add overlay */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-gray-900/90 backdrop-blur-sm text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
              >
                {adding ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {adding ? 'Добавляю...' : 'В корзину'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1.5 group-hover:text-[#0088CC] transition-colors">
              {product.name}
            </h3>

            {product.short_description && (
              <p className="text-xs text-gray-400 line-clamp-1 mb-2">{product.short_description}</p>
            )}

            {/* Pricing */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">
                  {formatPrice(minPrice)}
                </div>
                {maxTierPrice && maxTierPrice < minPrice && (
                  <div className="text-[10px] text-gray-400">
                    от {formatPrice(maxTierPrice)} оптом
                  </div>
                )}
              </div>
              <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-[#0088CC] flex items-center justify-center transition-colors duration-300">
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
