import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      email,
      password,
      first_name,
      last_name,
      birth_date,
      phone,
      gender,
      country_code,
      governorate_code,
      city,
      education_level_code,
      current_grade_code,
      school_name,
      specialization,
      preferred_language = 'ar'
    } = body;

    console.log('📨 بيانات التسجيل الواردة:', body)

    // التحقق من البيانات المطلوبة
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة - الإيميل وكلمة المرور والاسم الأول والأخير مطلوبة' },
        { status: 400 }
      );
    }

    // 1. إنشاء حساب المستخدم في Auth
    console.log('🔐 إنشاء حساب Auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: first_name,
          last_name: last_name,
          preferred_language: preferred_language,
        }
      }
    });

    if (authError) {
      console.error('❌ خطأ في Auth:', authError);
      return NextResponse.json(
        { error: `خطأ في إنشاء الحساب: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'فشل في الحصول على معرف المستخدم' },
        { status: 500 }
      );
    }

    console.log('✅ تم إنشاء حساب Auth بنجاح:', userId)

    // 2. إنشاء الملف الشخصي في الجدول الجديد
    console.log('👤 إنشاء الملف الشخصي...')
    
    const profileData = {
      user_id: userId,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone: phone || null,
      birth_date: birth_date || null,
      gender: gender || null,
      country_code: country_code || null,
      governorate_code: governorate_code || null,
      city: city || null,
      education_level_code: education_level_code || null,
      current_grade_code: current_grade_code || null,
      school_name: school_name || null,
      specialization: specialization || null,
      preferred_language: preferred_language
    }
    
    console.log('📝 بيانات الملف الشخصي:', profileData)
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single()
    
    if (profileError) {
      console.error('❌ خطأ في إنشاء الملف الشخصي:', profileError)
      
      // محاولة تنظيف حساب Auth إذا فشل الملف الشخصي
      console.log('🧹 محاولة حذف حساب Auth بسبب فشل الملف الشخصي...')
      
      return NextResponse.json(
        { 
          error: `خطأ في إنشاء الملف الشخصي: ${profileError.message}`,
          hint: 'تأكد من أن جدول user_profiles تم إنشاؤه بالتركيبة الصحيحة'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ تم إنشاء الملف الشخصي بنجاح:', profile)

    // 3. إرجاع النتيجة النهائية
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح!',
      user: {
        id: userId,
        email: authData.user.email,
        profile: profile
      },
      token: authData.session?.access_token || null
    }, { status: 201 });

  } catch (error) {
    console.error('❌ خطأ عام في التسجيل:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: `خطأ في جلب البيانات: ${error.message}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}