-- ==============================================
-- تطوير قاعدة البيانات School2Career
-- إضافة الجداول والأعمدة الجديدة
-- ==============================================

DO $$
BEGIN
    -- إنشاء جدول البلدان
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'countries') THEN
        CREATE TABLE countries (
            code VARCHAR(3) PRIMARY KEY,
            name_ar VARCHAR(100) NOT NULL,
            name_en VARCHAR(100) NOT NULL,
            name_fr VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'تم إنشاء جدول countries';
    ELSE
        RAISE NOTICE 'جدول countries موجود بالفعل';
    END IF;

    -- إنشاء جدول المحافظات
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'governorates') THEN
        CREATE TABLE governorates (
            code VARCHAR(10) PRIMARY KEY,
            country_code VARCHAR(3) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
            name_ar VARCHAR(100) NOT NULL,
            name_en VARCHAR(100) NOT NULL, 
            name_fr VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'تم إنشاء جدول governorates';
    ELSE
        RAISE NOTICE 'جدول governorates موجود بالفعل';
    END IF;

    -- إنشاء جدول المراحل التعليمية
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'education_levels') THEN
        CREATE TABLE education_levels (
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
        
        RAISE NOTICE 'تم إنشاء جدول education_levels';
    ELSE
        RAISE NOTICE 'جدول education_levels موجود بالفعل';
    END IF;

    -- إنشاء جدول الصفوف الدراسية
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'education_grades') THEN
        CREATE TABLE education_grades (
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
        
        RAISE NOTICE 'تم إنشاء جدول education_grades';
    ELSE
        RAISE NOTICE 'جدول education_grades موجود بالفعل';
    END IF;

END $$;

-- إضافة الأعمدة الجديدة لجدول user_profiles
DO $$
BEGIN
    -- إضافة الأعمدة الجديدة إذا لم تكن موجودة
    
    -- بيانات شخصية
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'birth_date') THEN
        ALTER TABLE user_profiles ADD COLUMN birth_date DATE;
        RAISE NOTICE 'تم إضافة عمود birth_date';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'phone') THEN
        ALTER TABLE user_profiles ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'تم إضافة عمود phone';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'gender') THEN
        ALTER TABLE user_profiles ADD COLUMN gender VARCHAR(10);
        RAISE NOTICE 'تم إضافة عمود gender';
    END IF;

    -- بيانات جغرافية
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country_code') THEN
        ALTER TABLE user_profiles ADD COLUMN country_code VARCHAR(3);
        RAISE NOTICE 'تم إضافة عمود country_code';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country_name') THEN
        ALTER TABLE user_profiles ADD COLUMN country_name VARCHAR(100);
        RAISE NOTICE 'تم إضافة عمود country_name';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'governorate_code') THEN
        ALTER TABLE user_profiles ADD COLUMN governorate_code VARCHAR(10);
        RAISE NOTICE 'تم إضافة عمود governorate_code';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'governorate_name') THEN
        ALTER TABLE user_profiles ADD COLUMN governorate_name VARCHAR(100);
        RAISE NOTICE 'تم إضافة عمود governorate_name';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'city') THEN
        ALTER TABLE user_profiles ADD COLUMN city VARCHAR(100);
        RAISE NOTICE 'تم إضافة عمود city';
    END IF;

    -- بيانات تعليمية
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'education_level_code') THEN
        ALTER TABLE user_profiles ADD COLUMN education_level_code VARCHAR(20);
        RAISE NOTICE 'تم إضافة عمود education_level_code';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'education_level_name') THEN
        ALTER TABLE user_profiles ADD COLUMN education_level_name VARCHAR(100);
        RAISE NOTICE 'تم إضافة عمود education_level_name';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'current_grade_code') THEN
        ALTER TABLE user_profiles ADD COLUMN current_grade_code VARCHAR(10);
        RAISE NOTICE 'تم إضافة عمود current_grade_code';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'current_grade_name') THEN
        ALTER TABLE user_profiles ADD COLUMN current_grade_name VARCHAR(100);
        RAISE NOTICE 'تم إضافة عمود current_grade_name';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'school_name') THEN
        ALTER TABLE user_profiles ADD COLUMN school_name VARCHAR(200);
        RAISE NOTICE 'تم إضافة عمود school_name';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'specialization') THEN
        ALTER TABLE user_profiles ADD COLUMN specialization VARCHAR(200);
        RAISE NOTICE 'تم إضافة عمود specialization';
    END IF;

    -- بيانات إضافية
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
        ALTER TABLE user_profiles ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'ar';
        RAISE NOTICE 'تم إضافة عمود preferred_language';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'registration_date') THEN
        ALTER TABLE user_profiles ADD COLUMN registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'تم إضافة عمود registration_date';
    END IF;

    -- إضافة Foreign Keys إذا لم تكن موجودة
    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'user_profiles' AND constraint_name = 'fk_user_profiles_country') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_country 
        FOREIGN KEY (country_code) REFERENCES countries(code);
        RAISE NOTICE 'تم إضافة foreign key للبلد';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'user_profiles' AND constraint_name = 'fk_user_profiles_governorate') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_governorate 
        FOREIGN KEY (governorate_code) REFERENCES governorates(code);
        RAISE NOTICE 'تم إضافة foreign key للمحافظة';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'user_profiles' AND constraint_name = 'fk_user_profiles_education_level') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_education_level 
        FOREIGN KEY (education_level_code) REFERENCES education_levels(code);
        RAISE NOTICE 'تم إضافة foreign key للمرحلة التعليمية';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'user_profiles' AND constraint_name = 'fk_user_profiles_grade') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_grade 
        FOREIGN KEY (current_grade_code) REFERENCES education_grades(code);
        RAISE NOTICE 'تم إضافة foreign key للصف';
    END IF;

END $$;