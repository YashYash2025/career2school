const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🚀 إضافة RIASEC_60_College\n');
  console.log('='.repeat(60) + '\n');
  
  // 1. التحقق من الأداة
  console.log('🎯 التحقق من الأداة...\n');
  
  let { data: tool, error } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  if (!tool) {
    console.log('📝 إضافة الأداة...\n');
    
    const { data: newTool, error: insertError } = await supabase
      .from('assessment_tools')
      .insert({
        code: 'RIASEC_60_COLLEGE',
        name_ar: 'تقييم الميول المهنية RIASEC - نسخة الجامعة (60 سؤال)',
        name_en: 'RIASEC Career Interest Assessment - College Version (60 Questions)',
        name_fr: 'Évaluation des intérêts professionnels RIASEC - Version universitaire (60 questions)',
        description_ar: 'تقييم الميول المهنية بناءً على نظرية هولاند (RIASEC) للطلاب الجامعيين. يقيس 6 أنواع من الميول: الواقعي، الاستقصائي، الفني، الاجتماعي، المغامر، والتقليدي.',
        description_en: 'Career interest assessment based on Holland\'s RIASEC theory for college students. Measures 6 interest types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.',
        description_fr: 'Évaluation des intérêts professionnels basée sur la théorie RIASEC de Holland pour les étudiants universitaires. Mesure 6 types d\'intérêts : Réaliste, Investigateur, Artistique, Social, Entreprenant et Conventionnel.',
        total_questions: 60,
        duration_minutes: 15,
        reliability_alpha: 0.85,
        source: 'O*NET Interest Profiler - Adapted for College Students',
        license_type: 'Public Domain',
        is_active: true
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ خطأ:', insertError.message);
      return;
    }
    
    tool = newTool;
    console.log('✅ تم إضافة الأداة');
  } else {
    console.log('✅ الأداة موجودة');
  }
  
  console.log(`   ID: ${tool.id}`);
  console.log(`   Code: ${tool.code}\n`);
  
  // 2. قراءة ملف CSV
  console.log('📖 قراءة ملف CSV...\n');
  
  const csvContent = fs.readFileSync('New RIASEC/01-RIASEC_60_College.csv', 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  console.log(`   عدد الأسطر: ${lines.length}\n`);
  
  // 3. تحويل CSV إلى أسئلة
  console.log('🔄 تحويل البيانات...\n');
  
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
      const arabic = parts[2].replace(/^"|"$/g, '');
      const english = parts[3].replace(/^"|"$/g, '');
      const french = parts[4] ? parts[4].replace(/^"|"$/g, '') : '';
      
      if (id && type && arabic && english) {
        const orderIndex = parseInt(id.replace(/[A-Z]/g, ''));
        
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
          order_index: orderIndex,
          is_reverse_scored: false
        });
      }
    }
  }
  
  console.log(`   عدد الأسئلة: ${questions.length}\n`);
  
  // 4. إضافة الأسئلة
  console.log('💾 إضافة الأسئلة إلى قاعدة البيانات...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // إضافة على دفعات
  const batchSize = 10;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .insert(batch)
      .select();
    
    if (error) {
      console.log(`❌ دفعة ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      errorCount += batch.length;
    } else {
      console.log(`✅ دفعة ${Math.floor(i / batchSize) + 1}: ${data.length} سؤال`);
      successCount += data.length;
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 النتائج:');
  console.log(`   ✅ نجح: ${successCount}`);
  console.log(`   ❌ فشل: ${errorCount}`);
  console.log(`   📈 المجموع: ${questions.length}`);
  
  // 5. التحقق
  console.log('\n' + '='.repeat(60));
  console.log('\n🔍 التحقق النهائي...\n');
  
  const { data: allQuestions, count } = await supabase
    .from('assessment_questions')
    .select('*', { count: 'exact' })
    .eq('tool_id', tool.id);
  
  console.log(`✅ إجمالي الأسئلة في قاعدة البيانات: ${count}\n`);
  
  // توزيع حسب البعد
  const distribution = {};
  allQuestions.forEach(q => {
    distribution[q.dimension] = (distribution[q.dimension] || 0) + 1;
  });
  
  console.log('📊 التوزيع حسب البعد:');
  Object.entries(distribution).forEach(([dim, count]) => {
    console.log(`   ${dim}: ${count} سؤال`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 تم الانتهاء بنجاح!');
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
