const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeRecommendations() {
  console.log('🔍 تحليل بنية جدول التوصيات...\n');
  
  // فحص جدول RIASEC recommendations
  console.log('=' .repeat(60));
  console.log('📋 جدول riasec_recommendations:');
  console.log('=' .repeat(60));
  
  const { data, error } = await supabase
    .from('riasec_recommendations')
    .select('*')
    .limit(3);
  
  if (error) {
    console.log('❌ خطأ:', error.message);
  } else {
    console.log(`✅ عدد السجلات: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('\n📊 الأعمدة:', Object.keys(data[0]));
      console.log('\n📋 عينة من البيانات:');
      data.forEach((rec, idx) => {
        console.log(`\n${idx + 1}. Holland Code: ${rec.holland_code}`);
        console.log(`   Region: ${rec.region}`);
        console.log(`   Education Level: ${rec.education_level}`);
        console.log(`   Code Rank: ${rec.code_rank}`);
        console.log(`   Recommendations AR: ${rec.recommendations_ar?.substring(0, 100)}...`);
      });
    }
  }
  
  // فحص جدول riasec_careers
  console.log('\n\n' + '=' .repeat(60));
  console.log('📋 جدول riasec_careers:');
  console.log('=' .repeat(60));
  
  const { data: careers, error: careersError } = await supabase
    .from('riasec_careers')
    .select('*')
    .limit(3);
  
  if (careersError) {
    console.log('❌ خطأ:', careersError.message);
  } else {
    console.log(`✅ عدد السجلات: ${careers?.length || 0}`);
    if (careers && careers.length > 0) {
      console.log('\n📊 الأعمدة:', Object.keys(careers[0]));
      console.log('\n📋 عينة من البيانات:');
      careers.forEach((career, idx) => {
        console.log(`\n${idx + 1}. Career: ${career.career_title_ar}`);
        console.log(`   Holland Code: ${career.holland_code}`);
        console.log(`   Primary Type: ${career.primary_type}`);
        console.log(`   Region: ${career.region}`);
        console.log(`   Match: ${career.match_percentage}%`);
      });
    }
  }
}

analyzeRecommendations();
