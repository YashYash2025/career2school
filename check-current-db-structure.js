const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStructure() {
  console.log('🔍 فحص بنية قاعدة البيانات الحالية...\n');
  
  // فحص جدول الأدوات
  console.log('=' .repeat(60));
  console.log('📋 جدول الأدوات (assessment_tools):');
  console.log('=' .repeat(60));
  
  const { data: tools, error: toolsError } = await supabase
    .from('assessment_tools')
    .select('*')
    .limit(5);
  
  if (toolsError) {
    console.log('❌ خطأ:', toolsError.message);
  } else {
    console.log(`✅ عدد الأدوات: ${tools?.length || 0}`);
    if (tools && tools.length > 0) {
      console.log('\nالأعمدة:', Object.keys(tools[0]));
      console.log('\nعينة من البيانات:');
      tools.forEach(tool => {
        console.log(`  - ${tool.name} (${tool.code})`);
      });
    }
  }
  
  // فحص جدول الأسئلة
  console.log('\n' + '=' .repeat(60));
  console.log('📋 جدول الأسئلة (assessment_questions):');
  console.log('=' .repeat(60));
  
  const { data: questions, error: questionsError } = await supabase
    .from('assessment_questions')
    .select('*')
    .limit(5);
  
  if (questionsError) {
    console.log('❌ خطأ:', questionsError.message);
  } else {
    console.log(`✅ عدد الأسئلة: ${questions?.length || 0}`);
    if (questions && questions.length > 0) {
      console.log('\nالأعمدة:', Object.keys(questions[0]));
      console.log('\nعينة من البيانات:');
      questions.slice(0, 3).forEach(q => {
        console.log(`  - السؤال ${q.question_number}: ${q.question_text_ar?.substring(0, 50)}...`);
        console.log(`    tool_id: ${q.tool_id}`);
      });
    }
  }
  
  // فحص جدول النتائج
  console.log('\n' + '=' .repeat(60));
  console.log('📋 جدول النتائج (assessment_results):');
  console.log('=' .repeat(60));
  
  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select('*')
    .limit(3);
  
  if (resultsError) {
    console.log('❌ خطأ:', resultsError.message);
  } else {
    console.log(`✅ عدد النتائج: ${results?.length || 0}`);
    if (results && results.length > 0) {
      console.log('\nالأعمدة:', Object.keys(results[0]));
    }
  }
  
  // فحص الجداول الأخرى
  console.log('\n' + '=' .repeat(60));
  console.log('📋 جداول أخرى:');
  console.log('=' .repeat(60));
  
  const tablesToCheck = [
    'riasec_recommendations',
    'riasec_careers',
    'career_paths'
  ];
  
  for (const table of tablesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table}: غير موجود`);
    } else {
      console.log(`✅ ${table}: موجود`);
    }
  }
}

checkStructure();
