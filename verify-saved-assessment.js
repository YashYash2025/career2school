// التحقق من التقييم المحفوظ
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyAssessment() {
  console.log('🔍 جاري التحقق من التقييم المحفوظ...\n');
  
  // 1. جلب النتيجة
  const { data: result, error: resultError } = await supabase
    .from('assessment_results')
    .select(`
      *,
      assessment_sessions (
        *
      )
    `)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (resultError) {
    console.error('❌ خطأ:', resultError);
    return;
  }
  
  console.log('═══════════════════════════════════════════════════');
  console.log('✅ تم العثور على التقييم المحفوظ');
  console.log('═══════════════════════════════════════════════════\n');
  
  console.log('📋 معلومات أساسية:');
  console.log('   Result ID:', result.id);
  console.log('   Session ID:', result.session_id);
  console.log('   User ID:', result.user_id);
  console.log('   Tool ID:', result.tool_id);
  console.log('');
  
  console.log('🎯 Holland Code:', result.detailed_scores.holland_code);
  console.log('📈 Confidence Score:', result.detailed_scores.confidence_score + '%');
  console.log('');
  
  console.log('📊 النسب المئوية لكل نوع:');
  result.detailed_scores.ranking.forEach(item => {
    console.log(`   ${item.type}: ${item.percentage}% (${item.raw} نقطة)`);
  });
  console.log('');
  
  console.log('📅 تاريخ التقييم:', new Date(result.created_at).toLocaleString('ar-EG'));
  console.log('');
  
  console.log('💪 نقاط القوة:');
  result.strengths.forEach(s => console.log(`   • ${s}`));
  console.log('');
  
  console.log('📈 مجالات التطوير:');
  result.weaknesses.forEach(w => console.log(`   • ${w}`));
  console.log('');
  
  console.log('📝 معلومات الجلسة:');
  if (result.assessment_sessions) {
    console.log('   عدد الأسئلة:', result.assessment_sessions.total_questions);
    console.log('   الأسئلة المجابة:', result.assessment_sessions.questions_answered);
    console.log('   الوقت المستغرق:', Math.floor(result.assessment_sessions.time_spent_seconds / 60), 'دقيقة');
    console.log('   عدد الإجابات المحفوظة:', result.assessment_sessions.responses?.length || 0);
    console.log('   مكتمل:', result.assessment_sessions.is_completed ? '✅ نعم' : '❌ لا');
  }
  console.log('');
  
  console.log('═══════════════════════════════════════════════════');
  console.log('✅ كل البيانات محفوظة بنجاح!');
  console.log('═══════════════════════════════════════════════════');
}

verifyAssessment();
