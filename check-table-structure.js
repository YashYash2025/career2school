const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStructure() {
  console.log('🔍 فحص بنية جدول riasec_careers...\n');

  // محاولة إدراج سجل تجريبي لمعرفة الأعمدة المتاحة
  const testRecord = {
    career_title_ar: 'اختبار',
    career_title_en: 'Test',
    holland_code: 'RIA',
    primary_type: 'R',
    region: 'Egypt'
  };

  const { data, error } = await supabase
    .from('riasec_careers')
    .insert([testRecord])
    .select();

  if (error) {
    console.error('❌ خطأ:', error.message);
    console.log('\n💡 يبدو أن الجدول غير موجود أو بنيته مختلفة');
    console.log('📋 يرجى إنشاء الجدول يدوياً في Supabase Dashboard باستخدام:');
    console.log('   create-careers-table.sql\n');
  } else {
    console.log('✅ الجدول موجود ويعمل!');
    console.log('📊 السجل التجريبي:', data);
    
    // حذف السجل التجريبي
    await supabase
      .from('riasec_careers')
      .delete()
      .eq('career_title_ar', 'اختبار');
    
    console.log('\n✅ تم حذف السجل التجريبي');
  }
}

checkStructure();
