const { createClient } = require('@supabase/supabase-js')

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متغيرات البيئة غير موجودة')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 بدء إعداد قاعدة البيانات...')
  
  try {
    // إنشاء جدول البلدان
    console.log('📋 إنشاء جدول البلدان...')
    
    const createCountriesTable = `
      CREATE TABLE IF NOT EXISTS countries (
        code VARCHAR(3) PRIMARY KEY,
        name_ar VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        name_fr VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    let { error } = await supabase.rpc('exec_sql', { sql: createCountriesTable })
    if (error) {
      console.log('⚠️ محاولة إنشاء الجدول بطريقة أخرى...')
      // محاولة إدراج البيانات مباشرة (إذا كان الجدول موجود)
      const { error: insertError } = await supabase
        .from('countries')
        .upsert([
          { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' }
        ], { onConflict: 'code' })
      
      if (insertError) {
        console.error('❌ الجدول غير موجود. يجب إنشاؤه في Supabase SQL Editor:', insertError)
        console.log(`
📝 نسخ والصق هذا في Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(3) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `)
        return
      }
      console.log('✅ الجدول موجود بالفعل')
    }
    
    // إدراج البيانات الأساسية
    console.log('🌍 إدراج البيانات الأساسية...')
    
    // البلدان
    const { error: countriesError } = await supabase
      .from('countries')
      .upsert([
        { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' },
        { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', name_fr: 'Arabie Saoudite' },
        { code: 'AE', name_ar: 'الإمارات العربية المتحدة', name_en: 'United Arab Emirates', name_fr: 'Émirats Arabes Unis' }
      ], { onConflict: 'code' })
    
    if (countriesError) {
      console.error('❌ خطأ في إدراج البلدان:', countriesError)
      return
    }
    
    console.log('✅ تم إدراج البلدان')
    
    // المحافظات (إذا كان الجدول موجود)
    const { error: govError } = await supabase
      .from('governorates')
      .upsert([
        { code: 'CAI', country_code: 'EG', name_ar: 'القاهرة', name_en: 'Cairo', name_fr: 'Le Caire' },
        { code: 'GIZ', country_code: 'EG', name_ar: 'الجيزة', name_en: 'Giza', name_fr: 'Gizeh' },
        { code: 'ALX', country_code: 'EG', name_ar: 'الإسكندرية', name_en: 'Alexandria', name_fr: 'Alexandrie' },
        { code: 'RYD', country_code: 'SA', name_ar: 'الرياض', name_en: 'Riyadh', name_fr: 'Riyad' },
        { code: 'MKK', country_code: 'SA', name_ar: 'مكة المكرمة', name_en: 'Makkah', name_fr: 'La Mecque' },
        { code: 'AUH', country_code: 'AE', name_ar: 'أبو ظبي', name_en: 'Abu Dhabi', name_fr: 'Abou Dabi' },
        { code: 'DXB', country_code: 'AE', name_ar: 'دبي', name_en: 'Dubai', name_fr: 'Dubaï' }
      ], { onConflict: 'code' })
    
    if (govError) {
      console.log('⚠️ جدول المحافظات غير موجود - سنحتاج لإنشاؤه')
    } else {
      console.log('✅ تم إدراج المحافظات')
    }
    
    // المراحل التعليمية
    const { error: eduError } = await supabase
      .from('education_levels')
      .upsert([
        { code: 'middle', name_ar: 'إعدادي', name_en: 'Middle School', name_fr: 'Collège', sort_order: 1 },
        { code: 'high', name_ar: 'ثانوي', name_en: 'High School', name_fr: 'Lycée', sort_order: 2 },
        { code: 'university', name_ar: 'جامعي', name_en: 'University', name_fr: 'Université', sort_order: 3 },
        { code: 'graduate', name_ar: 'خريج', name_en: 'Graduate', name_fr: 'Diplômé', sort_order: 4 }
      ], { onConflict: 'code' })
    
    if (eduError) {
      console.log('⚠️ جدول المراحل التعليمية غير موجود - سنحتاج لإنشاؤه')
    } else {
      console.log('✅ تم إدراج المراحل التعليمية')
    }
    
    // التحقق من النتيجة النهائية
    const { data: countriesData } = await supabase
      .from('countries')
      .select('*')
    
    if (countriesData) {
      console.log(`🎉 تم الانتهاء! عدد البلدان: ${countriesData.length}`)
      countriesData.forEach(country => {
        console.log(`  - ${country.name_ar} (${country.code})`)
      })
    }
    
  } catch (error) {
    console.error('💥 خطأ عام:', error)
  }
}

setupDatabase()