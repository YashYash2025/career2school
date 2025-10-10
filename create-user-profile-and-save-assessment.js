// ============================================================
// إنشاء user profile وحفظ تقييم RIASEC كامل
// ============================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// بيانات التقييم الكاملة
const assessmentData = {
  holland_code: 'RIS',
  raw_scores: {
    R: 48,
    I: 42,
    S: 35,
    A: 28,
    E: 22,
    C: 19
  },
  ranking: [
    { type: 'R', raw: 48, percentage: 80 },
    { type: 'I', raw: 42, percentage: 70 },
    { type: 'S', raw: 35, percentage: 58 },
    { type: 'A', raw: 28, percentage: 47 },
    { type: 'E', raw: 22, percentage: 37 },
    { type: 'C', raw: 19, percentage: 32 }
  ],
  confidence_score: 87,
  responses: generateResponses()
};

function generateResponses() {
  const responses = [];
  const patterns = {
    R: [5, 5, 4, 5, 4, 5, 4, 5, 5, 4],
    I: [5, 4, 5, 4, 4, 5, 4, 4, 5, 4],
    S: [4, 3, 4, 3, 4, 3, 4, 3, 3, 4],
    A: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2],
    E: [2, 2, 3, 2, 2, 2, 3, 2, 2, 3],
    C: [2, 2, 2, 3, 2, 2, 2, 2, 3, 2]
  };
  
  let questionId = 1;
  for (const [type, values] of Object.entries(patterns)) {
    values.forEach((value) => {
      responses.push({
        question_id: questionId++,
        dimension: type,
        answer_value: value,
        time_spent_seconds: Math.floor(Math.random() * 10) + 5
      });
    });
  }
  
  return responses;
}

async function createProfileAndSaveAssessment() {
  try {
    console.log('🚀 بدء العملية...\n');
    
    // 1. الحصول على أول مستخدم من auth.users
    console.log('👤 جاري البحث عن المستخدمين...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError || !users || users.length === 0) {
      console.error('❌ لا يوجد مستخدمين مسجلين');
      return;
    }
    
    const authUser = users[0];
    console.log('✅ تم العثور على مستخدم:');
    console.log('   User ID:', authUser.id);
    console.log('   Email:', authUser.email || 'لا يوجد');
    console.log('');
    
    // 2. التحقق من وجود profile
    console.log('🔍 جاري التحقق من الـ profile...');
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
    
    let userProfile;
    
    if (existingProfile) {
      console.log('✅ الـ profile موجود بالفعل');
      userProfile = existingProfile;
    } else {
      // 3. إنشاء profile جديد
      console.log('📝 جاري إنشاء profile جديد...');
      const profileData = {
        user_id: authUser.id,
        email: authUser.email || 'test@school2career.com',
        first_name: 'أحمد',
        last_name: 'محمد',
        user_type: 'student',
        preferred_language: 'ar',
        is_active: true
      };
      
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ خطأ في إنشاء الـ profile:', profileError);
        return;
      }
      
      console.log('✅ تم إنشاء الـ profile بنجاح');
      userProfile = newProfile;
    }
    
    console.log('   الاسم:', userProfile.full_name || (userProfile.first_name + ' ' + userProfile.last_name));
    console.log('');
    
    // 4. الحصول على tool_id
    console.log('🔍 جاري البحث عن RIASEC tool...');
    const { data: tool, error: toolError } = await supabase
      .from('assessment_tools')
      .select('id, name_ar')
      .limit(1)
      .single();
    
    if (toolError) {
      console.error('❌ خطأ في الحصول على tool:', toolError);
      return;
    }
    
    console.log('✅ تم العثور على tool:', tool.name_ar);
    console.log('   Tool ID:', tool.id);
    console.log('');
    
    // 5. إنشاء جلسة تقييم
    console.log('📝 جاري إنشاء جلسة التقييم...');
    const sessionData = {
      user_id: authUser.id,
      tool_id: tool.id,
      total_questions: 60,
      questions_answered: 60,
      is_completed: true,
      completed_at: new Date().toISOString(),
      time_spent_seconds: 1200,
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
    
    // 6. حفظ النتائج
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
      user_id: authUser.id,
      tool_id: tool.id,
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
    
    // 7. عرض ملخص النتائج
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 ملخص التقييم المحفوظ');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('👤 المستخدم:', userProfile.full_name || (userProfile.first_name + ' ' + userProfile.last_name));
    console.log('📧 البريد:', userProfile.email);
    console.log('🆔 User ID:', authUser.id);
    console.log('');
    console.log('🎯 Holland Code:', assessmentData.holland_code);
    console.log('📈 Confidence Score:', assessmentData.confidence_score + '%');
    console.log('');
    console.log('📊 النسب المئوية لكل نوع:');
    assessmentData.ranking.forEach(item => {
      const typeName = getTypeName(item.type);
      console.log(`   ${item.type} (${typeName}): ${item.percentage}% (${item.raw} نقطة)`);
    });
    console.log('');
    console.log('📅 تاريخ التقييم:', new Date().toLocaleString('ar-EG'));
    console.log('⏱️  الوقت المستغرق: 20 دقيقة');
    console.log('✅ عدد الأسئلة المجابة: 60/60');
    console.log('');
    console.log('💪 نقاط القوة:');
    getStrengths(assessmentData.ranking).forEach(s => console.log(`   • ${s}`));
    console.log('');
    console.log('📈 مجالات التطوير:');
    getWeaknesses(assessmentData.ranking).forEach(w => console.log(`   • ${w}`));
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
createProfileAndSaveAssessment();
