const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRecommendations() {
  console.log('🧪 اختبار API التوصيات');
  console.log('='.repeat(60));
  
  const testCases = [
    { code: 'RIS', region: 'Egypt', level: 'Work' },
    { code: 'RIS', region: 'Egypt', level: 'High' },
    { code: 'ISE', region: 'Egypt', level: 'Work' }
  ];
  
  for (const test of testCases) {
    console.log(`\n📊 اختبار: ${test.code} - ${test.region} - ${test.level}`);
    
    const { data, error } = await supabase
      .from('riasec_recommendations')
      .select('holland_code, region, education_level, recommendations_ar')
      .eq('holland_code', test.code)
      .eq('region', test.region)
      .eq('education_level', test.level)
      .single();
    
    if (error) {
      console.log('❌ خطأ:', error.message);
    } else {
      console.log('✅ البيانات موجودة');
      
      // استخراج الوظائف
      const jobs = data.recommendations_ar
        .split(/[؛;]/)
        .map(j => j.trim())
        .filter(j => j.length > 0);
      
      console.log(`📋 عدد الوظائف: ${jobs.length}`);
      console.log('أول 5 وظائف:');
      jobs.slice(0, 5).forEach((job, i) => {
        console.log(`  ${i + 1}. ${job}`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

testRecommendations();
