const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearTables() {
  console.log('🗑️  بدء تفريغ الجداول...\n');

  // الجداول اللي هنفضيها (مش البيانات المرجعية)
  const tablesToClear = [
    'user_profiles',
    'assessment_tools',
    'career_paths',
    'majors',
    'pricing_packages',
    'subscription_plans',
    'achievements',
    'resources'
  ];

  // البيانات المرجعية اللي هنسيبها (مهمة)
  const referenceDataToKeep = [
    'countries',
    'governorates', 
    'education_levels',
    'education_grades'
  ];

  console.log('📋 الجداول اللي هيتم تفريغها:');
  tablesToClear.forEach(t => console.log(`   - ${t}`));
  
  console.log('\n✅ الجداول اللي هتفضل (بيانات مرجعية):');
  referenceDataToKeep.forEach(t => console.log(`   - ${t}`));
  
  console.log('\n' + '='.repeat(60) + '\n');

  for (const table of tablesToClear) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف كل الصفوف

      if (error) {
        console.log(`❌ ${table}: فشل - ${error.message}`);
      } else {
        console.log(`✅ ${table}: تم التفريغ`);
      }
    } catch (err) {
      console.log(`⚠️  ${table}: خطأ - ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ تم تفريغ الجداول بنجاح!');
  console.log('📊 البيانات المرجعية محفوظة (countries, governorates, education_levels, education_grades)');
}

clearTables()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });
