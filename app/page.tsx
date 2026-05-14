import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import TelegramSection from '@/components/landing/TelegramSection';
import CTASection from '@/components/landing/CTASection';
import { supabase } from '@/lib/supabase';
import type { ProductWithDetails, Category } from '@/lib/supabase';

async function getHomeData() {
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select(`*, images:product_images(*), pricing_tiers:product_pricing_tiers(*)`)
      .eq('is_featured', true)
      .neq('status', 'archived')
      .order('sort_order', { ascending: true })
      .limit(8),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ]);

  return {
    products: (productsRes.data as ProductWithDetails[]) ?? [],
    categories: (categoriesRes.data as Category[]) ?? [],
  };
}

export default async function HomePage() {
  const { products, categories } = await getHomeData();

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <BenefitsSection />
      <FeaturedProducts products={products} />
      <HowItWorksSection />
      <TelegramSection />
      <CTASection />
    </div>
  );
}
