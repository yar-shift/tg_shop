'use client';

import React, { useState } from 'react';
import { CartProvider } from '@/lib/cart-context';
import Header from './Header';
import MobileNav from './MobileNav';
import CartDrawer from '@/components/shared/CartDrawer';
import SearchOverlay from '@/components/shared/SearchOverlay';
import TelegramWidget from '@/components/shared/TelegramWidget';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <CartProvider>
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <main className="min-h-screen pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <TelegramWidget />
    </CartProvider>
  );
}
