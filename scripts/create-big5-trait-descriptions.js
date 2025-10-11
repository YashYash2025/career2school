const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importTraitDescriptions() {
  console.log('📊 بدء استيراد أوصاف Big5...\n');

  // قراءة ملف الإكسيل
  const filePath = 'E:\\Mona-Yashar\\school2career-15-9-2025 - Copy - KIRO\\big5\\Big5_Personality_Profile_3Lang_Career.xlsx';
  
  console.log('📂 قراءة الملف:', filePath);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // تحويل الشيت لـ JSON
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`✅ تم قراءة ${data.length} صف\n`);

  // التحقق من الجدول
  console.log('🔍 التحقق من جدول big5_trait_descriptions...');
  
  const { error: tableError } = await supabase
    .from('big5_trait_descriptions')
    .select('*')
    .limit(1);

  if (tableError && tableError.code === '42P01') {
    console.log('\n⚠️  الجدول غير موجود! يرجى تنفيذ هذا SQL في Supabase:\n');
    console.log(`
CREATE TABLE IF NOT EXISTS big5_trait_descriptions (
  id SERIAL PRIMARY KEY,
  trait VARCHAR(1) NOT NULL,
  band VARCHAR(20) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  career_tip_ar TEXT,
  career_tip_en TEXT,
  career_tip_fr TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trait, band)
);

CREATE INDEX idx_big5_trait_band ON big5_trait_descriptions(trait, band);
    `);
    return;
  }

  console.log('✅ الجدول موجود!\n');

  // استيراد البيانات
  let imported = 0;
  let errors = 0;

  for (const row of data) {
    try {
      const trait = row['Trait'];
      const band = row['Band'];

      if (!trait || !band) {
        console.log('⚠️  تخطي صف بدون trait أو band');
        continue;
      }

      const recordData = {
        trait: trait,
        band: band,
        description_ar: row['Arabic_Profile'] || '',
        description_en: row['English_Profile'] || '',
        description_fr: row['Français_Profile'] || '',
        career_tip_ar: row['Arabic_CareerTip'] || '',
        career_tip_en: row['English_CareerTip'] || '',
        career_tip_fr: row['Français_CareerTip'] || ''
      };

      const { error } = await supabase
        .from('big5_trait_descriptions')
        .upsert(recordData, { onConflict: 'trait,band' });

      if (error) {
        console.error(`❌ ${trait}-${band}:`, error.message);
        errors++;
      } else {
        console.log(`✅ ${trait}-${band}: ${recordData.description_ar.substring(0, 50)}...`);
        imported++;
      }
    } catch (err) {
      console.error('❌ خطأ:', err.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 انتهى الاستيراد!');
  console.log('='.repeat(60));
  console.log(`✅ تم الاستيراد: ${imported}`);
  console.log(`❌ أخطاء: ${errors}`);
}

importTraitDescriptions();
