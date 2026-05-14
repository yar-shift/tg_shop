
/*
  # TG Shop Next - Initial Schema

  ## Tables
  - `categories` - product categories
  - `products` - product catalog with pricing tiers
  - `product_images` - multiple images per product
  - `orders` - customer order requests
  - `order_items` - items in each order

  ## Security
  - RLS enabled on all tables
  - Public read on categories/products/product_images
  - Authenticated insert on orders
  - No public write on products
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  image_url text DEFAULT '',
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  sku text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'pre_order', 'coming_soon', 'archived')),
  stock_quantity int DEFAULT 0,
  telegram_post_url text DEFAULT '',
  telegram_message_id text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status != 'archived');

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text DEFAULT '',
  is_primary boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (true);

-- Product Pricing Tiers
CREATE TABLE IF NOT EXISTS product_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity int NOT NULL DEFAULT 1,
  max_quantity int,
  price_rub numeric(10,2) NOT NULL,
  sort_order int DEFAULT 0
);

ALTER TABLE product_pricing_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing tiers"
  ON product_pricing_tiers FOR SELECT
  USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_telegram text DEFAULT '',
  customer_phone text DEFAULT '',
  contact_method text DEFAULT 'telegram' CHECK (contact_method IN ('telegram', 'phone', 'whatsapp')),
  comment text DEFAULT '',
  total_amount numeric(12,2) DEFAULT 0,
  status text DEFAULT 'new' CHECK (status IN ('new', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Seed categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Смартфоны', 'smartphones', 'Актуальные модели смартфонов оптом', 'smartphone', 1),
  ('Наушники', 'headphones', 'Проводные и беспроводные наушники', 'headphones', 2),
  ('Аксессуары', 'accessories', 'Чехлы, кабели, защитные стекла', 'package', 3),
  ('Умные часы', 'smartwatches', 'Смарт-часы и фитнес-браслеты', 'watch', 4),
  ('Зарядные устройства', 'chargers', 'Быстрые зарядки, PowerBank', 'zap', 5),
  ('Планшеты', 'tablets', 'Планшеты и аксессуары для них', 'tablet', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO products (category_id, name, slug, short_description, description, sku, status, stock_quantity, is_featured, is_new) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'smartphones'),
    'Samsung Galaxy A55 5G',
    'samsung-galaxy-a55-5g',
    'Флагманский среднеклассник с 5G',
    'Samsung Galaxy A55 5G — мощный смартфон с AMOLED-дисплеем 6.6", процессором Exynos 1480, камерой 50 Мп и аккумулятором 5000 мАч. Идеален для оптовых поставок.',
    'SAM-A55-5G',
    'active',
    150,
    true,
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'headphones'),
    'AirPods Pro 2 (реплика AAA)',
    'airpods-pro-2-replica',
    'Активное шумоподавление, чип H2',
    'Качественная реплика AirPods Pro 2 с активным шумоподавлением, автономностью до 30 часов (с кейсом) и совместимостью со всеми устройствами Apple и Android.',
    'APP-PRO2-AAA',
    'active',
    320,
    true,
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'smartwatches'),
    'Apple Watch Ultra 2 (реплика)',
    'apple-watch-ultra-2-replica',
    'Титановый корпус, спортивные режимы',
    'Реплика Apple Watch Ultra 2 класса AAA. Титановый дизайн, AMOLED-дисплей 49мм, 100+ режимов тренировок, NFC, GPS.',
    'AW-ULTRA2-REP',
    'active',
    85,
    true,
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'accessories'),
    'Набор чехлов iPhone 15 Pro',
    'iphone-15-pro-cases-pack',
    'Оптовая упаковка 50шт ассорти',
    'Набор из 50 чехлов для iPhone 15 Pro — ассорти цветов и материалов (матовый, прозрачный, кожа). Минимальная партия от 50 штук.',
    'ACC-I15P-CASE50',
    'active',
    500,
    false,
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'chargers'),
    'GaN Charger 65W USB-C',
    'gan-charger-65w',
    'Компактная зарядка для ноутбуков и телефонов',
    'GaN-зарядное устройство 65W с 2xUSB-C и 1xUSB-A. Подходит для MacBook, iPad, смартфонов. Сертификат CE/RoHS.',
    'CHG-GAN65W',
    'active',
    200,
    false,
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'smartphones'),
    'Xiaomi Redmi Note 13 Pro',
    'xiaomi-redmi-note-13-pro',
    '200Мп камера, AMOLED 120Гц',
    'Xiaomi Redmi Note 13 Pro с основной камерой 200 Мп, AMOLED 120 Гц, Snapdragon 7s Gen 2 и зарядкой 67W.',
    'XIA-RN13P',
    'active',
    230,
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- Seed pricing tiers
INSERT INTO product_pricing_tiers (product_id, min_quantity, max_quantity, price_rub, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'samsung-galaxy-a55-5g'), 1, 9, 18900, 1),
  ((SELECT id FROM products WHERE slug = 'samsung-galaxy-a55-5g'), 10, 49, 17500, 2),
  ((SELECT id FROM products WHERE slug = 'samsung-galaxy-a55-5g'), 50, NULL, 16200, 3),
  ((SELECT id FROM products WHERE slug = 'airpods-pro-2-replica'), 1, 9, 2100, 1),
  ((SELECT id FROM products WHERE slug = 'airpods-pro-2-replica'), 10, 49, 1850, 2),
  ((SELECT id FROM products WHERE slug = 'airpods-pro-2-replica'), 50, NULL, 1600, 3),
  ((SELECT id FROM products WHERE slug = 'apple-watch-ultra-2-replica'), 1, 9, 4800, 1),
  ((SELECT id FROM products WHERE slug = 'apple-watch-ultra-2-replica'), 10, 49, 4300, 2),
  ((SELECT id FROM products WHERE slug = 'apple-watch-ultra-2-replica'), 50, NULL, 3900, 3),
  ((SELECT id FROM products WHERE slug = 'iphone-15-pro-cases-pack'), 50, 199, 380, 1),
  ((SELECT id FROM products WHERE slug = 'iphone-15-pro-cases-pack'), 200, 499, 320, 2),
  ((SELECT id FROM products WHERE slug = 'iphone-15-pro-cases-pack'), 500, NULL, 270, 3),
  ((SELECT id FROM products WHERE slug = 'gan-charger-65w'), 1, 9, 1200, 1),
  ((SELECT id FROM products WHERE slug = 'gan-charger-65w'), 10, 49, 1050, 2),
  ((SELECT id FROM products WHERE slug = 'gan-charger-65w'), 50, NULL, 920, 3),
  ((SELECT id FROM products WHERE slug = 'xiaomi-redmi-note-13-pro'), 1, 9, 16500, 1),
  ((SELECT id FROM products WHERE slug = 'xiaomi-redmi-note-13-pro'), 10, 49, 15200, 2),
  ((SELECT id FROM products WHERE slug = 'xiaomi-redmi-note-13-pro'), 50, NULL, 14100, 3);

-- Seed product images (using Pexels)
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'samsung-galaxy-a55-5g'), 'https://images.pexels.com/photos/13915165/pexels-photo-13915165.jpeg', 'Samsung Galaxy A55', true, 1),
  ((SELECT id FROM products WHERE slug = 'samsung-galaxy-a55-5g'), 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 'Samsung Galaxy A55 back', false, 2),
  ((SELECT id FROM products WHERE slug = 'airpods-pro-2-replica'), 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', 'AirPods Pro', true, 1),
  ((SELECT id FROM products WHERE slug = 'airpods-pro-2-replica'), 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg', 'AirPods Pro case', false, 2),
  ((SELECT id FROM products WHERE slug = 'apple-watch-ultra-2-replica'), 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 'Apple Watch Ultra', true, 1),
  ((SELECT id FROM products WHERE slug = 'apple-watch-ultra-2-replica'), 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg', 'Smartwatch side', false, 2),
  ((SELECT id FROM products WHERE slug = 'iphone-15-pro-cases-pack'), 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg', 'Phone cases', true, 1),
  ((SELECT id FROM products WHERE slug = 'gan-charger-65w'), 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg', 'GaN Charger', true, 1),
  ((SELECT id FROM products WHERE slug = 'gan-charger-65w'), 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg', 'USB-C charger', false, 2),
  ((SELECT id FROM products WHERE slug = 'xiaomi-redmi-note-13-pro'), 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', 'Xiaomi phone', true, 1),
  ((SELECT id FROM products WHERE slug = 'xiaomi-redmi-note-13-pro'), 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg', 'Smartphone camera', false, 2);
