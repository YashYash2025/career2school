const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeStructure() {
  console.log('🔍 تحليل بنية جدول riasec_recommendations...\n');

  // 1. فحص المراحل العمرية المتاحة
  const { data: levels } = await supabase
    .from('riasec_recommendations')
    .select('education_level');
  
  const uniqueLevels = [...new Set(levels?.map(l => l.education_level))];
  console.log('📚 المراحل العمرية المتاحة:', uniqueLevels);

  // 2. فحص المناطق الجغرافية
  const { data: regions } = await supabase
    .from('riasec_recommendations')
    .select('region');
  
  const uniqueRegions = [...new Set(regions?.map(r => r.region))];
  console.log('🌍 المناطق الجغرافية:', uniqueRegions);

  // 3. فحص Holland Codes
  const { data: codes } = await supabase
    .from('riasec_recommendations')
    .select('holland_code');
  
  const uniqueCodes = [...new Set(codes?.map(c => c.holland_code))];
  console.log('🎯 عدد Holland Codes:', uniqueCodes.length);
  console.log('🎯 أمثلة:', uniqueCodes.slice(0, 10));

  // 4. عينة من كل مرحلة عمرية
  console.log('\n📋 عينات من كل مرحلة:\n');
  
  for (const level of uniqueLevels) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📌 المرحلة: ${level}`);
    console.log('='.repeat(60));
    
    const { data: sample } = await supabase
      .from('riasec_recommendations')
      .select('*')
      .eq('education_level', level)
      .limit(2);
    
    sample?.forEach((rec, idx) => {
      console.log(`\n${idx + 1}. Holland Code: ${rec.holland_code}`);
      console.log(`   Region: ${rec.region}`);
      console.log(`   Code Rank: ${rec.code_rank}`);
      console.log(`   التوصيات بالعربي:`);
      console.log(`   ${rec.recommendations_ar?.substring(0, 200)}...`);
      console.log(`   التوصيات بالإنجليزي:`);
      console.log(`   ${rec.recommendations_en?.substring(0, 200)}...`);
    });
  }

  // 5. إحصائيات
  console.log('\n\n📊 إحصائيات عامة:');
  console.log('='.repeat(60));
  
  for (const level of uniqueLevels) {
    const { count } = await supabase
      .from('riasec_recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('education_level', level);
    
    console.log(`${level}: ${count} سجل`);
  }

  // 6. فحص عدد الوظائف في كل سجل
  console.log('\n\n🔢 تحليل عدد الوظائف في كل سجل:');
  console.log('='.repeat(60));
  
  const { data: allRecs } = await supabase
    .from('riasec_recommendations')
    .select('education_level, recommendations_ar')
    .limit(100);
  
  const jobCounts = {};
  allRecs?.forEach(rec => {
    const jobs = rec.recommendations_ar?.split('؛') || [];
    const level = rec.education_level;
    if (!jobCounts[level]) jobCounts[level] = [];
    jobCounts[level].push(jobs.length);
  });
  
  Object.entries(jobCounts).forEach(([level, counts]) => {
    const avg = (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    console.log(`${level}: متوسط ${avg} وظيفة (من ${min} إلى ${max})`);
  });
}

analyzeStructure();
