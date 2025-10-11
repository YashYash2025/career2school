import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileCode = searchParams.get('profile');

    if (!profileCode) {
      return NextResponse.json(
        { error: 'Profile code is required' },
        { status: 400 }
      );
    }

    console.log('🔍 جلب توصيات Big5 لـ:', profileCode);

    // جلب التوصيات من الجدول الموحد
    const { data, error } = await supabase
      .from('tool_recommendations')
      .select('*')
      .eq('tool_code', 'BIG5')
      .eq('profile_code', profileCode)
      .single();

    if (error || !data) {
      console.log('⚠️ لم يتم العثور على توصيات محددة، جلب توصيات عامة...');
      
      // محاولة جلب توصيات عامة بناءً على الأبعاد المرتفعة
      const { data: generalData } = await supabase
        .from('tool_recommendations')
        .select('*')
        .eq('tool_code', 'BIG5')
        .limit(5);
      
      if (generalData && generalData.length > 0) {
        // دمج التوصيات
        const combined = generalData.map(r => r.recommendations_ar).join('\n\n');
        return NextResponse.json({
          success: true,
          recommendations: combined
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'No recommendations found' },
        { status: 404 }
      );
    }

    console.log('✅ تم جلب التوصيات بنجاح');

    return NextResponse.json({
      success: true,
      recommendations: data.recommendations_ar,
      recommendations_en: data.recommendations_en,
      rank: data.rank,
      metadata: data.metadata
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
