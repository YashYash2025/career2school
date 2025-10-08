const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🚀 إضافة RIASEC_60_School\n');
  console.log('='.repeat(60) + '\n');
  
  // 1. إضافة الأداة
  console.log('🎯 إضافة الأداة...\n');
  
  const { data: existingTool } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_SCHOOL')
    .single();
  
  let tool;
  
  if (existingTool) {
    console.log('⚠️  الأداة موجودة بالفعل');
    tool = existingTool;
  } else {
    const { data: newTool, error } = await supabase
      .from('assessment_tools')
      .insert({
        code: 'RIASEC_60_SCHOOL',
        name_ar: 'تقييم الميول المهنية RIASEC - نسخة المدرسة (60 سؤال)',
        name_en: 'RIASEC Career Interest Assessment - School Version (60 Questions)',
        name_fr: 'Évaluation des intérêts professionnels RIASEC - Version scolaire (60 questions)',
        description_ar: 'تقييم الميول المهنية بناءً على نظرية هولاند (RIASEC) لطلاب المدارس. يقيس 6 أنواع من الميول: الواقعي، الاستقصائي، الفني، الاجتماعي، المغامر، والتقليدي.',
        description_en: 'Career interest assessment based on Holland\'s RIASEC theory for school students. Measures 6 interest types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.',
        description_fr: 'Évaluation des intérêts professionnels basée sur la théorie RIASEC de Holland pour les élèves. Mesure 6 types d\'intérêts : Réaliste, Investigateur, Artistique, Social, Entreprenant et Conventionnel.',
        total_questions: 60,
        duration_minutes: 15,
        reliability_alpha: 0.85,
        source: 'O*NET Interest Profiler - Adapted for School Students',
        license_type: 'Public Domain',
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }
    
    tool = newTool;
    console.log('✅ تم إضافة الأداة');
  }
  
  console.log(`   ID: ${tool.id}`);
  console.log(`   Code: ${tool.code}\n`);
  
  // 2. حذف الأسئلة القديمة إن وجدت
  console.log('🗑️  حذف الأسئلة القديمة...\n');
  
  await supabase
    .from('assessment_questions')
    .delete()
    .eq('tool_id', tool.id);
  
  console.log('✅ تم الحذف\n');
  
  // 3. قراءة ملف CSV
  console.log('📖 قراءة ملف CSV...\n');
  
  const csvContent = fs.readFileSync('New RIASEC/02-RIASEC_60_School.csv', 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const dimensionMap = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional'
  };
  
  const dimensionArabicMap = {
    'R': 'الواقعي',
    'I': 'الاستقصائي',
    'A': 'الفني',
    'S': 'الاجتماعي',
    'E': 'المغامر',
    'C': 'التقليدي'
  };
  
  const questions = [];
  let orderCounter = 1;
  
  // تخطي السطر الأول (العناوين)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // تقسيم السطر مع مراعاة الفواصل داخل الاقتباسات
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
      const id = parts[0];
      const type = parts[1];
      const english = parts[2].replace(/^"|"$/g, '');
      const arabic = parts[3].replace(/^"|"$/g, '');
      const french = parts[4] ? parts[4].replace(/^"|"$/g, '') : '';
      
      if (id && type && english && arabic) {
        questions.push({
          tool_id: tool.id,
          question_ar: arabic,
          question_en: english,
          question_fr: french,
          question_type: 'like_dislike',
          options: {
            scale: 3,
            labels_ar: ['لا أحب', 'محايد', 'أحب'],
            labels_en: ['Dislike', 'Neutral', 'Like'],
            labels_fr: ['Je n\'aime pas', 'Neutre', 'J\'aime'],
            values: [0, 0, 1]
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
  
  console.log(`   عدد الأسئلة: ${questions.length}\n`);
  
  // 4. إضافة الأسئلة
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
    } else {
      console.log(`❌ سؤال ${i + 1}: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ تم إضافة ${successCount} سؤال\n`);
  
  // 5. التحقق
  console.log('='.repeat(60));
  console.log('\n🔍 التحقق النهائي...\n');
  
  const { data: allQuestions, count } = await supabase
    .from('assessment_questions')
    .select('*', { count: 'exact' })
    .eq('tool_id', tool.id);
  
  console.log(`✅ إجمالي الأسئلة: ${count}\n`);
  
  // توزيع حسب البعد
  const distribution = {};
  allQuestions.forEach(q => {
    distribution[q.dimension] = (distribution[q.dimension] || 0) + 1;
  });
  
  console.log('📊 التوزيع حسب البعد:');
  Object.entries(distribution).sort().forEach(([dim, count]) => {
    console.log(`   ${dim}: ${count} سؤال`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  if (count === 60) {
    console.log('\n🎉 تم الانتهاء بنجاح! جميع الأسئلة الـ60 موجودة');
    console.log('\n📋 ملخص:');
    console.log('   ✅ الأداة: RIASEC_60_SCHOOL');
    console.log('   ✅ الأسئلة: 60 سؤال');
    console.log('   ✅ اللغات: 3 (عربي، إنجليزي، فرنساوي)');
    console.log('   ✅ النوع: like_dislike');
    console.log('   ✅ القيم: [0, 0, 1]');
  } else {
    console.log(`\n⚠️  تحذير: عدد الأسئلة ${count} بدلاً من 60`);
  }
}

main()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ خطأ:', err);
    process.exit(1);
  });
