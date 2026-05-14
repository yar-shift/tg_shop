import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { ProductWithDetails } from '@/lib/supabase';
import ProductPageClient from '@/components/catalog/ProductPageClient';

async function getProduct(slug: string): Promise<ProductWithDetails | null> {
  const { data } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*), pricing_tiers:product_pricing_tiers(*)`)
    .eq('slug', slug)
    .neq('status', 'archived')
    .maybeSingle();
  return data as ProductWithDetails | null;
}

async function getRelated(product: ProductWithDetails): Promise<ProductWithDetails[]> {
  if (!product.category_id) return [];
  const { data } = await supabase
    .from('products')
    .select(`*, images:product_images(*), pricing_tiers:product_pricing_tiers(*)`)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .neq('status', 'archived')
    .limit(4);
  return (data as ProductWithDetails[]) ?? [];
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelated(product);

  return <ProductPageClient product={product} related={related} />;
}
