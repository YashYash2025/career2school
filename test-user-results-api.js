// اختبار API user-results
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAPI() {
  console.log('🧪 اختبار API user-results...\n');
  
  const userId = 'b71b8fe8-18cb-436b-a60f-b739b0d243cf';
  
  // محاكاة ما يفعله الـ API
  console.log('1️⃣ البحث عن النتائج...');
  
  const { data: results, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('user_id', userId)
    .not('detailed_scores->assessment_type', 'is', null)
    .eq('detailed_scores->>assessment_type', 'RIASEC')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ خطأ:', error);
    return;
  }
  
  console.log(`✅ تم العثور على ${results.length} نتيجة\n`);
  
  if (results.length > 0) {
    console.log('📊 النتيجة الأولى:');
    const r = results[0];
    console.log(`   Holland Code: ${r.detailed_scores.holland_code}`);
    console.log(`   Confidence: ${r.detailed_scores.confidence_score}%`);
    console.log(`   التاريخ: ${new Date(r.created_at).toLocaleString('ar-EG')}`);
  }
}

testAPI();
