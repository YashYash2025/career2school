const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('🔍 التحقق من القيم في قاعدة البيانات...\n');
  
  const { data: tool } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  const { data: questions } = await supabase
    .from('assessment_questions')
    .select('id, question_type, options, order_index')
    .eq('tool_id', tool.id)
    .order('order_index')
    .limit(3);
  
  console.log('📊 أول 3 أسئلة:\n');
  
  questions.forEach((q, i) => {
    console.log(`${i + 1}. السؤال #${q.order_index}`);
    console.log(`   Type: ${q.question_type}`);
    console.log(`   Values: ${JSON.stringify(q.options.values)}`);
    console.log(`   Labels (AR): ${JSON.stringify(q.options.labels_ar)}`);
    console.log('');
  });
  
  // التحقق من القيم
  const firstQuestion = questions[0];
  const values = firstQuestion.options.values;
  
  if (JSON.stringify(values) === JSON.stringify([0, 0, 1])) {
    console.log('✅ القيم صحيحة: [0, 0, 1]');
  } else {
    console.log(`⚠️  القيم غير صحيحة: ${JSON.stringify(values)}`);
    console.log('   المتوقع: [0, 0, 1]');
  }
}

verify()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌', err);
    process.exit(1);
  });
