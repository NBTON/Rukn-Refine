-- إنشاء جدول رواد الأعمال
CREATE TABLE entrepreneurs (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  avatar_url TEXT,
  location GEOGRAPHY(Point,4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now())
);

-- إنشاء جدول المالكين
CREATE TABLE owners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  avatar_url TEXT,
  location GEOGRAPHY(Point,4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now())
);

-- إنشاء جدول المحلات
CREATE TABLE shops (
  shop_id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  renter_id BIGINT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  district TEXT,
  street TEXT,
  area_m2 INTEGER,
  url TEXT,
  location GEOGRAPHY(Point,4326),
  description TEXT,
  age_years INTEGER,
  building_number INTEGER,
  zip_code INTEGER,
  additional_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now())
);

-- إنشاء جدول الصور
CREATE TABLE images (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  url TEXT NOT NULL
);

-- إنشاء جدول الفيديوهات
CREATE TABLE videos (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  url TEXT NOT NULL
);

-- إنشاء جدول الميزات
CREATE TABLE features (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  feature TEXT NOT NULL
);

-- إنشاء جدول المفضلة
CREATE TABLE favorites (
  entrepreneur_id BIGINT NOT NULL,
  shop_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now()),
  PRIMARY KEY (entrepreneur_id, shop_id)
);

-- إنشاء جدول المحادثات
CREATE TABLE chats (
  entrepreneur_id BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now()),
  PRIMARY KEY (entrepreneur_id, owner_id)
);

-- إنشاء جدول الأفكار
CREATE TABLE ideas (
  id BIGSERIAL PRIMARY KEY,
  entrepreneur_id BIGINT NOT NULL,
  idea_name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'retail', 'office', 'service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now())
);

-- إنشاء جدول درجات الذكاء الاصطناعي
CREATE TABLE ai_scores (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL,
  score NUMERIC,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT (now())
);

-- إنشاء الفهارس (Indexes)
CREATE INDEX shops_location_gix ON shops (location) USING GIST;
CREATE INDEX idx_shops_owner_id ON shops (owner_id);
CREATE INDEX idx_shops_renter_id ON shops (renter_id);
CREATE INDEX idx_images_shop_id ON images (shop_id);
CREATE INDEX idx_videos_shop_id ON videos (shop_id);
CREATE INDEX idx_features_shop_id ON features (shop_id);
CREATE INDEX idx_fav_shop_id ON favorites (shop_id);
CREATE INDEX idx_fav_entre_id ON favorites (entrepreneur_id);

-- إنشاء العلاقات (Foreign Keys)
ALTER TABLE shops ADD FOREIGN KEY (owner_id) REFERENCES owners (id) ON DELETE CASCADE;
ALTER TABLE shops ADD FOREIGN KEY (renter_id) REFERENCES entrepreneurs (id);
ALTER TABLE images ADD FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE;
ALTER TABLE videos ADD FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE;
ALTER TABLE features ADD FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE;
ALTER TABLE favorites ADD FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs (id) ON DELETE CASCADE;
ALTER TABLE favorites ADD FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE;
ALTER TABLE chats ADD FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs (id) ON DELETE CASCADE;
ALTER TABLE chats ADD FOREIGN KEY (owner_id) REFERENCES owners (id) ON DELETE CASCADE;
ALTER TABLE ideas ADD FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs (id) ON DELETE CASCADE;
ALTER TABLE ai_scores ADD FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE;

-- إنشاء جدول رموز التحقق أيضًا
CREATE TABLE IF NOT EXISTS verification_codes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
