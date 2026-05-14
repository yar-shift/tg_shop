'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';

interface FeaturedProductsProps {
  products: ProductWithDetails[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Популярные товары</h2>
            <p className="text-sm text-gray-400 mt-1">Хиты продаж этой недели</p>
          </div>
          <Link href="/catalog" className="flex items-center gap-1 text-sm font-semibold text-[#0088CC] hover:underline">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
