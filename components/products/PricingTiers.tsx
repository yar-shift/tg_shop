'use client';

import React from 'react';
import type { PricingTier } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { getPriceForQuantity as getPrice } from '@/lib/cart-context';

interface PricingTiersProps {
  tiers: PricingTier[];
  quantity?: number;
  compact?: boolean;
}

export default function PricingTiers({ tiers, quantity = 1, compact = false }: PricingTiersProps) {
  if (!tiers.length) return null;

  const sorted = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  const activePrice = getPrice(tiers, quantity);

  if (compact) {
    return (
      <div className="flex flex-col gap-0.5">
        {sorted.map(tier => {
          const isActive = activePrice === tier.price_rub && quantity >= tier.min_quantity;
          return (
            <div
              key={tier.id}
              className={cn(
                'flex items-center justify-between text-xs px-2 py-1 rounded-lg transition-all',
                isActive ? 'bg-[#0088CC]/10 text-[#0088CC] font-semibold' : 'text-gray-500'
              )}
            >
              <span>
                {tier.min_quantity}
                {tier.max_quantity ? `–${tier.max_quantity}` : '+'} шт
              </span>
              <span>{formatPrice(tier.price_rub)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Оптовые цены</span>
      </div>
      <div className="divide-y divide-gray-50">
        {sorted.map((tier, i) => {
          const isActive = getPrice(sorted, quantity) === tier.price_rub;
          return (
            <div
              key={tier.id}
              className={cn(
                'flex items-center justify-between px-4 py-3 transition-all duration-200',
                isActive ? 'bg-[#0088CC]/5' : 'bg-white hover:bg-gray-50/50'
              )}
            >
              <div className="flex items-center gap-2">
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0088CC]" />
                )}
                {!isActive && <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
                <span className={cn('text-sm', isActive ? 'text-gray-900 font-medium' : 'text-gray-500')}>
                  {tier.min_quantity}
                  {tier.max_quantity ? `–${tier.max_quantity}` : '+'} шт
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-semibold', isActive ? 'text-[#0088CC]' : 'text-gray-700')}>
                  {formatPrice(tier.price_rub)}
                </span>
                {i > 0 && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                    -{Math.round((1 - tier.price_rub / sorted[0].price_rub) * 100)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
