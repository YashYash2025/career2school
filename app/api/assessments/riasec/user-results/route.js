import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    console.log('📊 جلب نتائج RIASEC للمستخدم...');

    // 1. قراءة المعاملات من الـ URL
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📋 المعاملات:', { user_id, limit, offset });

    // 2. التحقق من صحة البيانات
    if (!user_id) {
      console.error('❌ معرف المستخدم مفقود');
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // 3. جلب التقييمات من قاعدة البيانات
    console.log('🔍 البحث في قاعدة البيانات...');
    
    const { data, error, count } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact' })
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'فشل جلب النتائج', 
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log(`✅ تم جلب ${data?.length || 0} تقييم`);

    // 4. معالجة البيانات وإضافة معلومات إضافية
    const assessments = (data || []).map(assessment => {
      const detailed_scores = assessment.detailed_scores || {};
      const holland_code = detailed_scores.holland_code || '';
      const ranking = detailed_scores.ranking || [];
      const primary_type = ranking.length > 0 ? ranking[0] : null;

      return {
        id: assessment.id,
        holland_code,
        raw_scores: detailed_scores.raw_scores || {},
        ranking,
        completed_date: assessment.created_at,
        confidence_score: detailed_scores.confidence_score || 0,
        primary_type: primary_type ? {
          type: primary_type.type,
          percentage: primary_type.percentage
        } : null
      };
    });

    // 5. إرجاع النتيجة
    return NextResponse.json({
      success: true,
      assessments,
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ في الخادم', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
