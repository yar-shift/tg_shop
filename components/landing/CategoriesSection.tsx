'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smartphone, Headphones, Package, Watch, Zap, Tablet, ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/supabase';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  headphones: Headphones,
  package: Package,
  watch: Watch,
  zap: Zap,
  tablet: Tablet,
};

const colorMap = [
  'bg-blue-50 text-blue-600',
  'bg-violet-50 text-violet-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-rose-50 text-rose-600',
  'bg-cyan-50 text-cyan-600',
];

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Категории</h2>
            <p className="text-sm text-gray-400 mt-1">Более 2000 товаров в наличии</p>
          </div>
          <Link href="/catalog" className="flex items-center gap-1 text-sm font-semibold text-[#0088CC] hover:underline">
            Все товары <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] ?? Package;
            const color = colorMap[i % colorMap.length];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
