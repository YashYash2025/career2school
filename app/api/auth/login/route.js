import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء عميل Supabase مع صلاحيات كاملة
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    console.log('🔑 محاولة تسجيل دخول للمستخدم:', email);

    // تسجيل الدخول باستخدام Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      console.error('❌ خطأ في تسجيل الدخول:', authError.message);
      
      // رسائل خطأ مخصصة بالعربية
      let errorMessage = 'خطأ في تسجيل الدخول';
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'يرجى تأكيد بريدك الإلكتروني أولاً';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'عدد كبير من المحاولات، يرجى المحاولة لاحقاً';
      } else if (authError.message.includes('Refresh Token Not Found') || authError.message.includes('Invalid Refresh Token')) {
        errorMessage = 'انتهت صلاحية الجلسة بسبب مسح قاعدة البيانات. يرجى مسح localStorage وإعادة المحاولة';
        // مسح البيانات المحفوظة في الجلسة
        console.log('🧹 تم اكتشاف مشكلة refresh token - يجب مسح localStorage');
        
        return NextResponse.json(
          { 
            error: errorMessage, 
            code: authError.message,
            action: 'clear_storage',
            instructions: {
              ar: 'افتح Developer Tools (F12) واكتب: localStorage.clear(); sessionStorage.clear();',
              en: 'Open Developer Tools (F12) and run: localStorage.clear(); sessionStorage.clear();'
            }
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage, code: authError.message },
        { status: 401 }
      );
    }

    console.log('✅ تم تسجيل الدخول بنجاح للمستخدم:', authData.user.id);

    // جلب بيانات الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('⚠️ خطأ في جلب الملف الشخصي:', profileError.message);
      // لا نوقف العملية، نكمل بدون الملف الشخصي
    }

    console.log('👤 بيانات الملف الشخصي:', profile);

    // إعداد بيانات الاستجابة
    const responseData = {
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: profile || {
          full_name: authData.user.email.split('@')[0],
          first_name: '',
          last_name: '',
          email: authData.user.email
        }
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at
      }
    };

    console.log('📤 إرسال الاستجابة بنجاح');

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('❌ خطأ عام في تسجيل الدخول:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}

// معالجة طلبات GET للتحقق من حالة تسجيل الدخول
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'رمز المصادقة مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من صحة الرمز المميز
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'رمز المصادقة غير صحيح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // جلب بيانات الملف الشخصي
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profile: profile
      }
    });

  } catch (error) {
    console.error('❌ خطأ في التحقق من المصادقة:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}