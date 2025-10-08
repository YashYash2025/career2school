const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function dropTables() {
  console.log('🗑️  حذف الجداول القديمة...\n');
  
  const tablesToDrop = [
    'user_achievements',
    'student_progress',
    'user_answers',
    'assessment_results',
    'career_recommendations',
    'assessment_sessions',
    'user_assessments',
    'assessment_progress',
    'assessment_questions',
    'payment_transactions',
    'subscriptions',
    'counselors',
    'students',
    'user_profiles',
    'users'
  ];
  
  for (const table of tablesToDrop) {
    try {
      // محاولة حذف الجدول
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error && !error.message.includes('does not exist')) {
        console.log(`⚠️  ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: تم التفريغ/الحذف`);
      }
    } catch (err) {
      console.log(`⚠️  ${table}: ${err.message}`);
    }
  }
  
  console.log('\n✅ تم حذف/تفريغ الجداول القديمة\n');
}

async function showInstructions() {
  console.log('=' .repeat(70));
  console.log('\n📋 تعليمات إعادة بناء Schema:\n');
  console.log('نظراً لقيود Supabase API، يجب تنفيذ SQL يدوياً:\n');
  console.log('1️⃣  افتح Supabase Dashboard:');
  console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '.supabase.co/project/_/sql')}`);
  console.log('\n2️⃣  اذهب إلى SQL Editor');
  console.log('\n3️⃣  افتح ملف: rebuild-schema.sql');
  console.log('\n4️⃣  انسخ المحتوى كاملاً');
  console.log('\n5️⃣  الصقه في SQL Editor');
  console.log('\n6️⃣  اضغط RUN');
  console.log('\n7️⃣  بعد الانتهاء، شغّل: node verify-schema.js');
  console.log('\n' + '='.repeat(70));
  console.log('\n💡 ملاحظة: الملف rebuild-schema.sql جاهز للتنفيذ');
  console.log('   يحتوي على:');
  console.log('   ✅ حذف الجداول القديمة');
  console.log('   ✅ إنشاء الجداول المحسّنة');
  console.log('   ✅ إضافة Triggers');
  console.log('   ✅ إضافة Indexes');
  console.log('   ✅ إنشاء Views');
  console.log('\n' + '='.repeat(70));
}

async function main() {
  console.log('🚀 School2Career - إعادة بناء Schema\n');
  console.log('=' .repeat(70) + '\n');
  
  // تفريغ الجداول أولاً
  await dropTables();
  
  // عرض التعليمات
  await showInstructions();
}

main()
  .then(() => {
    console.log('\n✅ جاهز للتنفيذ اليدوي');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });
