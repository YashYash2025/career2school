-- جدول أوصاف Big5 حسب Trait و Band
CREATE TABLE IF NOT EXISTS big5_trait_descriptions (
  id SERIAL PRIMARY KEY,
  trait VARCHAR(1) NOT NULL CHECK (trait IN ('O', 'C', 'E', 'A', 'N')),
  band VARCHAR(20) NOT NULL CHECK (band IN ('High', 'Moderate', 'Low')),
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  career_tip_ar TEXT,
  career_tip_en TEXT,
  career_tip_fr TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_trait_band UNIQUE(trait, band)
);

-- Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_big5_trait_band ON big5_trait_descriptions(trait, band);

-- تفعيل RLS
ALTER TABLE big5_trait_descriptions ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة للجميع
CREATE POLICY "Allow public read access" ON big5_trait_descriptions
  FOR SELECT USING (true);

-- Policy للكتابة للـ service_role فقط
CREATE POLICY "Allow service role full access" ON big5_trait_descriptions
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE big5_trait_descriptions IS 'أوصاف Big5 لكل Trait و Band';
