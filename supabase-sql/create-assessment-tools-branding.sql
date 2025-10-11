-- جدول العلامات التجارية للأدوات
CREATE TABLE IF NOT EXISTS assessment_tools_branding (
  id SERIAL PRIMARY KEY,
  tool_code VARCHAR(50) UNIQUE NOT NULL,
  brand_name_ar VARCHAR(200) NOT NULL,
  brand_name_en VARCHAR(200) NOT NULL,
  brand_name_fr VARCHAR(200) NOT NULL,
  slogan_ar TEXT NOT NULL,
  slogan_en TEXT NOT NULL,
  slogan_fr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_tool_code ON assessment_tools_branding(tool_code);

-- تفعيل RLS
ALTER TABLE assessment_tools_branding ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة للجميع
DROP POLICY IF EXISTS "Allow public read access" ON assessment_tools_branding;
CREATE POLICY "Allow public read access" ON assessment_tools_branding
  FOR SELECT USING (true);

-- Policy للكتابة للـ service_role فقط
DROP POLICY IF EXISTS "Allow service role full access" ON assessment_tools_branding;
CREATE POLICY "Allow service role full access" ON assessment_tools_branding
  FOR ALL USING (auth.role() = 'service_role');

-- إدراج البيانات
INSERT INTO assessment_tools_branding (
  tool_code,
  brand_name_ar,
  brand_name_en,
  brand_name_fr,
  slogan_ar,
  slogan_en,
  slogan_fr,
  description_ar,
  description_en,
  description_fr
) VALUES 
(
  'RIASEC',
  'بوصلة المهن™',
  'Career Compass™',
  'Boussole des Carrières™',
  'اكتشف مسارك المهني بدقة علمية',
  'Discover Your Professional Path with Scientific Precision',
  'Découvrez Votre Parcours Professionnel avec Précision Scientifique',
  '4 تقييمات متطورة من بوصلة School2Career الذكية: للمدارس والجامعات بنسختين (سريع 60 سؤال - شامل 180 سؤال)',
  '4 advanced assessments from School2Career Career Compass: For schools and universities in two versions (Quick 60 questions - Comprehensive 180 questions)',
  '4 évaluations avancées de la Boussole des Carrières School2Career : Pour les écoles et les universités en deux versions (Rapide 60 questions - Complet 180 questions)'
),
(
  'BIG5',
  'مرآة الشخصية™',
  'Personality Mirror™',
  'Miroir de Personnalité™',
  'افهم نفسك لتختار مستقبلك',
  'Understand Yourself to Choose Your Future',
  'Comprenez-vous pour Choisir Votre Avenir',
  '3 تقييمات متطورة من مرآة School2Career: للمدارس الإعدادية والثانوية والجامعات',
  '3 advanced assessments from School2Career Personality Mirror: For middle school, high school, and college',
  '3 évaluations avancées du Miroir de Personnalité School2Career : Pour le collège, le lycée et l''université'
)
ON CONFLICT (tool_code) 
DO UPDATE SET
  brand_name_ar = EXCLUDED.brand_name_ar,
  brand_name_en = EXCLUDED.brand_name_en,
  brand_name_fr = EXCLUDED.brand_name_fr,
  slogan_ar = EXCLUDED.slogan_ar,
  slogan_en = EXCLUDED.slogan_en,
  slogan_fr = EXCLUDED.slogan_fr,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  description_fr = EXCLUDED.description_fr,
  updated_at = NOW();

COMMENT ON TABLE assessment_tools_branding IS 'العلامات التجارية والسلوجانات للأدوات';
