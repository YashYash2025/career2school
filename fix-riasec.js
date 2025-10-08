const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🔧 إصلاح RIASEC\n');
  
  const { data: tool } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  if (!tool) {
    console.log('❌ الأداة غير موجودة');
    return;
  }
  
  console.log(`✅ الأداة: ${tool.id}\n`);
  
  // حذف الأسئلة القديمة
  console.log('🗑️  حذف الأسئلة القديمة...');
  
  await supabase
    .from('assessment_questions')
    .delete()
    .eq('tool_id', tool.id);
  
  console.log('✅ تم الحذف\n');
  
  // قراءة CSV
  console.log('📖 قراءة CSV...\n');
  
  const csvContent = fs.readFileSync('New RIASEC/01-RIASEC_60_College.csv', 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const dimensionMap = {
    'R': 'Realistic', 'I': 'Investigative', 'A': 'Artistic',
    'S': 'Social', 'E': 'Enterprising', 'C': 'Conventional'
  };
  
  const dimensionArabicMap = {
    'R': 'الواقعي', 'I': 'الاستقصائي', 'A': 'الفني',
    'S': 'الاجتماعي', 'E': 'المغامر', 'C': 'التقليدي'
  };
  
  const questions = [];
  let orderCounter = 1;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    if (parts.length >= 4) {
      const type = parts[1];
      const arabic = parts[2].replace(/^"|"$/g, '');
      const english = parts[3].replace(/^"|"$/g, '');
      const french = parts[4] ? parts[4].replace(/^"|"$/g, '') : '';
      
      if (type && arabic && english) {
        questions.push({
          tool_id: tool.id,
          question_ar: arabic,
          question_en: english,
          question_fr: french,
          question_type: 'likert_5',
          options: {
            scale: 5,
            labels_ar: ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
            labels_en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
            labels_fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
            values: [1, 2, 3, 4, 5]
          },
          dimension: dimensionMap[type],
          subdimension: dimensionArabicMap[type],
          weight: 1.0,
          order_index: orderCounter++,
          is_reverse_scored: false
        });
      }
    }
  }
  
  console.log(`عدد الأسئلة: ${questions.length}\n`);
  console.log('💾 إضافة الأسئلة...\n');
  
  let successCount = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const { error } = await supabase
      .from('assessment_questions')
      .insert(questions[i]);
    
    if (!error) {
      successCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1} سؤال`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ تم إضافة ${successCount} سؤال\n`);
  
  // التحقق
  const { count } = await supabase
    .from('assessment_questions')
    .select('*', { count: 'exact', head: true })
    .eq('tool_id', tool.id);
  
  console.log(`📊 المجموع: ${count} سؤال`);
  
  if (count === 60) {
    console.log('\n🎉 نجح!');
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('❌', err);
  process.exit(1);
});
