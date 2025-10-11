import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const toolCode = searchParams.get('tool_code');

    if (!toolCode) {
      return NextResponse.json(
        { error: 'tool_code is required' },
        { status: 400 }
      );
    }

    console.log('🔍 جلب أسئلة لـ:', toolCode);

    // جلب معلومات الأداة
    const { data: tool, error: toolError } = await supabase
      .from('assessment_tools')
      .select('id, code, name_ar, total_questions')
      .eq('code', toolCode)
      .single();

    if (toolError || !tool) {
      console.error('❌ خطأ في جلب الأداة:', toolError);
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    // جلب الأسئلة
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('tool_id', tool.id)
      .order('order_index', { ascending: true });

    if (questionsError) {
      console.error('❌ خطأ في جلب الأسئلة:', questionsError);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    console.log(`✅ تم جلب ${questions.length} سؤال`);

    return NextResponse.json({
      success: true,
      tool_id: tool.id,
      tool_code: tool.code,
      tool_name: tool.name_ar,
      total_questions: tool.total_questions,
      questions: questions
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
