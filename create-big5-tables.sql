-- إنشاء جداول Big5

-- 1. جدول أسئلة College/FreshGrad (60 سؤال)
CREATE TABLE IF NOT EXISTS big5_60_college_freshgrad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- معلومات السؤال
  trait CHAR(1) NOT NULL, -- O, C, E, A, N
  question_id TEXT NOT NULL, -- A1, C5, etc.
  question_number INTEGER NOT NULL,
  
  -- نص السؤال
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  
  -- خصائص السؤال
  is_reverse BOOLEAN DEFAULT false,
  scale_min INTEGER DEFAULT 1,
  scale_max INTEGER DEFAULT 5,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(question_id)
);

-- 2. جدول أسئلة Middle School (60 سؤال)
CREATE TABLE IF NOT EXISTS big5_60_middle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- معلومات السؤال
  trait CHAR(1) NOT NULL,
  question_id TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  
  -- نص السؤال
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  
  -- خصائص السؤال
  is_reverse BOOLEAN DEFAULT false,
  scale_min INTEGER DEFAULT 1,
  scale_max INTEGER DEFAULT 5,
  
  -- Metadata
  age_group TEXT DEFAULT 'Gen Alpha (Middle)',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(question_id, age_group)
);

-- 3. جدول أسئلة High School (60 سؤال)
CREATE TABLE IF NOT EXISTS big5_60_high (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- معلومات السؤال
  trait CHAR(1) NOT NULL,
  question_id TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  
  -- نص السؤال
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  
  -- خصائص السؤال
  is_reverse BOOLEAN DEFAULT false,
  scale_min INTEGER DEFAULT 1,
  scale_max INTEGER DEFAULT 5,
  
  -- Metadata
  age_group TEXT DEFAULT 'Gen Z (High)',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(question_id, age_group)
);

-- 4. جدول المسارات المهنية
CREATE TABLE IF NOT EXISTS big5_career_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  track_name TEXT NOT NULL UNIQUE,
  description_en TEXT,
  description_ar TEXT,
  example_roles_en TEXT,
  example_roles_ar TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول قواعد الربط (Rules)
CREATE TABLE IF NOT EXISTS big5_matching_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- الشروط (مثل: O=High; C=High)
  condition TEXT NOT NULL,
  
  -- المسارات الموصى بها
  recommended_tracks TEXT[], -- array of track names
  alternate_tracks TEXT[],
  
  -- التفسير
  rationale_en TEXT,
  rationale_ar TEXT,
  
  -- الأولوية
  priority INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول نتائج Big5
CREATE TABLE IF NOT EXISTS big5_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ربط مع المستخدم
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- نوع التقييم
  assessment_type TEXT NOT NULL, -- 'college', 'middle', 'high'
  
  -- الدرجات الخام
  openness_raw DECIMAL(5,2),
  conscientiousness_raw DECIMAL(5,2),
  extraversion_raw DECIMAL(5,2),
  agreeableness_raw DECIMAL(5,2),
  neuroticism_raw DECIMAL(5,2),
  
  -- الدرجات المئوية (0-100)
  openness_score DECIMAL(5,2),
  conscientiousness_score DECIMAL(5,2),
  extraversion_score DECIMAL(5,2),
  agreeableness_score DECIMAL(5,2),
  neuroticism_score DECIMAL(5,2),
  
  -- المستويات (High/Moderate/Low)
  openness_band TEXT,
  conscientiousness_band TEXT,
  extraversion_band TEXT,
  agreeableness_band TEXT,
  neuroticism_band TEXT,
  
  -- المسارات الموصى بها
  recommended_tracks TEXT[],
  alternate_tracks TEXT[],
  
  -- الإجابات الكاملة (JSON)
  responses JSONB,
  
  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_big5_college_trait ON big5_60_college_freshgrad(trait);
CREATE INDEX IF NOT EXISTS idx_big5_middle_trait ON big5_60_middle(trait);
CREATE INDEX IF NOT EXISTS idx_big5_high_trait ON big5_60_high(trait);
CREATE INDEX IF NOT EXISTS idx_big5_results_user ON big5_results(user_id);
CREATE INDEX IF NOT EXISTS idx_big5_results_type ON big5_results(assessment_type);

-- Enable Row Level Security
ALTER TABLE big5_60_college_freshgrad ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_60_middle ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_60_high ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_career_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_matching_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_results ENABLE ROW LEVEL SECURITY;

-- Policies للقراءة العامة
CREATE POLICY "Allow public read access" ON big5_60_college_freshgrad FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON big5_60_middle FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON big5_60_high FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON big5_career_tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON big5_matching_rules FOR SELECT USING (true);

-- Policy للنتائج - المستخدم يقرأ نتائجه فقط
CREATE POLICY "Users can read own results" ON big5_results 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON big5_results 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE big5_60_college_freshgrad IS 'أسئلة Big5 للطلبة الجامعيين والخريجين الجدد (60 سؤال)';
COMMENT ON TABLE big5_60_middle IS 'أسئلة Big5 للمرحلة المتوسطة (60 سؤال)';
COMMENT ON TABLE big5_60_high IS 'أسئلة Big5 للمرحلة الثانوية (60 سؤال)';
COMMENT ON TABLE big5_career_tracks IS 'المسارات المهنية المتاحة';
COMMENT ON TABLE big5_matching_rules IS 'قواعد ربط الشخصية بالمسارات المهنية';
COMMENT ON TABLE big5_results IS 'نتائج تقييمات Big5 للمستخدمين';
