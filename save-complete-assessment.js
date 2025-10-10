// ============================================================
// Script لحفظ تقييم RIASEC كامل مع كل التفاصيل
// ============================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// بيانات التقييم الكاملة
const assessmentData = {
  // Holland Code: RIS
  holland_code: 'RIS',
  
  // الدرجات الخام لكل نوع
  raw_scores: {
    R: 48,  // Realistic - الواقعي
    I: 42,  // Investigative - الاستقصائي
    S: 35,  // Social - الاجتماعي
    A: 28,  // Artistic - الفني
    E: 22,  // Enterprising - المغامر
    C: 19   // Conventional - التقليدي
  },
  
  // الترتيب مع النسب المئوية
  ranking: [
    { type: 'R', raw: 48, percentage: 80 },
    { type: 'I', raw: 42, percentage: 70 },
    { type: 'S', raw: 35, percentage: 58 },
    { type: 'A', raw: 28, percentage: 47 },
    { type: 'E', raw: 22, percentage: 37 },
    { type: 'C', raw: 19, percentage: 32 }
  ],
  
  // Confidence Score
  confidence_score: 87,
  
  // كل الإجابات (60 سؤال)
  responses: generateResponses()
};

// دالة لتوليد إجابات واقعية للـ 60 سؤال
function generateResponses() {
  const responses = [];
  
  // توزيع الإجابات بناءً على Holland Code: RIS
  const patterns = {
    R: [5, 5, 4, 5, 4, 5, 4, 5, 5, 4], // أسئلة R - إجابات عالية
    I: [5, 4, 5, 4, 4, 5, 4, 4, 5, 4], // أسئلة I - إجابات عالية
    S: [4, 3, 4, 3, 4, 3, 4, 3, 3, 4], // أسئلة S - إجابات متوسطة
    A: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2], // أسئلة A - إجابات منخفضة
    E: [2, 2, 3, 2, 2, 2, 3, 2, 2, 3], // أسئلة E - إجابات منخفضة
    C: [2, 2, 2, 3, 2, 2, 2, 2, 3, 2]  // أسئلة C - إجابات منخفضة
  };
  
  let questionId = 1;
  
  // توليد 60 إجابة
  for (const [type, values] of Object.entries(patterns)) {
    values.forEach((value, index) => {
      responses.push({
        question_id: questionId++,
        dimension: type,
        answer_value: value,
        time_spent_seconds: Math.floor(Math.random() * 10) + 5 // 5-15 ثانية
      });
    });
  }
  
  return responses;
}

