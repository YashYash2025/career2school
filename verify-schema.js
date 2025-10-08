const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifySchema() {
  console.log('🔍 التحقق من Schema الجديد...\n');
  console.log('=' .repeat(70) + '\n');
  
  const expectedTables = {
    'user_profiles': 'جدول الملفات الشخصية (محسّن)',
    'students': 'جدول الطلاب',
    'counselors': 'جدول المستشارين',
    'user_credits': 'جدول الرصيد (جديد)',
    'assessment_questions': 'جدول الأسئلة',
    'assessment_sessions': 'جدول الجلسات (محسّن)',
    'user_answers': 'جدول الإجابات',
    'assessment_results': 'جدول النتائج',
    'career_recommendations': 'جدول التوصيات المهنية',
    'payment_transactions': 'جدول المعاملات المالية',
    'subscriptions': 'جدول الاشتراكات',
    'user_achievements': 'جدول إنجازات المستخدمين',
    'student_progress': 'جدول تقدم الطلاب'
  };
  
  console.log('📊 فحص الجداول الأساسية:\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [table, description] of Object.entries(expectedTables)) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: غير موجود`);
        console.log(`   ${description}`);
        failCount++;
      } else {
        console.log(`✅ ${table}: موجود`);
        console.log(`   ${description}`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ ${table}: خطأ - ${err.message}`);
      failCount++;
    }
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('\n📈 النتائج:');
  console.log(`   ✅ موجود: ${successCount}/${Object.keys(expectedTables).length}`);
  console.log(`   ❌ مفقود: ${failCount}/${Object.keys(expectedTables).length}`);
  
  if (failCount === 0) {
    console.log('\n🎉 Schema جاهز بالكامل!');
    console.log('\n📋 الخطوات التالية:');
    console.log('   1. ملء جدول assessment_tools بالأدوات الـ14');
    console.log('   2. ملء جدول assessment_packages بالحزم الـ6');
    console.log('   3. ملء جدول assessment_questions بالأسئلة');
    console.log('   4. اختبار التسجيل والتقييمات');
  } else {
    console.log('\n⚠️  بعض الجداول مفقودة');
    console.log('💡 تأكد من تنفيذ rebuild-schema.sql في Supabase SQL Editor');
  }
  
  console.log('\n' + '=' .repeat(70));
  
  // فحص البيانات المرجعية
  console.log('\n📚 فحص البيانات المرجعية:\n');
  
  const referenceTables = ['countries', 'governorates', 'education_levels', 'education_grades'];
  
  for (const table of referenceTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: خطأ`);
      } else {
        console.log(`✅ ${table}: ${count} صف`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n' + '=' .repeat(70));
}

verifySchema()
  .then(() => {
    console.log('\n✅ انتهى الفحص');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });
