-- ============================================================
-- School2Career - Schema المحسّن
-- تاريخ: 2025
-- الإصدار: 2.0
-- ============================================================

-- ============================================================
-- المرحلة 1: حذف الجداول القديمة المتضاربة
-- ============================================================

-- حذف الجداول بالترتيب الصحيح (من الأطفال للآباء)
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS career_recommendations CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS user_assessments CASCADE;
DROP TABLE IF EXISTS assessment_progress CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS counselors CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- المرحلة 2: إنشاء الجداول المحسّنة
-- ============================================================

-- ------------------------------------------------------------
-- 1. جدول الملفات الشخصية (محسّن - دمج users + user_profiles)
-- ------------------------------------------------------------
CREATE TABLE user_profiles (
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
  country_code VARCHAR(3) REFERENCES countries(code),
  governorate_code VARCHAR(10) REFERENCES governorates(code),
  city VARCHAR(100),
  
  -- المعلومات التعليمية
  education_level_code VARCHAR(20) REFERENCES education_levels(code),
  current_grade_code VARCHAR(10) REFERENCES education_grades(code),
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

CREATE TRIGGER trigger_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 2. جدول الطلاب (بيانات إضافية للطلاب فقط)
-- ------------------------------------------------------------
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_level INTEGER CHECK (grade_level >= 7 AND grade_level <= 12),
  school_name VARCHAR(200),
  gpa NUMERIC CHECK (gpa >= 0 AND gpa <= 4),
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  city VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. جدول المستشارين (بيانات إضافية للمستشارين فقط)
-- ------------------------------------------------------------
CREATE TABLE counselors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  specialization VARCHAR(200),
  years_experience INTEGER,
  qualification VARCHAR(200),
  bio TEXT,
  hourly_rate NUMERIC,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. جدول رصيد المستخدمين (جديد)
-- ------------------------------------------------------------
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  current_balance INTEGER DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_user_credits_updated_at
BEFORE UPDATE ON user_credits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 5. جدول أسئلة التقييم
-- ------------------------------------------------------------
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES assessment_tools(id) ON DELETE CASCADE,
  
  -- السؤال بثلاث لغات
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_fr TEXT NOT NULL,
  
  -- نوع السؤال
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN (
    'likert_5',      -- مقياس ليكرت 5 نقاط
    'likert_7',      -- مقياس ليكرت 7 نقاط
    'yes_no',        -- نعم/لا
    'multiple_choice', -- اختيار متعدد
    'ranking',       -- ترتيب
    'text'          -- نص حر
  )),
  
  -- الخيارات (JSON)
  options JSONB,
  
  -- التصنيف
  dimension VARCHAR(100),
  subdimension VARCHAR(100),
  
  -- الوزن والترتيب
  weight NUMERIC DEFAULT 1.0,
  order_index INTEGER NOT NULL,
  is_reverse_scored BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 6. جدول جلسات التقييم (محسّن - دمج كل المميزات)
-- ------------------------------------------------------------
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES assessment_packages(id),
  tool_id UUID REFERENCES assessment_tools(id),
  
  -- نوع التقرير والدفع
  report_type VARCHAR(20) CHECK (report_type IN ('basic', 'advanced', 'premium')),
  credits_paid INTEGER NOT NULL DEFAULT 0,
  
  -- التوقيت
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- التقدم
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  
  -- الإجابات المحفوظة
  responses JSONB DEFAULT '{}'::jsonb,
  
  -- المساعدات (Powerups)
  hints_used INTEGER DEFAULT 0,
  skips_used INTEGER DEFAULT 0,
  fifty_fifty_used INTEGER DEFAULT 0,
  extra_time_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_assessment_sessions_updated_at
BEFORE UPDATE ON assessment_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 7. جدول إجابات المستخدمين
-- ------------------------------------------------------------
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES assessment_questions(id),
  
  -- الإجابة
  answer_value TEXT,
  answer_json JSONB,
  
  -- التقييم
  points_earned NUMERIC DEFAULT 0,
  is_correct BOOLEAN,
  
  -- الوقت
  time_spent_seconds INTEGER,
  
  -- العلامات
  is_flagged BOOLEAN DEFAULT false,
  
  answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 8. جدول نتائج التقييم
-- ------------------------------------------------------------
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES assessment_packages(id),
  tool_id UUID REFERENCES assessment_tools(id),
  
  -- الدرجات
  raw_score NUMERIC,
  percentage_score NUMERIC,
  percentile_rank INTEGER,
  detailed_scores JSONB NOT NULL,
  
  -- التقارير
  basic_report JSONB,
  advanced_report JSONB,
  premium_report JSONB,
  
  -- التوصيات
  career_recommendations TEXT[],
  study_recommendations TEXT[],
  skill_recommendations TEXT[],
  
  -- الملف الشخصي
  profile_type VARCHAR(100),
  profile_description TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  
  -- المشاركة
  share_token VARCHAR(100) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_assessment_results_updated_at
BEFORE UPDATE ON assessment_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 9. جدول التوصيات المهنية
-- ------------------------------------------------------------
CREATE TABLE career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_result_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  
  -- معلومات المهنة
  career_code TEXT NOT NULL,
  career_title TEXT NOT NULL,
  match_percentage INTEGER CHECK (match_percentage >= 0 AND match_percentage <= 100),
  
  -- المتطلبات
  education_requirements TEXT[],
  skills_required TEXT[],
  
  -- المسارات
  career_paths TEXT[],
  
  -- معلومات السوق
  salary_range TEXT,
  job_outlook TEXT,
  companies TEXT[],
  
  -- التوصية
  recommendation_reason TEXT,
  priority_rank INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 10. جدول المعاملات المالية
-- ------------------------------------------------------------
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- معلومات الدفع
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'EGP',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  payment_method TEXT,
  
  -- المنتج
  product_type TEXT,
  product_details JSONB,
  
  -- بيانات إضافية
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_payment_transactions_updated_at
BEFORE UPDATE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 11. جدول الاشتراكات
-- ------------------------------------------------------------
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  
  -- تفاصيل الاشتراك
  plan_name VARCHAR(100),
  credits_per_month INTEGER,
  price_per_month NUMERIC,
  
  -- الحالة
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'expired')),
  
  -- التواريخ
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  last_payment_date DATE,
  next_payment_date DATE
);

-- ------------------------------------------------------------
-- 12. جدول إنجازات المستخدمين
-- ------------------------------------------------------------
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, achievement_id)
);

-- ------------------------------------------------------------
-- 13. جدول تقدم الطلاب
-- ------------------------------------------------------------
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  milestone VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_date DATE,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- المرحلة 3: إنشاء الـ Indexes للأداء
-- ============================================================

-- Indexes لجدول user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_country ON user_profiles(country_code);
CREATE INDEX idx_user_profiles_education_level ON user_profiles(education_level_code);

-- Indexes لجدول assessment_sessions
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_package_id ON assessment_sessions(package_id);
CREATE INDEX idx_assessment_sessions_tool_id ON assessment_sessions(tool_id);
CREATE INDEX idx_assessment_sessions_completed ON assessment_sessions(is_completed);
CREATE INDEX idx_assessment_sessions_started_at ON assessment_sessions(started_at);

-- Indexes لجدول assessment_results
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX idx_assessment_results_created_at ON assessment_results(created_at);

-- Indexes لجدول user_answers
CREATE INDEX idx_user_answers_session_id ON user_answers(session_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- Indexes لجدول career_recommendations
CREATE INDEX idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX idx_career_recommendations_result_id ON career_recommendations(assessment_result_id);

-- Indexes لجدول payment_transactions
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);

-- Indexes لجدول user_credits
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);

-- ============================================================
-- المرحلة 4: إنشاء Views مفيدة
-- ============================================================

-- View لعرض ملخص المستخدم الكامل
CREATE OR REPLACE VIEW user_summary AS
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.full_name,
  up.user_type,
  up.education_level_code,
  up.country_code,
  up.preferred_language,
  uc.current_balance as credits_balance,
  COUNT(DISTINCT ases.id) as total_assessments,
  COUNT(DISTINCT ares.id) as completed_assessments,
  up.created_at
FROM user_profiles up
LEFT JOIN user_credits uc ON up.user_id = uc.user_id
LEFT JOIN assessment_sessions ases ON up.user_id = ases.user_id
LEFT JOIN assessment_results ares ON up.user_id = ares.user_id
GROUP BY up.id, up.user_id, up.email, up.full_name, up.user_type, 
         up.education_level_code, up.country_code, up.preferred_language,
         uc.current_balance, up.created_at;

-- ============================================================
-- تم الانتهاء من إنشاء Schema المحسّن
-- ============================================================
