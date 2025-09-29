require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndInsert() {
  console.log('🔍 فحص البيانات الموجودة...')
  
  try {
    // Check countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
    
    if (countriesError) {
      console.log('❌ خطأ في جدول countries:', countriesError)
      return
    }
    
    console.log('📊 البيانات الموجودة في countries:', countries?.length || 0)
    countries?.forEach(country => {
      console.log(`- ${country.code}: ${country.name_ar} / ${country.name_en}`)
    })

    // Add more countries if needed
    if (countries.length < 10) {
      console.log('➕ إضافة المزيد من الدول...')
      
      const moreCountries = [
        { code: 'QA', name_ar: 'قطر', name_en: 'Qatar', name_fr: 'Qatar' },
        { code: 'KW', name_ar: 'الكويت', name_en: 'Kuwait', name_fr: 'Koweït' },
        { code: 'BH', name_ar: 'البحرين', name_en: 'Bahrain', name_fr: 'Bahreïn' },
        { code: 'OM', name_ar: 'عُمان', name_en: 'Oman', name_fr: 'Oman' },
        { code: 'JO', name_ar: 'الأردن', name_en: 'Jordan', name_fr: 'Jordanie' },
        { code: 'LB', name_ar: 'لبنان', name_en: 'Lebanon', name_fr: 'Liban' },
        { code: 'MA', name_ar: 'المغرب', name_en: 'Morocco', name_fr: 'Maroc' },
        { code: 'TN', name_ar: 'تونس', name_en: 'Tunisia', name_fr: 'Tunisie' },
        { code: 'DZ', name_ar: 'الجزائر', name_en: 'Algeria', name_fr: 'Algérie' },
        { code: 'US', name_ar: 'الولايات المتحدة', name_en: 'United States', name_fr: 'États-Unis' },
        { code: 'CA', name_ar: 'كندا', name_en: 'Canada', name_fr: 'Canada' },
        { code: 'DE', name_ar: 'ألمانيا', name_en: 'Germany', name_fr: 'Allemagne' },
        { code: 'FR', name_ar: 'فرنسا', name_en: 'France', name_fr: 'France' },
        { code: 'GB', name_ar: 'المملكة المتحدة', name_en: 'United Kingdom', name_fr: 'Royaume-Uni' }
      ]

      // Filter out existing countries
      const existingCodes = countries.map(c => c.code)
      const newCountries = moreCountries.filter(c => !existingCodes.includes(c.code))

      if (newCountries.length > 0) {
        const { error: insertError } = await supabase
          .from('countries')
          .insert(newCountries)

        if (insertError) {
          console.log('❌ خطأ في إضافة الدول:', insertError)
        } else {
          console.log('✅ تم إضافة', newCountries.length, 'دولة جديدة')
        }
      }
    }

    // Check education_levels
    console.log('\n🎓 فحص جدول education_levels...')
    const { data: educationLevels, error: educationError } = await supabase
      .from('education_levels')
      .select('*')
    
    if (educationError) {
      console.log('❌ جدول education_levels غير موجود، سيتم استخدام البيانات الثابتة')
    } else {
      console.log('📊 البيانات الموجودة في education_levels:', educationLevels?.length || 0)
      
      if (educationLevels.length === 0) {
        console.log('➕ إضافة المراحل التعليمية...')
        
        const educationData = [
          { code: 'elementary', name_ar: 'ابتدائي', name_en: 'Elementary', name_fr: 'Élémentaire', sort_order: 1 },
          { code: 'middle', name_ar: 'إعدادي', name_en: 'Middle School', name_fr: 'Collège', sort_order: 2 },
          { code: 'high', name_ar: 'ثانوي', name_en: 'High School', name_fr: 'Lycée', sort_order: 3 },
          { code: 'university', name_ar: 'جامعي', name_en: 'University', name_fr: 'Université', sort_order: 4 },
          { code: 'graduate', name_ar: 'خريج', name_en: 'Graduate', name_fr: 'Diplômé', sort_order: 5 },
          { code: 'postgraduate', name_ar: 'دراسات عليا', name_en: 'Postgraduate', name_fr: 'Études supérieures', sort_order: 6 }
        ]

        const { error: insertEducationError } = await supabase
          .from('education_levels')
          .insert(educationData)

        if (insertEducationError) {
          console.log('❌ خطأ في إضافة المراحل التعليمية:', insertEducationError)
        } else {
          console.log('✅ تم إضافة المراحل التعليمية')
        }
      }
    }

    // Final check
    console.log('\n🔄 فحص نهائي للبيانات...')
    const { data: finalCountries } = await supabase.from('countries').select('*')
    console.log('📊 إجمالي الدول:', finalCountries?.length || 0)

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

checkAndInsert()