const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getToolsStats() {
  console.log('📊 إحصائيات أدوات التقييم\n');
  console.log('='.repeat(80) + '\n');
  
  // 1. جلب جميع الأدوات
  const { data: tools, error: toolsError } = await supabase
    .from('assessment_tools')
    .select('*')
    .order('code');
  
  if (toolsError) {
    console.error('❌ خطأ في جلب الأدوات:', toolsError.message);
    return;
  }
  
  if (!tools || tools.length === 0) {
    console.log('⚠️  لا توجد أدوات في قاعدة البيانات');
    return;
  }
  
  console.log(`✅ عدد الأدوات: ${tools.length}\n`);
  console.log('='.repeat(80) + '\n');
  
  // 2. لكل أداة، جلب الأسئلة والإحصائيات
  for (const tool of tools) {
    console.log(`📋 ${tool.name_ar}`);
    console.log(`   Code: ${tool.code}`);
    console.log(`   ID: ${tool.id}`);
    
    // جلب جميع الأسئلة
    const { data: questions, count, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*', { count: 'exact' })
      .eq('tool_id', tool.id);
    
    if (questionsError) {
      console.log(`   ❌ خطأ في جلب الأسئلة: ${questionsError.message}\n`);
      continue;
    }
    
    console.log(`   📊 إجمالي الأسئلة: ${count}`);
    
    if (count > 0) {
      // حساب التوزيع حسب البعد (Dimension)
      const dimensionCount = {};
      questions.forEach(q => {
        const dim = q.dimension || 'غير محدد';
        dimensionCount[dim] = (dimensionCount[dim] || 0) + 1;
      });
      
      console.log('   📈 التوزيع حسب البعد:');
      Object.entries(dimensionCount).sort().forEach(([dim, count]) => {
        const percentage = ((count / questions.length) * 100).toFixed(1);
        console.log(`      ${dim}: ${count} سؤال (${percentage}%)`);
      });
      
      // التحقق من نوع السؤال
      const questionTypes = {};
      questions.forEach(q => {
        const type = q.question_type || 'غير محدد';
        questionTypes[type] = (questionTypes[type] || 0) + 1;
      });
      
      console.log('   🔤 أنواع الأسئلة:');
      Object.entries(questionTypes).forEach(([type, count]) => {
        console.log(`      ${type}: ${count} سؤال`);
      });
      
      // التحقق من اللغات
      let hasArabic = 0, hasEnglish = 0, hasFrench = 0;
      questions.forEach(q => {
        if (q.question_ar && q.question_ar.trim()) hasArabic++;
        if (q.question_en && q.question_en.trim()) hasEnglish++;
        if (q.question_fr && q.question_fr.trim()) hasFrench++;
      });
      
      console.log('   🌐 اللغات المتوفرة:');
      console.log(`      العربية: ${hasArabic}/${count} (${((hasArabic/count)*100).toFixed(1)}%)`);
      console.log(`      الإنجليزية: ${hasEnglish}/${count} (${((hasEnglish/count)*100).toFixed(1)}%)`);
      console.log(`      الفرنسية: ${hasFrench}/${count} (${((hasFrench/count)*100).toFixed(1)}%)`);
    }
    
    console.log('\n' + '-'.repeat(80) + '\n');
  }
  
  // 3. ملخص عام
  console.log('='.repeat(80));
  console.log('\n📊 الملخص العام:\n');
  
  const { count: totalQuestions } = await supabase
    .from('assessment_questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   ✅ إجمالي الأدوات: ${tools.length}`);
  console.log(`   ✅ إجمالي الأسئلة: ${totalQuestions}`);
  console.log(`   ✅ متوسط الأسئلة لكل أداة: ${(totalQuestions / tools.length).toFixed(1)}`);
  
  console.log('\n' + '='.repeat(80));
}

getToolsStats()
  .then(() => {
    console.log('\n✅ انتهى الاستعلام');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ خطأ:', err);
    process.exit(1);
  });
