-- إنشاء جدول التوصيات الموحد
CREATE TABLE IF NOT EXISTS tool_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ربط مع الأداة
  tool_code TEXT NOT NULL, -- 'RIASEC', 'BIG5', etc.
  
  -- كود الملف الشخصي
  profile_code TEXT NOT NULL, -- 'RIA', 'OCEAN-High-Low-High', etc.
  
  -- المنطقة الجغرافية
  region TEXT, -- 'Egypt', 'GCC', 'USA', 'International'
  
  -- المرحلة التعليمية/العمرية
  education_level TEXT, -- 'Middle', 'High', 'College', 'Work'
  
  -- التوصيات
  recommendations_ar TEXT,
  recommendations_en TEXT,
  
  -- الترتيب/الأولوية
  rank INTEGER,
  
  -- بيانات إضافية مرنة
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(tool_code, profile_code, region, education_level)
);

-- Indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_tool_recommendations_tool ON tool_recommendations(tool_code);
CREATE INDEX IF NOT EXISTS idx_tool_recommendations_profile ON tool_recommendations(profile_code);
CREATE INDEX IF NOT EXISTS idx_tool_recommendations_region ON tool_recommendations(region);
CREATE INDEX IF NOT EXISTS idx_tool_recommendations_level ON tool_recommendations(education_level);

-- Enable Row Level Security
ALTER TABLE tool_recommendations ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة العامة
CREATE POLICY "Allow public read access" ON tool_recommendations
  FOR SELECT USING (true);

-- Comment
COMMENT ON TABLE tool_recommendations IS 'جدول التوصيات الموحد لجميع أدوات التقييم';
COMMENT ON COLUMN tool_recommendations.tool_code IS 'كود الأداة (RIASEC, BIG5, etc.)';
COMMENT ON COLUMN tool_recommendations.profile_code IS 'كود الملف الشخصي (RIA, OCEAN-High-Low, etc.)';
COMMENT ON COLUMN tool_recommendations.metadata IS 'بيانات إضافية مرنة بصيغة JSON';
