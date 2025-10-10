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

    // جلب الوظائف من جدول riasec_careers
    const primaryType = hollandCode.charAt(0);
    
    const { data, error } = await supabase
      .from('riasec_careers')
      .select('*')
      .or(`holland_code.eq.${hollandCode},primary_type.eq.${primaryType}`)
      .eq('region', region)
      .order('match_percentage', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب الوظائف:', error);
      return NextResponse.json(
        { error: 'Careers not found', details: error.message },
        { status: 404 }
      );
    }

    console.log('✅ تم جلب ${data?.length || 0} وظيفة من قاعدة البيانات');

    // إزالة التكرار بناءً على اسم الوظيفة
    const uniqueCareers = [];
    const seenTitles = new Set();
    
    for (const career of data || []) {
      const title = career.career_title_ar.toLowerCase().trim();
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        uniqueCareers.push(career);
        
        // توقف عند 20 وظيفة فريدة
        if (uniqueCareers.length >= 20) break;
      }
    }

    console.log('✅ تم تصفية ${uniqueCareers.length} وظيفة فريدة');

    return NextResponse.json({
      success: true,
      recommendations: uniqueCareers
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
