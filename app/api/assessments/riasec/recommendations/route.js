import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hollandCode = searchParams.get('code');
    const region = searchParams.get('region') || 'Egypt';
    const educationLevel = searchParams.get('level') || 'High';

    console.log('🔍 جلب التوصيات:', { hollandCode, region, educationLevel });

    if (!hollandCode) {
      return NextResponse.json(
        { error: 'Holland code is required' },
        { status: 400 }
      );
    }

    // جلب التوصيات من قاعدة البيانات
    const { data, error } = await supabase
      .from('riasec_recommendations')
      .select('*')
      .eq('holland_code', hollandCode)
      .eq('region', region)
      .eq('education_level', educationLevel)
      .single();

    if (error) {
      console.error('❌ خطأ في جلب التوصيات:', error);
      return NextResponse.json(
        { error: 'Recommendations not found', details: error.message },
        { status: 404 }
      );
    }

    console.log('✅ تم جلب التوصيات بنجاح');

    return NextResponse.json({
      success: true,
      recommendations: data
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
