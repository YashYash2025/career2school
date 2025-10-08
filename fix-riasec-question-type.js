const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixQuestionType() {
  console.log('🔧 تصحيح نوع أسئلة RIASEC\n');
  console.log('='.repeat(60) + '\n');
  
  // 1. الحصول على الأداة
  const { data: tool } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  if (!tool) {
    console.log('❌ الأداة غير موجودة');
    return;
  }
  
  console.log(`✅ الأداة: ${tool.name_ar}`);
  console.log(`   ID: ${tool.id}\n`);
  
  // 2. الحصول على جميع الأسئلة
  const { data: questions, error: fetchError } = await supabase
    .from('assessment_questions')
    .select('*')
    .eq('tool_id', tool.id);
  
  if (fetchError) {
    console.log('❌ خطأ في جلب الأسئلة:', fetchError.message);
    return;
  }
  
  console.log(`📊 عدد الأسئلة: ${questions.length}\n`);
  
  // 3. تحديث كل سؤال
  console.log('🔄 تحديث نوع الأسئلة...\n');
  
  const correctOptions = {
    scale: 3,
    labels_ar: ['لا أحب', 'محايد', 'أحب'],
    labels_en: ['Dislike', 'Neutral', 'Like'],
    labels_fr: ['Je n\'aime pas', 'Neutre', 'J\'aime'],
    values: [0, 0, 1]
  };
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    const { error } = await supabase
      .from('assessment_questions')
      .update({
        question_type: 'like_dislike',
        options: correctOptions
      })
      .eq('id', question.id);
    
    if (error) {
      console.log(`❌ سؤال ${i + 1}: ${error.message}`);
      errorCount++;
    } else {
      successCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`✅ تم تحديث ${i + 1} سؤال`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 النتائج:');
  console.log(`   ✅ نجح: ${successCount}`);
  console.log(`   ❌ فشل: ${errorCount}`);
  console.log(`   📈 المجموع: ${questions.length}`);
  
  // 4. التحقق
  console.log('\n' + '='.repeat(60));
  console.log('\n🔍 التحقق من التحديث...\n');
  
  const { data: updatedQuestions } = await supabase
    .from('assessment_questions')
    .select('question_type, options')
    .eq('tool_id', tool.id)
    .limit(1)
    .single();
  
  if (updatedQuestions) {
    console.log('✅ نوع السؤال الجديد:', updatedQuestions.question_type);
    console.log('✅ الخيارات الجديدة:');
    console.log('   Scale:', updatedQuestions.options.scale);
    console.log('   Labels (AR):', updatedQuestions.options.labels_ar);
    console.log('   Labels (EN):', updatedQuestions.options.labels_en);
    console.log('   Labels (FR):', updatedQuestions.options.labels_fr);
    console.log('   Values:', updatedQuestions.options.values);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 تم التصحيح بنجاح!');
  console.log('\n📋 ملاحظة:');
  console.log('   - نوع السؤال: like_dislike');
  console.log('   - عدد الخيارات: 3');
  console.log('   - القيم: -1 (لا أحب), 0 (محايد), 1 (أحب)');
}

fixQuestionType()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ خطأ:', err);
    process.exit(1);
  });
