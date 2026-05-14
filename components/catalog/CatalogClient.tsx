'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Category, ProductWithDetails } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';

interface CatalogClientProps {
  categories: Category[];
}

const STATUS_FILTERS = [
  { value: '', label: 'Все статусы' },
  { value: 'active', label: 'В наличии' },
  { value: 'pre_order', label: 'Под заказ' },
  { value: 'coming_soon', label: 'Скоро' },
];

const SORT_OPTIONS = [
  { value: 'sort_order', label: 'По умолчанию' },
  { value: 'created_at_desc', label: 'Новинки' },
  { value: 'name', label: 'По названию' },
];

export default function CatalogClient({ categories }: CatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? '');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('sort_order');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;

  const fetchProducts = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    const currentPage = reset ? 0 : page;

    let query = supabase
      .from('products')
      .select(`*, images:product_images(*), pricing_tiers:product_pricing_tiers(*)`)
      .neq('status', 'archived')
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`);
    if (activeCategory) {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (statusFilter) query = query.eq('status', statusFilter);

    if (sort === 'created_at_desc') query = query.order('created_at', { ascending: false });
    else if (sort === 'name') query = query.order('name', { ascending: true });
    else query = query.order('sort_order', { ascending: true });

    const { data } = await query;
    const items = (data as ProductWithDetails[]) ?? [];

    if (reset) {
      setProducts(items);
      setPage(0);
    } else {
      setProducts(prev => [...prev, ...items]);
    }
    setHasMore(items.length === PAGE_SIZE);
    setLoading(false);
  }, [search, activeCategory, statusFilter, sort, page, categories]);

  useEffect(() => {
    fetchProducts(true);
  }, [search, activeCategory, statusFilter, sort]);

  const loadMore = () => {
    setPage(p => p + 1);
    fetchProducts(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Каталог</h1>
        <p className="text-sm text-gray-400 mt-1">
          {loading ? 'Загрузка...' : `${products.length} товаров`}
        </p>
      </div>

      {/* Search + Filters bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по каталогу..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0088CC] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Фильтры</span>
        </button>
      </div>

      {/* Categories scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('')}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeCategory === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug === activeCategory ? '' : cat.slug)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === cat.slug ? 'bg-[#0088CC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Expandable filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Статус</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_FILTERS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                        statusFilter === f.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Сортировка</p>
                <div className="flex flex-wrap gap-1.5">
                  {SORT_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSort(s.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                        sort === s.value ? 'bg-[#0088CC] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products grid */}
      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : products.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Search className="w-7 h-7 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Товары не найдены</p>
            <p className="text-xs text-gray-400 mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
          <button
            onClick={() => { setSearch(''); setActiveCategory(''); setStatusFilter(''); }}
            className="text-xs font-semibold text-[#0088CC] hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Загрузить ещё
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
