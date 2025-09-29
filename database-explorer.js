// استكشاف قاعدة البيانات الحالية
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imobhmzywvzbvyqpzcau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb2JobXp5d3Z6YnZ5cXB6Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDkzNTEsImV4cCI6MjA3MjQyNTM1MX0.FpUXi86I-o38ecc0S1eJ6E2o1TRgYP-yNmOHqyYO3Pg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exploreDatabase() {
  console.log('🔍 استكشاف قاعدة البيانات...');
  
  // محاولة قراءة الجداول المختلفة
  const tables = [
    'user_profiles',
    'assessment_results', 
    'assessment_tools',
    'assessment_questions',
    'career_recommendations',
    'assessment_progress',
    'subscription_plans',
    'payment_transactions',
    'user_sessions',
    'users',
    'questions',
    'results',
    'tools',
    'assessments'
  ];
  
  for (let table of tables) {
    try {
      console.log(`\n📋 فحص جدول: ${table}`);
      
      // محاولة جلب أول صف لمعرفة البنية
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        console.log(`❌ جدول ${table} غير موجود أو لا يمكن الوصول إليه: ${error.message}`);
      } else {
        console.log(`✅ جدول ${table} موجود - عدد الصفوف: ${count}`);
        if (data && data.length > 0) {
          console.log(`🔧 أعمدة الجدول:`, Object.keys(data[0]));
          console.log(`📄 مثال على البيانات:`, data[0]);
        }
      }
    } catch (err) {
      console.log(`💥 خطأ في فحص ${table}:`, err.message);
    }
  }
  
  // فحص خاص لجدول الأسئلة
  console.log('\n🎯 فحص تفصيلي لأسئلة التقييمات...');
  
  try {
    const { data: tools, error: toolsError } = await supabase
      .from('assessment_tools')
      .select('*');
    
    if (!toolsError && tools) {
      console.log('🛠️ أدوات التقييم الموجودة:');
      tools.forEach(tool => {
        console.log(`- ${tool.code}: ${tool.name || 'بدون اسم'} (ID: ${tool.id})`);
      });
    }
  } catch (err) {
    console.log('❌ خطأ في قراءة أدوات التقييم:', err.message);
  }
  
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('tool_id, dimension, count(*)')
      .neq('tool_id', null);
    
    if (!questionsError && questions) {
      console.log('❓ توزيع الأسئلة:');
      questions.forEach(q => {
        console.log(`- Tool ID ${q.tool_id}: ${q.count} أسئلة`);
      });
    }
  } catch (err) {
    console.log('❌ خطأ في قراءة الأسئلة:', err.message);
  }
}

// تشغيل الاستكشاف
exploreDatabase().then(() => {
  console.log('\n✅ انتهى استكشاف قاعدة البيانات');
  process.exit(0);
}).catch(err => {
  console.error('💥 خطأ عام:', err);
  process.exit(1);
});