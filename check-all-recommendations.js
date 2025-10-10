// فحص كل التوصيات
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAll() {
  console.log('🔍 فحص جميع التوصيات...\n');
  
  const { data, error } = await supabase
    .from('riasec_recommendations')
    .select('*')
    .limit(10);
  
  if (error) {
    console.error('❌ خطأ:', error);
    return;
  }
  
  console.log(`📊 عدد السجلات: ${data.length}\n`);
  
  data.forEach((rec, i) => {
    console.log(`═══════════════════════════════════════════════════`);
    console.log(`سجل ${i + 1}:`);
    console.log(`   Holland Code: ${rec.holland_code}`);
    console.log(`   Region: ${rec.region}`);
    console.log(`   Education Level: ${rec.education_level}`);
    console.log(`   Recommendations (AR):`);
    console.log(`   ${rec.recommendations_ar}`);
    console.log('');
  });
}

checkAll();
