# Database Setup Instructions for School2Career Platform

## 🗃️ Database Structure Status Report

### ✅ What's Working
- **user_profiles table**: Exists and accessible
- **assessment_results table**: Exists and accessible
- **Supabase Connection**: Successfully connected

### ⚠️ What Needs Manual Setup

#### 1. Missing Tables (Need Admin/SQL Editor Access)
The following tables need to be created via Supabase SQL Editor:

**Execute this SQL in Supabase Dashboard > SQL Editor:**

```sql
-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
    code VARCHAR(3) PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Governorates Table
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

-- Education Levels Table
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

-- Education Grades Table
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
```

#### 2. Add New Columns to user_profiles
```sql
-- Add new columns to user_profiles table
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

-- Add Foreign Key Constraints (after tables are created)
ALTER TABLE user_profiles 
ADD CONSTRAINT IF NOT EXISTS fk_user_profiles_country 
FOREIGN KEY (country_code) REFERENCES countries(code);

ALTER TABLE user_profiles 
ADD CONSTRAINT IF NOT EXISTS fk_user_profiles_governorate 
FOREIGN KEY (governorate_code) REFERENCES governorates(code);

ALTER TABLE user_profiles 
ADD CONSTRAINT IF NOT EXISTS fk_user_profiles_education_level 
FOREIGN KEY (education_level_code) REFERENCES education_levels(code);

ALTER TABLE user_profiles 
ADD CONSTRAINT IF NOT EXISTS fk_user_profiles_grade 
FOREIGN KEY (current_grade_code) REFERENCES education_grades(code);
```

#### 3. Insert Seed Data
After creating the tables, insert the seed data by running `database-seed-data.sql` in Supabase SQL Editor.

### 🔧 Alternative Approach (Current Implementation)
Since we can't create tables with anon key, I'm implementing the registration system to work with the existing `user_profiles` table structure, and using hardcoded reference data for countries/governorates until the new tables are created.

### 📊 Current Database Schema Analysis
```javascript
// Existing accessible tables:
✅ user_profiles - Empty but accessible
✅ assessment_results - Empty but accessible
❌ questions - Not found in schema cache
❌ countries - Needs to be created
❌ governorates - Needs to be created  
❌ education_levels - Needs to be created
❌ education_grades - Needs to be created
```

### 🎯 Next Steps
1. ✅ Database migration scripts created
2. ⚠️ Manual SQL execution required in Supabase Dashboard
3. 🔄 Create API endpoints that work with current structure
4. 🔗 Connect registration form to database
5. ✅ Test registration flow

### 🛠️ Files Created
- `database-structure-update.sql` - Complete table creation script
- `database-seed-data.sql` - Seed data for all reference tables  
- `execute-db-migration.js` - Migration verification script
- `check-db-tables.js` - Database status checker

---
**تعليمات بالعربية:**
يحتاج تنفيذ الـ SQL المذكور في Supabase Dashboard > SQL Editor لإنشاء الجداول المطلوبة، ثم يمكن ربط نموذج التسجيل بقاعدة البيانات الفعلية.