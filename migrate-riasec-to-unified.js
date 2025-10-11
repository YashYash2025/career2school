const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrateData() {
  console.log('🚀 بدء نقل بيانات RIASEC إلى الجدول الموحد...\n');

  // 1. جلب كل بيانات riasec_recommendations (بدون limit)
  console.log('📥 جلب بيانات RIASEC...');
  
  // جلب كل البيانات على دفعات
  let allData = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data: pageData, error: fetchError } = await supabase
      .from('riasec_recommendations')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (fetchError) {
      console.error('❌ خطأ في جلب البيانات:', fetchError.message);
      return;
    }
    
    if (!pageData || pageData.length === 0) break;
    
    allData = allData.concat(pageData);
    console.log(`  📥 تم جلب ${allData.length} سجل...`);
    
    if (pageData.length < pageSize) break;
    page++;
  }
  
  const riasecData = allData;
  const fetchError = null;

  if (fetchError) {
    console.error('❌ خطأ في جلب البيانات:', fetchError.message);
    return;
  }

  console.log(`✅ تم جلب ${riasecData.length} سجل\n`);

  // 2. تحويل البيانات للصيغة الموحدة
  console.log('🔄 تحويل البيانات للصيغة الموحدة...');
  const unifiedData = riasecData.map(rec => ({
    tool_code: 'RIASEC',
    profile_code: rec.holland_code,
    region: rec.region,
    education_level: rec.education_level,
    recommendations_ar: rec.recommendations_ar,
    recommendations_en: rec.recommendations_en,
    rank: rec.code_rank,
    metadata: {
      original_id: rec.id,
      source: 'riasec_recommendations',
      ...rec.metadata
    }
  }));

  console.log(`✅ تم تحويل ${unifiedData.length} سجل\n`);

  // 3. إدراج البيانات في الجدول الموحد
  console.log('💾 إدراج البيانات في tool_recommendations...');
  
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < unifiedData.length; i += batchSize) {
    const batch = unifiedData.slice(i, i + batchSize);
    
    const { error: insertError } = await supabase
      .from('tool_recommendations')
      .insert(batch);

    if (insertError) {
      console.error(`❌ خطأ في إدراج الدفعة ${Math.floor(i / batchSize) + 1}:`, insertError.message);
    } else {
      insertedCount += batch.length;
      console.log(`✅ تم إدراج ${insertedCount} / ${unifiedData.length} سجل`);
    }
  }

  console.log(`\n🎉 تم الانتهاء! إجمالي السجلات المنقولة: ${insertedCount}`);

  // 4. التحقق من البيانات
  console.log('\n🔍 التحقق من البيانات المنقولة...');
  const { count } = await supabase
    .from('tool_recommendations')
    .select('*', { count: 'exact', head: true })
    .eq('tool_code', 'RIASEC');

  console.log(`✅ إجمالي سجلات RIASEC في الجدول الموحد: ${count}`);

  // 5. عرض عينة
  const { data: sample } = await supabase
    .from('tool_recommendations')
    .select('*')
    .eq('tool_code', 'RIASEC')
    .limit(3);

  console.log('\n📋 عينة من البيانات المنقولة:');
  sample?.forEach((rec, idx) => {
    console.log(`\n${idx + 1}. Profile: ${rec.profile_code}`);
    console.log(`   Region: ${rec.region}`);
    console.log(`   Level: ${rec.education_level}`);
    console.log(`   Rank: ${rec.rank}`);
  });

  console.log('\n\n⚠️  ملاحظة: لم يتم حذف جدول riasec_recommendations بعد');
  console.log('   يمكنك حذفه يدوياً بعد التأكد من صحة البيانات');
}

migrateData();
