import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
      };
      products: {
        Row: Product;
      };
      product_images: {
        Row: ProductImage;
      };
      product_pricing_tiers: {
        Row: PricingTier;
      };
      orders: {
        Row: Order;
      };
      order_items: {
        Row: OrderItem;
      };
    };
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  status: 'active' | 'out_of_stock' | 'pre_order' | 'coming_soon' | 'archived';
  stock_quantity: number;
  telegram_post_url: string;
  telegram_message_id: string;
  is_featured: boolean;
  is_new: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
};

export type PricingTier = {
  id: string;
  product_id: string;
  min_quantity: number;
  max_quantity: number | null;
  price_rub: number;
  sort_order: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_telegram: string;
  customer_phone: string;
  contact_method: 'telegram' | 'phone' | 'whatsapp';
  comment: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type ProductWithDetails = Product & {
  category?: Category;
  images: ProductImage[];
  pricing_tiers: PricingTier[];
};
