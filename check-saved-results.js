// فحص النتائج المحفوظة
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkResults() {
  console.log('🔍 فحص النتائج المحفوظة...\n');
  
  const { data: results, error } = await supabase
    .from('assessment_results')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ خطأ:', error);
    return;
  }
  
  console.log(`📊 عدد النتائج: ${results.length}\n`);
  
  results.forEach((r, i) => {
    console.log(`═══════════════════════════════════════════════════`);
    console.log(`نتيجة ${i + 1}:`);
    console.log(`   ID: ${r.id}`);
    console.log(`   User ID: ${r.user_id}`);
    console.log(`   Tool ID: ${r.tool_id}`);
    console.log(`   Session ID: ${r.session_id}`);
    console.log(`   Created: ${new Date(r.created_at).toLocaleString('ar-EG')}`);
    console.log(`\n   detailed_scores:`);
    console.log(JSON.stringify(r.detailed_scores, null, 2));
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════');
}

checkResults();
