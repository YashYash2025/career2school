import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    console.log('📡 جلب جميع نتائج المستخدم...');

    // Get user from Supabase session
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
          error: 'يرجى تسجيل الدخول',
          details: authError?.message || 'User not authenticated'
        },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Fetch all assessment results for this user
    const { data: results, error: fetchError } = await supabase
      .from('assessment_results')
      .select(`
        id,
        created_at,
        tool_id,
        detailed_scores,
        profile_type,
        profile_description,
        percentage_score,
        strengths,
        career_recommendations
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Database fetch error:', fetchError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'حدث خطأ أثناء جلب البيانات',
          details: fetchError.message
        },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${results?.length || 0} assessment results`);

    // Get tool information for each result
    const toolIds = [...new Set(results.map(r => r.tool_id).filter(Boolean))];
    
    let toolsMap = {};
    if (toolIds.length > 0) {
      const { data: tools } = await supabase
        .from('assessment_tools')
        .select('id, tool_code, tool_name_ar, tool_name_en, category')
        .in('id', toolIds);
      
      if (tools) {
        toolsMap = Object.fromEntries(tools.map(t => [t.id, t]));
      }
    }

    // Format results for display
    const formattedResults = results.map(result => {
      const tool = toolsMap[result.tool_id];
      const detailedScores = result.detailed_scores || {};
      
      // Determine assessment type and format accordingly
      let assessmentType = 'unknown';
      let displayData = {};

      // Check if it's RIASEC
      if (detailedScores.holland_code || detailedScores.assessment_type === 'RIASEC') {
        assessmentType = 'RIASEC';
        displayData = {
          holland_code: detailedScores.holland_code,
          primary_type: getPrimaryTypeInfo(detailedScores.holland_code?.[0]),
          confidence_score: detailedScores.confidence_score || 0,
          icon: '🎯'
        };
      }
      // Check if it's Big5
      else if (detailedScores.profile_code || detailedScores.profile_name) {
        assessmentType = 'Big5';
        displayData = {
          profile_code: detailedScores.profile_code,
          profile_name: detailedScores.profile_name?.ar || result.profile_type,
          top_trait: detailedScores.ranking?.[0],
          icon: '🧠'
        };
      }

      return {
        id: result.id,
        assessment_type: assessmentType,
        tool_name: tool?.tool_name_ar || 'تقييم',
        tool_code: tool?.tool_code,
        completed_date: result.created_at,
        profile_type: result.profile_type,
        profile_description: result.profile_description,
        percentage_score: result.percentage_score,
        strengths: result.strengths || [],
        career_recommendations: result.career_recommendations || [],
        display_data: displayData,
        detailed_scores: detailedScores
      };
    });

    return NextResponse.json({
      success: true,
      assessments: formattedResults,
      total: formattedResults.length
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

// Helper function to get RIASEC type info
function getPrimaryTypeInfo(typeCode) {
  const types = {
    R: { name: 'الواقعي - العملي', icon: '🔧', color: '#3b82f6' },
    I: { name: 'الاستقصائي - التحليلي', icon: '🔬', color: '#8b5cf6' },
    A: { name: 'الفني - الإبداعي', icon: '🎨', color: '#ec4899' },
    S: { name: 'الاجتماعي - المساعد', icon: '🤝', color: '#10b981' },
    E: { name: 'المغامر - القيادي', icon: '💼', color: '#f59e0b' },
    C: { name: 'التقليدي - المنظم', icon: '📋', color: '#6366f1' }
  };
  
  return types[typeCode] || { name: typeCode, icon: '📊', color: '#6b7280' };
}
