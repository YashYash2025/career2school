import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء Supabase client مع service role key للعمليات الإدارية
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    console.log('💾 بدء حفظ نتائج RIASEC...');

    // 1. قراءة البيانات من الـ request
    const body = await request.json();
    const { user_id, holland_code, raw_scores, ranking, confidence_score } = body;

    console.log('📊 البيانات الواردة:', {
      user_id,
      holland_code,
      confidence_score,
      raw_scores_keys: raw_scores ? Object.keys(raw_scores) : null
    });

    // 2. التحقق من صحة البيانات
    if (!user_id) {
      console.error('❌ معرف المستخدم مفقود');
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    if (!holland_code) {
      console.error('❌ كود هولاند مفقود');
      return NextResponse.json(
        { success: false, error: 'كود هولاند مطلوب' },
        { status: 400 }
      );
    }

    if (!raw_scores || typeof raw_scores !== 'object') {
      console.error('❌ الدرجات الخام مفقودة أو غير صحيحة');
      return NextResponse.json(
        { success: false, error: 'الدرجات الخام مطلوبة' },
        { status: 400 }
      );
    }

    // 3. التحقق من authentication (optional - RLS will handle it)
    // يمكن إضافة تحقق إضافي هنا إذا لزم الأمر

    // 4. إعداد البيانات للحفظ
    const detailed_scores = {
      assessment_type: 'RIASEC',
      holland_code,
      raw_scores,
      ranking: ranking || [],
      confidence_score: confidence_score || 0
    };

    // استخراج النوع الأساسي من الترتيب
    const primary_type = ranking && ranking.length > 0 
      ? ranking[0].type 
      : holland_code.charAt(0);

    // حساب النسبة المئوية الإجمالية
    const percentage_score = confidence_score || 0;

    // 5. حفظ البيانات في قاعدة البيانات
    console.log('💾 حفظ في قاعدة البيانات...');
    
    const { data, error } = await supabaseAdmin
      .from('assessment_results')
      .insert({
        user_id,
        assessment_type: 'RIASEC',
        detailed_scores,
        percentage_score,
        profile_type: primary_type,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في حفظ البيانات:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'فشل حفظ النتائج', 
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log('✅ تم حفظ النتائج بنجاح:', data.id);

    // 6. إرجاع النتيجة
    return NextResponse.json({
      success: true,
      assessment_id: data.id,
      message: 'تم حفظ النتائج بنجاح'
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
