const { createClient } = require('@supabase/supabase-js')

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متغيرات البيئة غير موجودة في .env.local')
  console.error('نحتاج: NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 بدء إنشاء الجداول والبيانات...')
  
  try {
    // 1. إدراج البلدان
    console.log('🌍 إدراج البلدان...')
    const { error: countriesError } = await supabase
      .from('countries')
      .upsert([
        {
          code: 'EG',
          name_ar: 'مصر',
          name_en: 'Egypt',
          name_fr: 'Égypte'
        },
        {
          code: 'SA', 
          name_ar: 'السعودية',
          name_en: 'Saudi Arabia',
          name_fr: 'Arabie Saoudite'
        },
        {
          code: 'AE',
          name_ar: 'الإمارات العربية المتحدة',
          name_en: 'United Arab Emirates',
          name_fr: 'Émirats Arabes Unis'
        }
      ], { onConflict: 'code' })
    
    if (countriesError) {
      console.error('❌ خطأ في إدراج البلدان:', countriesError)
      // نحاول إنشاء الجدول أولاً
      console.log('🔄 محاولة إنشاء جدول countries...')
      console.log('يجب إنشاء الجداول يدوياً في Supabase SQL Editor أولاً')
      return
    }
    
    console.log('✅ تم إدراج البلدان')
    
    // 2. إدراج المحافظات
    console.log('🏛️ إدراج المحافظات...')
    const governorates = [
      // مصر
      { code: 'CAI', country_code: 'EG', name_ar: 'القاهرة', name_en: 'Cairo', name_fr: 'Le Caire' },
      { code: 'GIZ', country_code: 'EG', name_ar: 'الجيزة', name_en: 'Giza', name_fr: 'Gizeh' },
      { code: 'ALX', country_code: 'EG', name_ar: 'الإسكندرية', name_en: 'Alexandria', name_fr: 'Alexandrie' },
      // السعودية
      { code: 'RYD', country_code: 'SA', name_ar: 'الرياض', name_en: 'Riyadh', name_fr: 'Riyad' },
      { code: 'MKK', country_code: 'SA', name_ar: 'مكة المكرمة', name_en: 'Makkah', name_fr: 'La Mecque' },
      // الإمارات
      { code: 'AUH', country_code: 'AE', name_ar: 'أبو ظبي', name_en: 'Abu Dhabi', name_fr: 'Abou Dabi' },
      { code: 'DXB', country_code: 'AE', name_ar: 'دبي', name_en: 'Dubai', name_fr: 'Dubaï' }
    ]
    
    const { error: govError } = await supabase
      .from('governorates')
      .upsert(governorates, { onConflict: 'code' })
    
    if (govError) {
      console.error('❌ خطأ في إدراج المحافظات:', govError)
      return
    }
    
    console.log('✅ تم إدراج المحافظات')
    
    // 3. إدراج المراحل التعليمية
    console.log('🎓 إدراج المراحل التعليمية...')
    const educationLevels = [
      { code: 'middle', name_ar: 'إعدادي', name_en: 'Middle School', name_fr: 'Collège', sort_order: 1 },
      { code: 'high', name_ar: 'ثانوي', name_en: 'High School', name_fr: 'Lycée', sort_order: 2 },
      { code: 'university', name_ar: 'جامعي', name_en: 'University', name_fr: 'Université', sort_order: 3 },
      { code: 'graduate', name_ar: 'خريج', name_en: 'Graduate', name_fr: 'Diplômé', sort_order: 4 }
    ]
    
    const { error: eduError } = await supabase
      .from('education_levels')
      .upsert(educationLevels, { onConflict: 'code' })
    
    if (eduError) {
      console.error('❌ خطأ في إدراج المراحل التعليمية:', eduError)
      return
    }
    
    console.log('✅ تم إدراج المراحل التعليمية')
    
    // 4. إدراج الصفوف الدراسية
    console.log('📚 إدراج الصفوف الدراسية...')
    const grades = [
      // إعدادي
      { code: '7', education_level_code: 'middle', name_ar: 'الصف الأول الإعدادي', name_en: '7th Grade', name_fr: '5ème', sort_order: 1 },
      { code: '8', education_level_code: 'middle', name_ar: 'الصف الثاني الإعدادي', name_en: '8th Grade', name_fr: '4ème', sort_order: 2 },
      { code: '9', education_level_code: 'middle', name_ar: 'الصف الثالث الإعدادي', name_en: '9th Grade', name_fr: '3ème', sort_order: 3 },
      // ثانوي
      { code: '10', education_level_code: 'high', name_ar: 'الصف الأول الثانوي', name_en: '10th Grade', name_fr: 'Seconde', sort_order: 1 },
      { code: '11', education_level_code: 'high', name_ar: 'الصف الثاني الثانوي', name_en: '11th Grade', name_fr: 'Première', sort_order: 2 },
      { code: '12', education_level_code: 'high', name_ar: 'الصف الثالث الثانوي', name_en: '12th Grade', name_fr: 'Terminale', sort_order: 3 }
    ]
    
    const { error: gradesError } = await supabase
      .from('education_grades')
      .upsert(grades, { onConflict: 'code' })
    
    if (gradesError) {
      console.error('❌ خطأ في إدراج الصفوف الدراسية:', gradesError)
      return
    }
    
    console.log('✅ تم إدراج الصفوف الدراسية')
    
    // 5. التحقق من البيانات
    console.log('🔍 التحقق من البيانات...')
    
    const { data: countriesData, error: checkCountriesError } = await supabase
      .from('countries')
      .select('*')
    
    const { data: govData, error: checkGovError } = await supabase
      .from('governorates')
      .select('*')
    
    if (countriesData && govData) {
      console.log(`✅ تم العثور على ${countriesData.length} بلدان و ${govData.length} محافظات`)
      console.log('🎉 تم إنشاء وملء جميع الجداول بنجاح!')
    }
    
  } catch (error) {
    console.error('💥 خطأ عام:', error)
  }
}

createTables()