const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkRecommendations() {
  console.log('🔍 فحص جدول riasec_recommendations...\n');

  // جلب عينة من البيانات
  const { data, error, count } = await supabase
    .from('riasec_recommendations')
    .select('*', { count: 'exact' })
    .limit(5);

  if (error) {
    console.error('❌ خطأ:', error.message);
    return;
  }

  console.log(`📊 إجمالي السجلات: ${count}`);
  console.log('\n📋 عينة من البيانات:');
  console.log(JSON.stringify(data, null, 2));

  // فحص Holland Codes الموجودة
  const { data: codes } = await supabase
    .from('riasec_recommendations')
    .select('holland_code')
    .limit(100);

  const uniqueCodes = [...new Set(codes?.map(c => c.holland_code))];
  console.log('\n🎯 Holland Codes الموجودة:', uniqueCodes);
}

checkRecommendations();
