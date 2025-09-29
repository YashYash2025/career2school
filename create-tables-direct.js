require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔑 Supabase URL:', supabaseUrl)
console.log('🔑 Service Key exists:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 بدء إنشاء الجداول...')
  
  try {
    // Create countries table
    console.log('📋 إنشاء جدول countries...')
    const { error: countriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS countries (
          code VARCHAR(3) PRIMARY KEY,
          name_ar VARCHAR(100) NOT NULL,
          name_en VARCHAR(100) NOT NULL,
          name_fr VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (countriesError) {
      console.log('❌ خطأ في إنشاء جدول countries:', countriesError)
      // Try alternative method
      console.log('🔄 محاولة طريقة بديلة...')
      
      // Insert sample data directly to test
      const { error: insertError } = await supabase
        .from('countries')
        .insert([
          { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' },
          { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', name_fr: 'Arabie Saoudite' },
          { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', name_fr: 'Émirats' }
        ])
        .select()
      
      if (insertError) {
        console.log('❌ الجدول غير موجود، يجب إنشاؤه في Supabase Dashboard')
        console.log('📝 SQL لإنشاء جدول countries:')
        console.log(`
CREATE TABLE countries (
  code VARCHAR(3) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
        `)
      } else {
        console.log('✅ تم إدراج بيانات تجريبية في جدول countries')
      }
    } else {
      console.log('✅ تم إنشاء جدول countries بنجاح')
    }

    // Test basic connection
    console.log('🧪 اختبار الاتصال...')
    const { data, error } = await supabase.from('countries').select('*').limit(3)
    
    if (error) {
      console.log('❌ خطأ في الاتصال:', error)
    } else {
      console.log('✅ الاتصال يعمل، البيانات:', data?.length || 0, 'سجل')
    }

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

createTables()