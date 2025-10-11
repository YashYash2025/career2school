# 🎯 إعداد Big5 Profiles

## الخطوة 1: إنشاء الجدول في Supabase

افتح **Supabase Dashboard** → **SQL Editor** ونفذ هذا الكود:

```sql
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
DROP POLICY IF EXISTS "Allow public read access" ON big5_trait_descriptions;
CREATE POLICY "Allow public read access" ON big5_trait_descriptions
  FOR SELECT USING (true);

-- Policy للكتابة للـ service_role فقط  
DROP POLICY IF EXISTS "Allow service role full access" ON big5_trait_descriptions;
CREATE POLICY "Allow service role full access" ON big5_trait_descriptions
  FOR ALL USING (auth.role() = 'service_role');
```

## الخطوة 2: استيراد البيانات

بعد إنشاء الجدول، شغّل:

```bash
node scripts/create-big5-trait-descriptions.js
```

## الخطوة 3: تحديث الخوارزمية

الخوارزمية ستُحدّث تلقائياً لاستخدام الأوصاف من قاعدة البيانات.

## الخطوة 4: تحديث الواجهة

الواجهة ستُحدّث لعرض:
- اسم الملف الشخصي (بدل الكود)
- النسب المئوية (بدل الأيقونات)
