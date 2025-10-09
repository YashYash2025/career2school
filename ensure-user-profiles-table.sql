-- ============================================================
-- التأكد من وجود جدول user_profiles
-- ============================================================

-- إنشاء الجدول إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- الاسم
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200),
  
  -- معلومات الاتصال
  phone VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  
  -- الموقع الجغرافي
  country_code VARCHAR(3),
  governorate_code VARCHAR(10),
  city VARCHAR(100),
  
  -- المعلومات التعليمية
  education_level_code VARCHAR(20),
  current_grade_code VARCHAR(10),
  school_name VARCHAR(200),
  specialization VARCHAR(200),
  
  -- الإعدادات
  preferred_language VARCHAR(5) DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en', 'fr')),
  user_type VARCHAR(20) DEFAULT 'student' CHECK (user_type IN (
    'student',      -- طالب مدرسة/جامعة
    'graduate',     -- خريج حديث
    'professional', -- خريج ذو خبرة
    'teacher',      -- معلم
    'parent',       -- ولي أمر
    'counselor',    -- مستشار
    'admin'         -- مدير
  )),
  
  -- الملف الشخصي
  profile_image_url TEXT,
  bio TEXT,
  
  -- الحالة
  is_active BOOLEAN DEFAULT true,
  
  -- التوقيت
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger لتحديث full_name تلقائياً
CREATE OR REPLACE FUNCTION update_full_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name := NEW.first_name || ' ' || NEW.last_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_full_name ON user_profiles;
CREATE TRIGGER trigger_update_full_name
BEFORE INSERT OR UPDATE OF first_name, last_name ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_full_name();

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- تم التأكد من جدول user_profiles
-- ============================================================
