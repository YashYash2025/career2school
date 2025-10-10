// إضافة أسئلة RIASEC بسرعة
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addQuestions() {
  try {
    console.log('🚀 إضافة أسئلة RIASEC...\n');
    
    // 1. الحصول على الأدوات
    const { data: tools, error: toolsError } = await supabase
      .from('assessment_tools')
      .select('*')
      .in('code', ['RIASEC_60_SCHOOL', 'RIASEC_60_COLLEGE']);
    
    if (toolsError || !tools || tools.length === 0) {
      console.error('❌ لم يتم العثور على الأدوات');
      return;
    }
    
    console.log(`✅ تم العثور على ${tools.length} أداة\n`);
    
    // 2. إضافة أسئلة College
    const collegeTool = tools.find(t => t.code === 'RIASEC_60_COLLEGE');
    if (collegeTool) {
      console.log('📚 إضافة أسئلة College...');
      await addQuestionsFromCSV(
        'New RIASEC/01-RIASEC_60_College.csv',
        collegeTool.id,
        'college'
      );
    }
    
    // 3. إضافة أسئلة School
    const schoolTool = tools.find(t => t.code === 'RIASEC_60_SCHOOL');
    if (schoolTool) {
      console.log('\n🎓 إضافة أسئلة School...');
      await addQuestionsFromCSV(
        'New RIASEC/02-RIASEC_60_School.csv',
        schoolTool.id,
        'school'
      );
    }
    
    console.log('\n✅ تم الانتهاء!');
    
  } catch (error) {
    console.error('💥 خطأ:', error);
  }
}

async function addQuestionsFromCSV(filePath, toolId, type) {
  return new Promise((resolve, reject) => {
    const questions = [];
    let rowCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        
        // Handle BOM in column names
        const id = row.ID || row['ï»¿ID'] || row['\ufeffID'];
        const type = row.Type;
        const arabicText = row.Arabic_Text;
        const englishText = row.English_Text;
        const frenchText = row.French_Text;
        
        // تخطي الصفوف الفارغة
        if (!id || !type || !arabicText || !englishText) {
          return;
        }
        
        const question = {
          tool_id: toolId,
          question_ar: arabicText.trim(),
          question_en: englishText.trim(),
          question_fr: (frenchText || englishText).trim(),
          question_type: 'likert_5',
          dimension: type.trim(),
          subdimension: null,
          weight: 1.0,
          order_index: rowCount,
          is_reverse_scored: false,
          options: {
            scale: 5,
            labels: {
              ar: ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'],
              en: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
              fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord']
            }
          }
        };
        
        questions.push(question);
      })
      .on('end', async () => {
        console.log(`   📊 تم قراءة ${questions.length} سؤال من ${rowCount} صف`);
        
        if (questions.length === 0) {
          console.log('   ⚠️  لم يتم قراءة أي أسئلة!');
          resolve();
          return;
        }
        
        // إضافة الأسئلة دفعة واحدة
        console.log('   💾 جاري الحفظ...');
        
        const { data, error } = await supabase
          .from('assessment_questions')
          .insert(questions)
          .select();
        
        if (error) {
          console.log('   ❌ خطأ في الحفظ:', error.message);
          reject(error);
        } else {
          console.log(`   ✅ تم حفظ ${data.length} سؤال بنجاح!`);
          resolve();
        }
      })
      .on('error', (error) => {
        console.error('   ❌ خطأ في قراءة الملف:', error);
        reject(error);
      });
  });
}

addQuestions();
