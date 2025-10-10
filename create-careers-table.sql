-- إنشاء جدول الوظائف المحددة
CREATE TABLE IF NOT EXISTS riasec_careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- معلومات الوظيفة الأساسية
  career_title_ar TEXT NOT NULL,
  career_title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  
  -- ربط مع Holland Code
  holland_code TEXT NOT NULL,
  primary_type CHAR(1) NOT NULL, -- R, I, A, S, E, C
  match_percentage INTEGER DEFAULT 85,
  
  -- المنطقة الجغرافية
  region TEXT NOT NULL, -- Egypt, GCC, USA
  
  -- التفاصيل المهنية
  education_level_ar TEXT,
  education_level_en TEXT,
  
  -- الرواتب (بالعملة المحلية)
  salary_range_entry TEXT, -- 0-2 سنة
  salary_range_mid TEXT,   -- 3-7 سنوات
  salary_range_senior TEXT, -- 8-15 سنة
  salary_range_expert TEXT, -- 15+ سنة
  currency TEXT DEFAULT 'EGP',
  
  -- المهارات المطلوبة
  skills_ar TEXT[], -- array of skills
  skills_en TEXT[],
  
  -- الصناعات
  industries_ar TEXT[],
  industries_en TEXT[],
  
  -- بيئة العمل
  work_environment_ar TEXT,
  work_environment_en TEXT,
  
  -- التوقعات المستقبلية
  job_outlook_ar TEXT,
  job_outlook_en TEXT,
  growth_rate TEXT,
  
  -- روابط خارجية
  linkedin_jobs_count INTEGER DEFAULT 0,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_careers_holland_code ON riasec_careers(holland_code);
CREATE INDEX IF NOT EXISTS idx_careers_primary_type ON riasec_careers(primary_type);
CREATE INDEX IF NOT EXISTS idx_careers_region ON riasec_careers(region);
CREATE INDEX IF NOT EXISTS idx_careers_match ON riasec_careers(match_percentage DESC);

-- Enable Row Level Security
ALTER TABLE riasec_careers ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة العامة
CREATE POLICY "Allow public read access" ON riasec_careers
  FOR SELECT USING (true);

COMMENT ON TABLE riasec_careers IS 'جدول الوظائف المحددة مع تفاصيل كاملة لكل وظيفة';
