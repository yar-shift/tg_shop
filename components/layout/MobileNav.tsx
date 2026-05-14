'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chrome as Home, Grid3x3 as Grid3X3, ShoppingCart, Search, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  onSearchOpen: () => void;
}

export default function MobileNav({ onSearchOpen }: MobileNavProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const items = [
    { icon: Home, label: 'Главная', href: '/' },
    { icon: Grid3X3, label: 'Каталог', href: '/catalog' },
    { icon: Search, label: 'Поиск', onClick: onSearchOpen },
    { icon: MessageCircle, label: 'Telegram', href: 'https://t.me/horizmo', external: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, href, onClick, external }) => {
          const isActive = href ? pathname === href : false;

          const content = (
            <div className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-[56px]',
              isActive ? 'text-[#0088CC]' : 'text-gray-400 hover:text-gray-600'
            )}>
              <div className="relative">
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn('text-[10px] font-medium', isActive ? 'text-[#0088CC]' : '')}>{label}</span>
            </div>
          );

          if (onClick) {
            return (
              <button key={label} onClick={onClick} className="focus:outline-none">
                {content}
              </button>
            );
          }

          if (external) {
            return (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          }

          return (
            <Link key={label} href={href!}>
              {content}
            </Link>
          );
        })}

        {/* Cart button */}
        <button onClick={openCart} className="focus:outline-none">
          <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-[56px] text-gray-400 hover:text-gray-600">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0088CC] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-medium">Корзина</span>
          </div>
        </button>
      </div>
    </div>
  );
}
