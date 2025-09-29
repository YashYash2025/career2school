-- إنشاء الجداول الأساسية لقاعدة البيانات
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
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
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
  code VARCHAR(10) PRIMARY KEY,
  education_level_code VARCHAR(20) NOT NULL REFERENCES education_levels(code) ON DELETE CASCADE,
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
ADD COLUMN IF NOT EXISTS current_grade_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS current_grade_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS school_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS specialization VARCHAR(200),
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'ar',
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. إضافة Foreign Keys (مع التحقق من عدم وجودها)
DO $$
BEGIN
    -- إضافة foreign key للبلد
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_name = 'fk_user_profiles_country'
    ) THEN
        ALTER TABLE user_profiles 
        ADD CONSTRAINT fk_user_profiles_country 
        FOREIGN KEY (country_code) REFERENCES countries(code);
    END IF;
    
    -- إضافة foreign key للمحافظة
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_name = 'fk_user_profiles_governorate'
    ) THEN
        ALTER TABLE user_profiles 
        ADD CONSTRAINT fk_user_profiles_governorate 
        FOREIGN KEY (governorate_code) REFERENCES governorates(code);
    END IF;
    
    -- إضافة foreign key للمرحلة التعليمية
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_name = 'fk_user_profiles_education_level'
    ) THEN
        ALTER TABLE user_profiles 
        ADD CONSTRAINT fk_user_profiles_education_level 
        FOREIGN KEY (education_level_code) REFERENCES education_levels(code);
    END IF;
    
    -- إضافة foreign key للصف
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_name = 'fk_user_profiles_grade'
    ) THEN
        ALTER TABLE user_profiles 
        ADD CONSTRAINT fk_user_profiles_grade 
        FOREIGN KEY (current_grade_code) REFERENCES education_grades(code);
    END IF;
END $$;