async function saveCompleteAssessment() {
  try {
    console.log('🚀 بدء حفظ التقييم الكامل...\n');
    
    // 1. الحصول على المستخدم الحالي
    console.log('👤 جاري البحث عن المستخدم...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, email, full_name')
      .limit(1);
    
    if (profileError || !profiles || profiles.length === 0) {
      console.error('❌ خطأ في الحصول على المستخدم:', profileError);
      return;
    }
    
    const user = profiles[0];
    console.log('✅ تم العثور على المستخدم:', user.email);
    console.log('   الاسم:', user.full_name);
    console.log('   User ID:', user.user_id);
    console.log('');
    
    // 2. الحصول على tool_id لـ RIASEC
    console.log('🔍 جاري البحث عن RIASEC tool...');
    const { data: tools, error: toolError } = await supabase
      .from('assessment_tools')
      .select('id, name_ar')
      .eq('code', 'RIASEC')
      .single();
    
    if (toolError) {
      console.error('❌ خطأ في الحصول على tool_id:', toolError);
      return;
    }
    
    console.log('✅ تم العثور على RIASEC tool:', tools.name_ar);
    console.log('   Tool ID:', tools.id);
    console.log('');
    
    // 3. إنشاء جلسة تقييم
    console.log('📝 جاري إنشاء جلسة التقييم...');
    const sessionData = {
      user_id: user.user_id,
      tool_id: tools.id,
      total_questions: 60,
      questions_answered: 60,
      is_completed: true,
      completed_at: new Date().toISOString(),
      time_spent_seconds: 1200, // 20 دقيقة
      responses: assessmentData.responses,
      report_type: 'basic',
      credits_paid: 0
    };
    
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (sessionError) {
      console.error('❌ خطأ في إنشاء الجلسة:', sessionError);
      return;
    }
    
    console.log('✅ تم إنشاء الجلسة بنجاح');
    console.log('   Session ID:', session.id);
    console.log('');
    
    // 4. حفظ النتائج
    console.log('💾 جاري حفظ النتائج...');
    
    const detailed_scores = {
      assessment_type: 'RIASEC',
      holland_code: assessmentData.holland_code,
      raw_scores: assessmentData.raw_scores,
      ranking: assessmentData.ranking,
      confidence_score: assessmentData.confidence_score,
      completed_date: new Date().toISOString()
    };
    
    const resultData = {
      session_id: session.id,
      user_id: user.user_id,
      tool_id: tools.id,
      detailed_scores,
      raw_score: assessmentData.ranking[0].raw,
      percentage_score: assessmentData.ranking[0].percentage,
      profile_type: `${assessmentData.holland_code[0]} - ${getTypeName(assessmentData.holland_code[0])}`,
      profile_description: getTypeDescription(assessmentData.holland_code[0]),
      strengths: getStrengths(assessmentData.ranking),
      weaknesses: getWeaknesses(assessmentData.ranking),
      career_recommendations: [],
      is_public: false
    };
    
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .insert(resultData)
      .select()
      .single();
    
    if (resultError) {
      console.error('❌ خطأ في حفظ النتائج:', resultError);
      return;
    }
    
    console.log('✅ تم حفظ النتائج بنجاح!');
    console.log('   Result ID:', result.id);
    console.log('');
    
    // 5. عرض ملخص النتائج
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 ملخص التقييم المحفوظ');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('👤 المستخدم:', user.full_name);
    console.log('📧 البريد:', user.email);
    console.log('');
    console.log('🎯 Holland Code:', assessmentData.holland_code);
    console.log('📈 Confidence Score:', assessmentData.confidence_score + '%');
    console.log('');
    console.log('📊 النسب المئوية لكل نوع:');
    assessmentData.ranking.forEach(item => {
      console.log(`   ${item.type}: ${item.percentage}% (${item.raw} نقطة)`);
    });
    console.log('');
    console.log('📅 تاريخ التقييم:', new Date().toLocaleString('ar-EG'));
    console.log('⏱️  الوقت المستغرق: 20 دقيقة');
    console.log('✅ عدد الأسئلة المجابة: 60/60');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ تم حفظ التقييم بنجاح في قاعدة البيانات!');
    console.log('═══════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('💥 خطأ غير متوقع:', error);
  }
}

// Helper functions
function getTypeName(type) {
  const names = {
    R: 'الواقعي - العملي',
    I: 'الاستقصائي - التحليلي',
    A: 'الفني - الإبداعي',
    S: 'الاجتماعي - المساعد',
    E: 'المغامر - القيادي',
    C: 'التقليدي - المنظم'
  };
  return names[type] || type;
}

function getTypeDescription(type) {
  const descriptions = {
    R: 'تفضل العمل مع الأشياء المادية والأدوات والآلات. تميل للأنشطة العملية والتطبيقية.',
    I: 'تفضل التفكير والتحليل وحل المشكلات. تميل للأنشطة البحثية والعلمية.',
    A: 'تفضل التعبير الإبداعي والفني. تميل للأنشطة الفنية والتصميمية.',
    S: 'تفضل مساعدة الآخرين والعمل معهم. تميل للأنشطة الاجتماعية والتعليمية.',
    E: 'تفضل القيادة والإقناع. تميل للأنشطة الإدارية والتجارية.',
    C: 'تفضل التنظيم والدقة. تميل للأنشطة المكتبية والإدارية.'
  };
  return descriptions[type] || '';
}

function getStrengths(ranking) {
  return ranking.slice(0, 3).map(item => getTypeName(item.type));
}

function getWeaknesses(ranking) {
  return ranking.slice(-2).map(item => getTypeName(item.type));
}

// تشغيل السكريبت
saveCompleteAssessment();
