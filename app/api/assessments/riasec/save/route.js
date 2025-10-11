import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { holland_code, raw_scores, ranking, confidence_score } = body;

    console.log('📥 Save RIASEC Results Request - Full Body:', JSON.stringify(body, null, 2));
    console.log('📊 Holland Code:', holland_code);
    console.log('📊 Raw Scores:', raw_scores);
    console.log('📊 Ranking:', ranking);
    console.log('📊 Confidence Score:', confidence_score);

    // 2. Validate required fields
    if (!holland_code || !raw_scores || !ranking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'البيانات المطلوبة غير مكتملة',
          details: 'holland_code, raw_scores, and ranking are required'
        },
        { status: 400 }
      );
    }

    // 3. Get user from Supabase session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: request.headers.get('Authorization') || ''
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let userId = null;
    if (user) {
      userId = user.id;
      console.log('✅ User authenticated via token:', userId);
    } else {
      console.warn('⚠️ No authenticated user from token');
      if (authError) {
        console.error('⚠️ Auth error:', authError.message);
      }
      
      // Try to get user_id from request body as fallback
      if (body.user_id) {
        userId = body.user_id;
        console.log('✅ Using user_id from request body:', userId);
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'يرجى تسجيل الدخول لحفظ النتائج',
            details: 'User authentication required. Please login again.',
            code: 'AUTH_REQUIRED'
          },
          { status: 401 }
        );
      }
    }

    // 4. Prepare detailed_scores object
    const detailed_scores = {
      assessment_type: 'RIASEC',
      holland_code,
      raw_scores,
      ranking,
      confidence_score: confidence_score || 0
    };

    // 5. Extract primary type from ranking
    const primary_type = ranking[0]?.type || holland_code[0];
    const profile_type = `${primary_type} - ${getTypeName(primary_type)}`;

    // 6. Insert into assessment_results table
    const { data: result, error: insertError } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        tool_id: null, // Can be set if you have a tool_id for RIASEC
        session_id: null, // Can be set if you track sessions
        detailed_scores,
        raw_score: ranking[0]?.raw || 0,
        percentage_score: ranking[0]?.percentage || 0,
        profile_type,
        profile_description: getTypeDescription(primary_type),
        strengths: getStrengths(ranking),
        weaknesses: getWeaknesses(ranking),
        career_recommendations: [], // Will be populated later
        is_public: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'حدث خطأ أثناء حفظ البيانات',
          details: insertError.message
        },
        { status: 500 }
      );
    }

    console.log('✅ Assessment saved successfully:', result.id);

    return NextResponse.json({
      success: true,
      assessment_id: result.id,
      message: 'تم حفظ النتائج بنجاح'
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ غير متوقع',
        details: error.message
      },
      { status: 500 }
    );
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
  // Get top 3 types as strengths
  return ranking.slice(0, 3).map(item => getTypeName(item.type));
}

function getWeaknesses(ranking) {
  // Get bottom 2 types as areas for development
  return ranking.slice(-2).map(item => getTypeName(item.type));
}
