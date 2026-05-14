import React, { Suspense } from 'react';
import CatalogClient from '@/components/catalog/CatalogClient';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data as Category[]) ?? [];
}

async function CatalogPageInner() {
  const categories = await getCategories();
  return <CatalogClient categories={categories} />;
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 bg-gray-100 rounded-xl w-48 mb-6 animate-pulse" />
          <ProductGridSkeleton count={12} />
        </div>
      }
    >
      <CatalogPageInner />
    </Suspense>
  );
}
