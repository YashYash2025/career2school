import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    // 1. Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;

    console.log('📥 Get User Results Request:', { limit, offset });

    // 2. Get user from Supabase session
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

    if (authError || !user) {
      console.error('❌ Authentication error:', authError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'يرجى تسجيل الدخول لعرض النتائج',
          details: authError?.message || 'User not authenticated'
        },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // 3. Get total count
    const { count, error: countError } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('detailed_scores->assessment_type', 'is', null)
      .eq('detailed_scores->>assessment_type', 'RIASEC');

    if (countError) {
      console.error('❌ Count error:', countError);
    }

    // 4. Fetch user's RIASEC assessments
    const { data: assessments, error: fetchError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', user.id)
      .not('detailed_scores->assessment_type', 'is', null)
      .eq('detailed_scores->>assessment_type', 'RIASEC')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'حدث خطأ أثناء جلب البيانات',
          details: fetchError.message
        },
        { status: 500 }
      );
    }

    // 5. Transform data for frontend
    const transformedAssessments = assessments.map(assessment => {
      const detailed_scores = assessment.detailed_scores || {};
      const holland_code = detailed_scores.holland_code || '';
      const ranking = detailed_scores.ranking || [];
      const primary_type = ranking[0] || { type: holland_code[0], percentage: 0 };

      return {
        id: assessment.id,
        holland_code,
        raw_scores: detailed_scores.raw_scores || {},
        ranking,
        completed_date: assessment.created_at,
        confidence_score: detailed_scores.confidence_score || 0,
        primary_type: {
          type: primary_type.type,
          name: getTypeName(primary_type.type),
          percentage: primary_type.percentage,
          icon: getTypeIcon(primary_type.type)
        },
        profile_type: assessment.profile_type,
        profile_description: assessment.profile_description
      };
    });

    console.log(`✅ Found ${transformedAssessments.length} assessments`);

    return NextResponse.json({
      success: true,
      assessments: transformedAssessments,
      total: count || transformedAssessments.length,
      limit,
      offset
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
    R: 'الواقعي',
    I: 'الاستقصائي',
    A: 'الفني',
    S: 'الاجتماعي',
    E: 'المغامر',
    C: 'التقليدي'
  };
  return names[type] || type;
}

function getTypeIcon(type) {
  const icons = {
    R: '🔧',
    I: '🔬',
    A: '🎨',
    S: '🤝',
    E: '💼',
    C: '📊'
  };
  return icons[type] || '🎯';
}
