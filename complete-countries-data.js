require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addCompleteData() {
  console.log('🌍 بدء إضافة البيانات الكاملة...')
  
  try {
    // إضافة باقي الدول المهمة
    console.log('➕ إضافة المزيد من الدول...')
    
    const additionalCountries = [
      // باقي الدول العربية
      { code: 'LY', name_ar: 'ليبيا', name_en: 'Libya', name_fr: 'Libye' },
      { code: 'SD', name_ar: 'السودان', name_en: 'Sudan', name_fr: 'Soudan' },
      { code: 'SY', name_ar: 'سوريا', name_en: 'Syria', name_fr: 'Syrie' },
      { code: 'IQ', name_ar: 'العراق', name_en: 'Iraq', name_fr: 'Irak' },
      { code: 'PS', name_ar: 'فلسطين', name_en: 'Palestine', name_fr: 'Palestine' },
      { code: 'YE', name_ar: 'اليمن', name_en: 'Yemen', name_fr: 'Yémen' },
      { code: 'MR', name_ar: 'موريتانيا', name_en: 'Mauritania', name_fr: 'Mauritanie' },
      { code: 'SO', name_ar: 'الصومال', name_en: 'Somalia', name_fr: 'Somalie' },
      { code: 'DJ', name_ar: 'جيبوتي', name_en: 'Djibouti', name_fr: 'Djibouti' },
      { code: 'KM', name_ar: 'جزر القمر', name_en: 'Comoros', name_fr: 'Comores' },
      
      // دول أوروبية إضافية
      { code: 'IT', name_ar: 'إيطاليا', name_en: 'Italy', name_fr: 'Italie' },
      { code: 'ES', name_ar: 'إسبانيا', name_en: 'Spain', name_fr: 'Espagne' },
      { code: 'NL', name_ar: 'هولندا', name_en: 'Netherlands', name_fr: 'Pays-Bas' },
      { code: 'SE', name_ar: 'السويد', name_en: 'Sweden', name_fr: 'Suède' },
      { code: 'NO', name_ar: 'النرويج', name_en: 'Norway', name_fr: 'Norvège' },
      { code: 'DK', name_ar: 'الدنمارك', name_en: 'Denmark', name_fr: 'Danemark' },
      { code: 'FI', name_ar: 'فنلندا', name_en: 'Finland', name_fr: 'Finlande' },
      { code: 'CH', name_ar: 'سويسرا', name_en: 'Switzerland', name_fr: 'Suisse' },
      { code: 'AT', name_ar: 'النمسا', name_en: 'Austria', name_fr: 'Autriche' },
      { code: 'BE', name_ar: 'بلجيكا', name_en: 'Belgium', name_fr: 'Belgique' },
      { code: 'PT', name_ar: 'البرتغال', name_en: 'Portugal', name_fr: 'Portugal' },
      { code: 'GR', name_ar: 'اليونان', name_en: 'Greece', name_fr: 'Grèce' },
      { code: 'PL', name_ar: 'بولندا', name_en: 'Poland', name_fr: 'Pologne' },
      { code: 'CZ', name_ar: 'التشيك', name_en: 'Czech Republic', name_fr: 'République Tchèque' },
      { code: 'HU', name_ar: 'المجر', name_en: 'Hungary', name_fr: 'Hongrie' },
      { code: 'RO', name_ar: 'رومانيا', name_en: 'Romania', name_fr: 'Roumanie' },
      { code: 'HR', name_ar: 'كرواتيا', name_en: 'Croatia', name_fr: 'Croatie' },
      
      // دول آسيوية
      { code: 'CN', name_ar: 'الصين', name_en: 'China', name_fr: 'Chine' },
      { code: 'JP', name_ar: 'اليابان', name_en: 'Japan', name_fr: 'Japon' },
      { code: 'KR', name_ar: 'كوريا الجنوبية', name_en: 'South Korea', name_fr: 'Corée du Sud' },
      { code: 'IN', name_ar: 'الهند', name_en: 'India', name_fr: 'Inde' },
      { code: 'PK', name_ar: 'باكستان', name_en: 'Pakistan', name_fr: 'Pakistan' },
      { code: 'BD', name_ar: 'بنغلاديش', name_en: 'Bangladesh', name_fr: 'Bangladesh' },
      { code: 'TR', name_ar: 'تركيا', name_en: 'Turkey', name_fr: 'Turquie' },
      { code: 'IR', name_ar: 'إيران', name_en: 'Iran', name_fr: 'Iran' },
      { code: 'AF', name_ar: 'أفغانستان', name_en: 'Afghanistan', name_fr: 'Afghanistan' },
      { code: 'TH', name_ar: 'تايلاند', name_en: 'Thailand', name_fr: 'Thaïlande' },
      { code: 'VN', name_ar: 'فيتنام', name_en: 'Vietnam', name_fr: 'Viêt Nam' },
      { code: 'MY', name_ar: 'ماليزيا', name_en: 'Malaysia', name_fr: 'Malaisie' },
      { code: 'SG', name_ar: 'سنغافورة', name_en: 'Singapore', name_fr: 'Singapour' },
      { code: 'PH', name_ar: 'الفلبين', name_en: 'Philippines', name_fr: 'Philippines' },
      { code: 'ID', name_ar: 'إندونيسيا', name_en: 'Indonesia', name_fr: 'Indonésie' },
      
      // دول أمريكا اللاتينية
      { code: 'BR', name_ar: 'البرازيل', name_en: 'Brazil', name_fr: 'Brésil' },
      { code: 'MX', name_ar: 'المكسيك', name_en: 'Mexico', name_fr: 'Mexique' },
      { code: 'AR', name_ar: 'الأرجنتين', name_en: 'Argentina', name_fr: 'Argentine' },
      { code: 'CL', name_ar: 'تشيلي', name_en: 'Chile', name_fr: 'Chili' },
      { code: 'CO', name_ar: 'كولومبيا', name_en: 'Colombia', name_fr: 'Colombie' },
      { code: 'PE', name_ar: 'بيرو', name_en: 'Peru', name_fr: 'Pérou' },
      { code: 'VE', name_ar: 'فنزويلا', name_en: 'Venezuela', name_fr: 'Venezuela' },
      { code: 'EC', name_ar: 'الإكوادور', name_en: 'Ecuador', name_fr: 'Équateur' },
      
      // دول أفريقية
      { code: 'NG', name_ar: 'نيجيريا', name_en: 'Nigeria', name_fr: 'Nigeria' },
      { code: 'ZA', name_ar: 'جنوب أفريقيا', name_en: 'South Africa', name_fr: 'Afrique du Sud' },
      { code: 'KE', name_ar: 'كينيا', name_en: 'Kenya', name_fr: 'Kenya' },
      { code: 'ET', name_ar: 'إثيوبيا', name_en: 'Ethiopia', name_fr: 'Éthiopie' },
      { code: 'GH', name_ar: 'غانا', name_en: 'Ghana', name_fr: 'Ghana' },
      { code: 'UG', name_ar: 'أوغندا', name_en: 'Uganda', name_fr: 'Ouganda' },
      { code: 'TZ', name_ar: 'تنزانيا', name_en: 'Tanzania', name_fr: 'Tanzanie' },
      { code: 'SN', name_ar: 'السنغال', name_en: 'Senegal', name_fr: 'Sénégal' },
      { code: 'CI', name_ar: 'ساحل العاج', name_en: 'Ivory Coast', name_fr: 'Côte d\'Ivoire' },
      { code: 'CM', name_ar: 'الكاميرون', name_en: 'Cameroon', name_fr: 'Cameroun' },
      
      // دول أوقيانوسيا
      { code: 'AU', name_ar: 'أستراليا', name_en: 'Australia', name_fr: 'Australie' },
      { code: 'NZ', name_ar: 'نيوزيلندا', name_en: 'New Zealand', name_fr: 'Nouvelle-Zélande' }
    ]

    // التحقق من الدول الموجودة وإضافة الجديدة
    const { data: existingCountries } = await supabase.from('countries').select('code')
    const existingCodes = existingCountries?.map(c => c.code) || []
    const newCountries = additionalCountries.filter(c => !existingCodes.includes(c.code))

    if (newCountries.length > 0) {
      const { error: insertError } = await supabase
        .from('countries')
        .insert(newCountries)

      if (insertError) {
        console.log('❌ خطأ في إضافة الدول:', insertError)
      } else {
        console.log(`✅ تم إضافة ${newCountries.length} دولة جديدة`)
      }
    }

    console.log('\n🏛️ إنشاء جدول المحافظات...')
    
    // إنشاء جدول المحافظات إذا لم يكن موجود
    const { error: govError } = await supabase
      .from('governorates')
      .select('*')
      .limit(1)
    
    if (govError && govError.code === 'PGRST116') {
      console.log('📝 جدول governorates غير موجود، يجب إنشاؤه في Supabase Dashboard:')
      console.log(`
CREATE TABLE governorates (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, country_code)
);
      `)
    } else {
      console.log('✅ جدول governorates موجود')
      
      // إضافة باقي محافظات مصر الـ 11 المتبقية
      console.log('📍 إضافة باقي محافظات مصر...')
      
      const remainingEgyptGovernorates = [
        { code: 'FYM', country_code: 'EG', name_ar: 'الفيوم', name_en: 'Fayyum', name_fr: 'Fayoum' },
        { code: 'BNS', country_code: 'EG', name_ar: 'بني سويف', name_en: 'Beni Suef', name_fr: 'Beni Suef' },
        { code: 'MNY', country_code: 'EG', name_ar: 'المنيا', name_en: 'Minya', name_fr: 'Minya' },
        { code: 'AST', country_code: 'EG', name_ar: 'أسيوط', name_en: 'Asyut', name_fr: 'Assiout' },
        { code: 'SHG', country_code: 'EG', name_ar: 'سوهاج', name_en: 'Sohag', name_fr: 'Sohag' },
        { code: 'QNA', country_code: 'EG', name_ar: 'قنا', name_en: 'Qena', name_fr: 'Qena' },
        { code: 'RSS', country_code: 'EG', name_ar: 'البحر الأحمر', name_en: 'Red Sea', name_fr: 'Mer Rouge' },
        { code: 'WAD', country_code: 'EG', name_ar: 'الوادي الجديد', name_en: 'New Valley', name_fr: 'Nouvelle Vallée' },
        { code: 'MTR', country_code: 'EG', name_ar: 'مطروح', name_en: 'Matrouh', name_fr: 'Matrouh' },
        { code: 'SIN', country_code: 'EG', name_ar: 'شمال سيناء', name_en: 'North Sinai', name_fr: 'Sinaï Nord' },
        { code: 'JNS', country_code: 'EG', name_ar: 'جنوب سيناء', name_en: 'South Sinai', name_fr: 'Sinaï Sud' }
      ]

      const { error: govInsertError } = await supabase
        .from('governorates')
        .insert(remainingEgyptGovernorates)

      if (govInsertError && !govInsertError.message.includes('duplicate')) {
        console.log('❌ خطأ في إضافة محافظات مصر:', govInsertError)
      } else {
        console.log('✅ تم إضافة باقي محافظات مصر (27 محافظة كاملة)')
      }

      // إضافة محافظات دول أخرى مهمة
      console.log('🌍 إضافة محافظات الدول الأخرى...')
      
      const otherGovernorates = [
        // محافظات تركيا
        { code: 'IST', country_code: 'TR', name_ar: 'إسطنبول', name_en: 'Istanbul', name_fr: 'Istanbul' },
        { code: 'ANK', country_code: 'TR', name_ar: 'أنقرة', name_en: 'Ankara', name_fr: 'Ankara' },
        { code: 'IZM', country_code: 'TR', name_ar: 'إزمير', name_en: 'Izmir', name_fr: 'Izmir' },
        { code: 'ADA', country_code: 'TR', name_ar: 'أضنة', name_en: 'Adana', name_fr: 'Adana' },
        { code: 'BUR', country_code: 'TR', name_ar: 'بورصة', name_en: 'Bursa', name_fr: 'Bursa' },
        
        // ولايات أمريكية إضافية
        { code: 'WA', country_code: 'US', name_ar: 'واشنطن', name_en: 'Washington', name_fr: 'Washington' },
        { code: 'OR', country_code: 'US', name_ar: 'أوريغون', name_en: 'Oregon', name_fr: 'Oregon' },
        { code: 'NV', country_code: 'US', name_ar: 'نيفادا', name_en: 'Nevada', name_fr: 'Nevada' },
        { code: 'AZ', country_code: 'US', name_ar: 'أريزونا', name_en: 'Arizona', name_fr: 'Arizona' },
        { code: 'CO', country_code: 'US', name_ar: 'كولورادو', name_en: 'Colorado', name_fr: 'Colorado' },
        
        // مقاطعات كندية إضافية
        { code: 'SK', country_code: 'CA', name_ar: 'ساسكاتشوان', name_en: 'Saskatchewan', name_fr: 'Saskatchewan' },
        { code: 'NS', country_code: 'CA', name_ar: 'نوفا سكوتيا', name_en: 'Nova Scotia', name_fr: 'Nouvelle-Écosse' },
        { code: 'NB', country_code: 'CA', name_ar: 'نيو برونزويك', name_en: 'New Brunswick', name_fr: 'Nouveau-Brunswick' },
        
        // أقاليم فرنسية إضافية
        { code: 'HDF', country_code: 'FR', name_ar: 'أو دو فرانس', name_en: 'Hauts-de-France', name_fr: 'Hauts-de-France' },
        { code: 'GRE', country_code: 'FR', name_ar: 'جراند إست', name_en: 'Grand Est', name_fr: 'Grand Est' },
        { code: 'BOU', country_code: 'FR', name_ar: 'بورغونيا فرانش كونتيه', name_en: 'Burgundy-Franche-Comté', name_fr: 'Bourgogne-Franche-Comté' }
      ]

      const { error: otherGovError } = await supabase
        .from('governorates')
        .insert(otherGovernorates)

      if (otherGovError && !otherGovError.message.includes('duplicate')) {
        console.log('❌ خطأ في إضافة محافظات الدول الأخرى:', otherGovError)
      } else {
        console.log('✅ تم إضافة محافظات الدول الأخرى')
      }
    }

    // التحقق النهائي
    console.log('\n📊 إحصائيات نهائية:')
    const { data: finalCountries } = await supabase.from('countries').select('*')
    console.log(`🌍 إجمالي الدول: ${finalCountries?.length || 0}`)
    
    const { data: finalGovernorates } = await supabase.from('governorates').select('*')
    console.log(`🏛️ إجمالي المحافظات: ${finalGovernorates?.length || 0}`)
    
    // عرض محافظات مصر
    const { data: egyptGov } = await supabase
      .from('governorates')
      .select('*')
      .eq('country_code', 'EG')
    console.log(`🇪🇬 محافظات مصر: ${egyptGov?.length || 0}`)

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

addCompleteData()