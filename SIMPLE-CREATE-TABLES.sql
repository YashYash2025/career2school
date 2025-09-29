-- إنشاء الجداول الأساسية بدون Foreign Keys أولاً
-- نفذ هذا السكريبت في Supabase SQL Editor

-- 1. جدول البلدان
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(3) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول المحافظات
CREATE TABLE IF NOT EXISTS governorates (
  code VARCHAR(10) PRIMARY KEY,
  country_code VARCHAR(3) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL, 
  name_fr VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول المراحل التعليمية
CREATE TABLE IF NOT EXISTS education_levels (
  code VARCHAR(20) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول الصفوف الدراسية
CREATE TABLE IF NOT EXISTS education_grades (
  code VARCHAR(20) PRIMARY KEY,
  education_level_code VARCHAR(20) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. تحديث جدول user_profiles بإضافة الأعمدة الجديدة
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(3),
ADD COLUMN IF NOT EXISTS country_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS governorate_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS governorate_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS education_level_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS education_level_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS current_grade_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS current_grade_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS school_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS specialization VARCHAR(200),
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'ar',
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();