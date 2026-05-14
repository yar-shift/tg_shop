'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ShoppingCart, Send, Share2, Copy, Check,
  Package, ExternalLink, ChevronLeft as Prev, ChevronRight as Next,
} from 'lucide-react';
import type { ProductWithDetails } from '@/lib/supabase';
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils';
import { useCart, getPriceForQuantity } from '@/lib/cart-context';
import PricingTiers from '@/components/products/PricingTiers';
import ProductCard from '@/components/products/ProductCard';

interface ProductPageClientProps {
  product: ProductWithDetails;
  related: ProductWithDetails[];
}

export default function ProductPageClient({ product, related }: ProductPageClientProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const { addItem, openCart } = useCart();

  const images = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const currentPrice = getPriceForQuantity(product.pricing_tiers, quantity);

  const handleAddToCart = async () => {
    setAdding(true);
    addItem(product, quantity);
    await new Promise(r => setTimeout(r, 600));
    setAdding(false);
    openCart();
  };

  const handleCopySKU = () => {
    navigator.clipboard.writeText(product.sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-6 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-gray-600 transition-colors">Каталог</Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Gallery */}
        <div>
          {/* Main image */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 cursor-zoom-in"
            onClick={() => images.length > 0 && setLightbox(true)}
          >
            {images.length > 0 ? (
              <Image
                src={images[activeImg]?.url}
                alt={images[activeImg]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-200" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
                  <Prev className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors">
                  <Next className="w-4 h-4 text-gray-700" />
                </button>
              </>
            )}

            {/* Status */}
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusColor(product.status)}`}>
                {getStatusLabel(product.status)}
              </span>
            </div>
          </div>

          {/* Thumbs */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImg === i ? 'border-[#0088CC]' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {product.is_new && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500 text-white rounded-lg">Новинка</span>
            )}
            {product.is_featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#0088CC] text-white rounded-lg">Хит продаж</span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

          {product.short_description && (
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.short_description}</p>
          )}

          {/* SKU & Share */}
          <div className="flex items-center gap-3 mb-6">
            {product.sku && (
              <button
                onClick={handleCopySKU}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Скопировано' : `SKU: ${product.sku}`}</span>
              </button>
            )}
            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors ml-auto">
              <Share2 className="w-3.5 h-3.5" />
              Поделиться
            </button>
          </div>

          {/* Current price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
              <span className="text-sm text-gray-400">/ шт</span>
            </div>
            {quantity > 1 && (
              <p className="text-sm text-[#0088CC] font-semibold mt-0.5">{formatPrice(currentPrice * quantity)} за {quantity} шт</p>
            )}
          </div>

          {/* Pricing tiers */}
          {product.pricing_tiers.length > 0 && (
            <div className="mb-6">
              <PricingTiers tiers={product.pricing_tiers} quantity={quantity} />
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.status === 'out_of_stock'}
              className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
              {adding ? 'Добавляю...' : product.status === 'out_of_stock' ? 'Нет в наличии' : 'В корзину'}
            </button>
          </div>

          {/* Telegram buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <a
              href={product.telegram_post_url || 'https://t.me/horizmo'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#0088CC] bg-[#0088CC]/8 rounded-xl hover:bg-[#0088CC]/15 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Смотреть в Telegram
            </a>
            <a
              href={`https://t.me/horizmo?text=${encodeURIComponent(`Хочу заказать: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-[#0088CC] rounded-xl hover:bg-[#0077BB] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Написать менеджеру
            </a>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Описание</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Похожие товары</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              onClick={() => setLightbox(false)}
            >
              ✕
            </button>
            <div className="relative max-w-2xl w-full max-h-[80vh] aspect-square">
              <Image
                src={images[activeImg]?.url}
                alt={images[activeImg]?.alt || product.name}
                fill
                className="object-contain"
                sizes="800px"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-30">
        <div>
          <p className="text-xs text-gray-400">Цена</p>
          <p className="text-sm font-bold text-gray-900">{formatPrice(currentPrice)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding || product.status === 'out_of_stock'}
          className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          В корзину
        </button>
      </div>
    </div>
  );
}
