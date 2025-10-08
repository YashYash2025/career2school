const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addRIASECTool() {
  console.log('🎯 التحقق من أداة RIASEC_60_College...\n');
  
  // التحقق من وجود الأداة
  const { data: existingTool, error: checkError } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  if (existingTool) {
    console.log('⚠️  الأداة موجودة بالفعل!');
    console.log(`   ID: ${existingTool.id}`);
    console.log(`   Code: ${existingTool.code}`);
    console.log(`   Name (AR): ${existingTool.name_ar}`);
    
    // التحقق من عدد الأسئلة الموجودة
    const { count } = await supabase
      .from('assessment_questions')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', existingTool.id);
    
    console.log(`   الأسئلة الموجودة: ${count} سؤال\n`);
    
    if (count >= 60) {
      console.log('✅ الأداة والأسئلة موجودة بالكامل!\n');
      return existingTool;
    } else {
      console.log('⚠️  الأسئلة ناقصة، سيتم إضافة الباقي...\n');
      return existingTool;
    }
  }
  
  // إضافة الأداة إذا لم تكن موجودة
  console.log('📝 إضافة أداة جديدة...\n');
  
  const toolData = {
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
  };
  
  const { data: tool, error: toolError } = await supabase
    .from('assessment_tools')
    .insert(toolData)
    .select()
    .single();
  
  if (toolError) {
    console.error('❌ خطأ في إضافة الأداة:', toolError.message);
    return null;
  }
  
  console.log('✅ تم إضافة الأداة بنجاح!');
  console.log(`   ID: ${tool.id}`);
  console.log(`   Code: ${tool.code}`);
  console.log(`   Name (AR): ${tool.name_ar}\n`);
  
  return tool;
}

async function addRIASECQuestions(toolId) {
  console.log('📝 إضافة الأسئلة الـ60...\n');
  
  const questions = [];
  
  // قراءة ملف CSV
  return new Promise((resolve, reject) => {
    fs.createReadStream('New RIASEC/01-RIASEC_60_College.csv')
      .pipe(csv())
      .on('data', (row) => {
        // تخطي الصفوف الفارغة أو غير الصحيحة
        if (!row.ID || !row.Type || !row.Arabic_Text || !row.English_Text) {
          return;
        }
        
        // تحديد البعد (Dimension) بناءً على النوع
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
        
        // استخراج الرقم من ID (مثل R01 -> 1)
        const orderIndex = parseInt(row.ID.replace(/[A-Z]/g, ''));
        
        const question = {
          tool_id: toolId,
          question_ar: row.Arabic_Text.trim(),
          question_en: row.English_Text.trim(),
          question_fr: row.French_Text ? row.French_Text.trim() : '',
          question_type: 'likert_5',
          options: JSON.stringify({
            scale: 5,
            labels_ar: ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
            labels_en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
            labels_fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
            values: [1, 2, 3, 4, 5]
          }),
          dimension: dimensionMap[row.Type],
          subdimension: dimensionArabicMap[row.Type],
          weight: 1.0,
          order_index: orderIndex,
          is_reverse_scored: false
        };
        
        questions.push(question);
      })
      .on('end', async () => {
        console.log(`📊 تم قراءة ${questions.length} سؤال من الملف\n`);
        
        // إضافة الأسئلة على دفعات (10 في كل مرة)
        const batchSize = 10;
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < questions.length; i += batchSize) {
          const batch = questions.slice(i, i + batchSize);
          
          const { data, error } = await supabase
            .from('assessment_questions')
            .insert(batch)
            .select();
          
          if (error) {
            console.log(`❌ خطأ في الدفعة ${Math.floor(i / batchSize) + 1}:`, error.message);
            errorCount += batch.length;
          } else {
            console.log(`✅ تم إضافة الدفعة ${Math.floor(i / batchSize) + 1} (${data.length} أسئلة)`);
            successCount += data.length;
          }
          
          // تأخير صغير لتجنب Rate Limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('\n📈 النتائج:');
        console.log(`   ✅ نجح: ${successCount} سؤال`);
        console.log(`   ❌ فشل: ${errorCount} سؤال`);
        console.log(`   📊 المجموع: ${questions.length} سؤال`);
        
        resolve({ successCount, errorCount, total: questions.length });
      })
      .on('error', (error) => {
        console.error('❌ خطأ في قراءة الملف:', error);
        reject(error);
      });
  });
}

async function verifyData(toolId) {
  console.log('\n' + '='.repeat(60));
  console.log('\n🔍 التحقق من البيانات...\n');
  
  // التحقق من الأداة
  const { data: tool, error: toolError } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('id', toolId)
    .single();
  
  if (toolError) {
    console.log('❌ خطأ في التحقق من الأداة');
  } else {
    console.log('✅ الأداة موجودة:');
    console.log(`   Code: ${tool.code}`);
    console.log(`   Questions: ${tool.total_questions}`);
    console.log(`   Duration: ${tool.duration_minutes} دقيقة`);
  }
  
  // التحقق من الأسئلة
  const { data: questions, error: questionsError, count } = await supabase
    .from('assessment_questions')
    .select('*', { count: 'exact' })
    .eq('tool_id', toolId);
  
  if (questionsError) {
    console.log('\n❌ خطأ في التحقق من الأسئلة');
  } else {
    console.log(`\n✅ الأسئلة موجودة: ${count} سؤال`);
    
    // عرض توزيع الأسئلة حسب البعد
    const distribution = {};
    questions.forEach(q => {
      distribution[q.dimension] = (distribution[q.dimension] || 0) + 1;
    });
    
    console.log('\n📊 توزيع الأسئلة حسب البعد:');
    Object.entries(distribution).forEach(([dim, count]) => {
      console.log(`   ${dim}: ${count} سؤال`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

async function main() {
  console.log('🚀 إضافة RIASEC_60_College إلى قاعدة البيانات\n');
  console.log('='.repeat(60) + '\n');
  
  try {
    // 1. إضافة الأداة
    const tool = await addRIASECTool();
    
    if (!tool) {
      console.log('\n❌ فشل في إضافة الأداة. توقف.');
      return;
    }
    
    // 2. إضافة الأسئلة
    await addRIASECQuestions(tool.id);
    
    // 3. التحقق من البيانات
    await verifyData(tool.id);
    
    console.log('\n🎉 تم الانتهاء بنجاح!');
    console.log('\n📋 الخطوات التالية:');
    console.log('   1. إضافة باقي أدوات RIASEC (School, 180 Questions)');
    console.log('   2. إضافة باقي الأدوات الـ14');
    console.log('   3. إنشاء الحزم التقييمية (Packages)');
    console.log('   4. اختبار التقييم في التطبيق');
    
  } catch (error) {
    console.error('\n❌ خطأ عام:', error);
  }
}

main()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });
