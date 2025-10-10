const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAllLevels() {
  // جلب كل المراحل العمرية
  const { data } = await supabase
    .from('riasec_recommendations')
    .select('education_level, region, holland_code, recommendations_ar')
    .limit(1000);

  const levels = [...new Set(data?.map(d => d.education_level))];
  const regions = [...new Set(data?.map(d => d.region))];
  
  console.log('📚 جميع المراحل العمرية:', levels);
  console.log('🌍 جميع المناطق:', regions);
  
  console.log('\n📊 توزيع البيانات:\n');
  
  for (const level of levels) {
    for (const region of regions) {
      const { count } = await supabase
        .from('riasec_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('education_level', level)
        .eq('region', region);
      
      console.log(`${level} - ${region}: ${count} سجل`);
    }
  }
  
  // عينة من Work level
  console.log('\n\n🔍 عينة من مستوى Work (الوظائف الفعلية):');
  console.log('='.repeat(70));
  
  const { data: workSamples } = await supabase
    .from('riasec_recommendations')
    .select('*')
    .eq('education_level', 'Work')
    .eq('region', 'Egypt')
    .limit(5);
  
  workSamples?.forEach((rec, idx) => {
    console.log(`\n${idx + 1}. Holland Code: ${rec.holland_code} (Rank: ${rec.code_rank})`);
    console.log(`   الوظائف بالعربي:`);
    const jobs = rec.recommendations_ar?.split('؛') || [];
    jobs.slice(0, 8).forEach((job, i) => {
      console.log(`   ${i + 1}. ${job.trim()}`);
    });
  });
}

getAllLevels();
