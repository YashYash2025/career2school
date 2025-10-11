const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCounts() {
  console.log('🔍 فحص عدد السجلات...\n');
  
  // عدد السجلات في riasec_recommendations الأصلي
  const { count: originalCount } = await supabase
    .from('riasec_recommendations')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 riasec_recommendations (الأصلي): ${originalCount} سجل`);
  
  // عدد السجلات في tool_recommendations
  const { count: unifiedCount } = await supabase
    .from('tool_recommendations')
    .select('*', { count: 'exact', head: true })
    .eq('tool_code', 'RIASEC');
  
  console.log(`📊 tool_recommendations (RIASEC): ${unifiedCount} سجل`);
  
  // الفرق
  const diff = originalCount - unifiedCount;
  console.log(`\n⚠️  الفرق: ${diff} سجل`);
  
  if (diff > 0) {
    console.log(`\n❌ لم يتم نقل ${diff} سجل!`);
    console.log('💡 السبب المحتمل: خطأ في النقل أو تكرار في البيانات');
  } else {
    console.log('\n✅ تم نقل كل البيانات بنجاح!');
  }
  
  // التوزيع في الجدول الأصلي
  console.log('\n📊 التوزيع في riasec_recommendations:');
  const { data: originalDist } = await supabase
    .from('riasec_recommendations')
    .select('region, education_level')
    .limit(1000);
  
  const dist = {};
  originalDist?.forEach(rec => {
    const key = `${rec.region}-${rec.education_level}`;
    dist[key] = (dist[key] || 0) + 1;
  });
  
  Object.entries(dist).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });
}

checkCounts();
