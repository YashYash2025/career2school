import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء عميل Supabase مع صلاحيات كاملة
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId && !token) {
      return NextResponse.json(
        { error: 'معرف المستخدم أو رمز المصادقة مطلوب' },
        { status: 400 }
      );
    }

    let user = null;

    // إذا كان هناك رمز مصادقة، نستخدمه للحصول على بيانات المستخدم
    if (token) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !authUser) {
        return NextResponse.json(
          { error: 'رمز المصادقة غير صحيح أو منتهي الصلاحية' },
          { status: 401 }
        );
      }
      user = authUser;
    }

    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'لا يمكن تحديد هوية المستخدم' },
        { status: 400 }
      );
    }

    console.log('👤 جلب بيانات المستخدم:', targetUserId);

    // جلب بيانات الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (profileError) {
      console.error('❌ خطأ في جلب الملف الشخصي:', profileError.message);
      return NextResponse.json(
        { error: `خطأ في جلب بيانات المستخدم: ${profileError.message}` },
        { status: 404 }
      );
    }

    console.log('✅ تم جلب الملف الشخصي بنجاح');

    // جلب إحصائيات المستخدم (التقييمات المكتملة - مؤقتاً)
    // لاحقاً سنربطها بجدول النتائج الفعلي
    const mockAssessments = [
      {
        id: 1,
        title: 'تقييم RIASEC الدولي',
        completed_date: '2024-03-15',
        score: 85,
        status: 'completed',
        type: 'riasec'
      },
      {
        id: 2,
        title: 'تقييم الشخصية الخماسي',
        completed_date: '2024-03-10',
        score: 78,
        status: 'completed',
        type: 'big_five'
      },
      {
        id: 3,
        title: 'تقييم القيم المهنية',
        completed_date: '2024-03-05',
        score: 92,
        status: 'completed',
        type: 'work_values'
      }
    ];

    // حساب إحصائيات عامة
    const totalAssessments = mockAssessments.length;
    const averageScore = totalAssessments > 0 
      ? Math.round(mockAssessments.reduce((sum, assess) => sum + assess.score, 0) / totalAssessments)
      : 0;

    // توصيات مهنية مبنية على البيانات الشخصية (مؤقتاً)
    const mockRecommendations = [
      {
        id: 1,
        title: 'مطور برمجيات',
        match_percentage: 88,
        icon: '💻',
        description: 'بناءً على مهاراتك التقنية وتفضيلاتك',
        category: 'technology'
      },
      {
        id: 2,
        title: 'مهندس نظم',
        match_percentage: 82,
        icon: '⚙️',
        description: 'يناسب قدراتك التحليلية والتقنية',
        category: 'engineering'
      },
      {
        id: 3,
        title: 'مصمم واجهات',
        match_percentage: 75,
        icon: '🎨',
        description: 'يجمع بين الإبداع والتقنية',
        category: 'design'
      }
    ];

    // إعداد البيانات النهائية
    const responseData = {
      success: true,
      user: {
        id: profile.user_id,
        profile: profile,
        stats: {
          completed_assessments: totalAssessments,
          average_score: averageScore,
          total_recommendations: mockRecommendations.length,
          active_days: 15, // يمكن حسابها لاحقاً من جدول النشاط
          join_date: profile.created_at,
          last_activity: new Date().toISOString()
        },
        recent_assessments: mockAssessments,
        recommendations: mockRecommendations
      }
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('❌ خطأ عام في جلب بيانات المستخدم:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST endpoint لتحديث بيانات المستخدم
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    console.log('📝 تحديث بيانات المستخدم:', userId);

    // تحديث الملف الشخصي
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ خطأ في تحديث الملف الشخصي:', updateError.message);
      return NextResponse.json(
        { error: `خطأ في تحديث البيانات: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ تم تحديث الملف الشخصي بنجاح');

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      profile: updatedProfile
    }, { status: 200 });

  } catch (error) {
    console.error('❌ خطأ عام في تحديث بيانات المستخدم:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}