-- ============================================================
-- جدول توصيات RIASEC حسب الكود والمنطقة والمرحلة
-- ============================================================

-- حذف الجدول إن كان موجود
DROP TABLE IF EXISTS riasec_recommendations CASCADE;

-- إنشاء الجدول
CREATE TABLE riasec_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- معلومات الكود
  holland_code VARCHAR(3) NOT NULL,
  code_rank INTEGER,                          -- ترتيب الكود (1-120)
  
  -- المنطقة
  region VARCHAR(50) NOT NULL,
  
  -- المرحلة التعليمية
  education_level VARCHAR(50) NOT NULL,       -- Middle, High, College, Work
  
  -- التوصيات (نصوص طويلة)
  recommendations_ar TEXT NOT NULL,
  recommendations_en TEXT NOT NULL,
  
  -- معلومات إضافية
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint
  UNIQUE(holland_code, region, education_level)
);

-- Indexes للبحث السريع
CREATE INDEX idx_riasec_rec_code ON riasec_recommendations(holland_code);
CREATE INDEX idx_riasec_rec_region ON riasec_recommendations(region);
CREATE INDEX idx_riasec_rec_level ON riasec_recommendations(education_level);
CREATE INDEX idx_riasec_rec_combined ON riasec_recommendations(holland_code, region, education_level);

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_riasec_rec_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_riasec_rec_updated_at
BEFORE UPDATE ON riasec_recommendations
FOR EACH ROW
EXECUTE FUNCTION update_riasec_rec_updated_at();

-- Comments
COMMENT ON TABLE riasec_recommendations IS 'توصيات RIASEC حسب كود هولاند والمنطقة والمرحلة التعليمية';
COMMENT ON COLUMN riasec_recommendations.holland_code IS 'كود هولاند الثلاثي (مثل RIA, RIS)';
COMMENT ON COLUMN riasec_recommendations.region IS 'المنطقة الجغرافية (Egypt, USA, GCC, etc.)';
COMMENT ON COLUMN riasec_recommendations.education_level IS 'المرحلة التعليمية (Middle, High, College, Work)';
COMMENT ON COLUMN riasec_recommendations.recommendations_ar IS 'التوصيات المهنية بالعربية';
COMMENT ON COLUMN riasec_recommendations.recommendations_en IS 'التوصيات المهنية بالإنجليزية';

-- ============================================================
-- تم إنشاء الجدول بنجاح
-- ============================================================
