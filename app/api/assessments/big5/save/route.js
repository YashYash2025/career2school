import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { tool_id, session_id, responses, results, duration } = body;

    console.log('💾 حفظ نتائج Big5...');

    // Get user from Supabase session
    const supabaseClient = createClient(
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
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
        // Return error if no user - assessment_results requires user_id
        return NextResponse.json(
          { 
            success: false, 
            error: 'يجب تسجيل الدخول لحفظ النتائج',
            details: 'User authentication required. Please login again.',
            code: 'AUTH_REQUIRED'
          },
          { status: 401 }
        );
      }
    }

    // Prepare data for insertion
    // Calculate average raw score for raw_score field (numeric)
    const rawScores = Object.values(results.raw_scores || {});
    const avgRawScore = rawScores.length > 0 
      ? rawScores.reduce((sum, score) => sum + (score.raw || 0), 0) / rawScores.length 
      : 0;
    
    const insertData = {
      user_id: userId,
      tool_id: tool_id,
      // session_id سيتم توليده تلقائياً من الـ database (UUID)
      raw_score: avgRawScore, // متوسط الدرجات الخام كرقم
      percentage_score: results.ranking[0]?.percentage || 0,
      detailed_scores: results, // الـ JSON الكامل
      profile_type: results.profile_name?.ar || results.profile_code || 'غير محدد',
      profile_description: results.summary || '',
      strengths: results.ranking?.slice(0, 3).map(r => r.name_ar) || [],
      weaknesses: results.ranking?.slice(-2).map(r => r.name_ar) || [],
      career_recommendations: results.recommended_tracks || [],
      is_public: false
    };

    console.log('📝 Data to insert:', {
      user_id: userId,
      tool_id: tool_id,
      profile_type: insertData.profile_type,
      percentage_score: insertData.percentage_score
    });

    // حفظ النتائج
    const { data, error } = await supabase
      .from('assessment_results')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في حفظ النتائج:', error);
      console.error('❌ Error details:', error.details);
      console.error('❌ Error hint:', error.hint);
      return NextResponse.json(
        { success: false, error: error.message, details: error.details },
        { status: 500 }
      );
    }

    console.log('✅ تم حفظ النتائج بنجاح، ID:', data.id);

    return NextResponse.json({
      success: true,
      result_id: data.id,
      message: 'تم حفظ النتائج بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
