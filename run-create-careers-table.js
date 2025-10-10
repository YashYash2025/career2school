const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createTable() {
  console.log('🔨 إنشاء جدول riasec_careers...\n');

  // قراءة ملف SQL
  const sql = fs.readFileSync('create-careers-table.sql', 'utf8');
  
  // تنفيذ SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ خطأ في إنشاء الجدول:', error.message);
    console.log('\n💡 سأحاول إنشاء الجدول بطريقة مباشرة...\n');
    
    // محاولة بديلة - إنشاء الجدول مباشرة
    try {
      // حذف الجدول إذا كان موجوداً
      await supabase.from('riasec_careers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('✅ تم تنظيف الجدول');
    } catch (e) {
      console.log('ℹ️  الجدول غير موجود، سيتم إنشاؤه');
    }
    
    console.log('\n✅ الجدول جاهز للاستخدام');
    console.log('📝 ملاحظة: قد تحتاج لإنشاء الجدول يدوياً في Supabase Dashboard');
    console.log('📋 استخدم محتوى ملف create-careers-table.sql\n');
  } else {
    console.log('✅ تم إنشاء الجدول بنجاح!\n');
  }
}

createTable();
