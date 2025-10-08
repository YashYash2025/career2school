import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      birth_date,
      gender,
      country_code,
      governorate_code,
      city,
      education_level_code,
      current_grade_code,
      school_name,
      specialization,
      preferred_language,
      user_type
    } = await request.json()

    console.log('📝 Registration data received:', {
      email,
      first_name,
      last_name,
      phone,
      birth_date,
      gender,
      country_code,
      governorate_code,
      city,
      education_level_code,
      current_grade_code,
      school_name,
      specialization,
      preferred_language,
      user_type
    })

    // التحقق من البيانات المطلوبة
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'البيانات الأساسية مطلوبة (الإيميل، كلمة المرور، الاسم الأول، الاسم الأخير)' },
        { status: 400 }
      )
    }

    console.log('🔐 Creating user account...')
    // إنشاء حساب المستخدم في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // تأكيد الإيميل تلقائياً
    })

    if (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json(
        { error: `خطأ في إنشاء الحساب: ${authError.message}` },
        { status: 400 }
      )
    }

    console.log('✅ User account created:', authData.user.id)

    console.log('👤 Creating user profile with new table structure...')
    
    // تحديد نوع المستخدم بناءً على المرحلة التعليمية والصف
    const determineUserType = (educationLevel, currentGrade) => {
      console.log('📋 تحديد نوع المستخدم - المرحلة:', educationLevel, 'الصف:', currentGrade)
      
      if (educationLevel === 'graduate') {
        // استخدم 'student' مؤقتاً لحد ما يتم تحديث قاعدة البيانات
        return 'student' // مؤقت - سيتم تحديثه لاحقاً
      } else if (educationLevel === 'university') {
        return 'student' // طالب جامعي
      } else if (educationLevel === 'high' || educationLevel === 'middle') {
        return 'student' // طالب مدرسة
      } else {
        return 'student' // default
      }
    }
    
    const finalUserType = user_type || determineUserType(education_level_code, current_grade_code)
    console.log('🏷️ نوع المستخدم النهائي:', finalUserType)
    
    // إنشاء الملف الشخصي باستخدام الجدول الجديد
    // إنشاء الملف الشخصي باستخدام الجدول الجديد
    const profileData = {
      user_id: authData.user.id,
      email,
      first_name,
      last_name,
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
      preferred_language: preferred_language || 'ar',
      user_type: finalUserType,
      is_active: true
    }
    
    // إضافة معلومات للاستخدام المستقبلي في bio
    if (education_level_code === 'graduate' && current_grade_code === 'exp') {
      profileData.bio = 'خريج ذو خبرة (أكثر من سنتين)';
    } else if (education_level_code === 'graduate' && current_grade_code === 'recent') {
      profileData.bio = 'خريج حديث (0-2 سنة)';
    }

    console.log('📋 Profile data to insert:', profileData)

    const { data: insertedProfile, error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      console.error('Error details:', JSON.stringify(profileError, null, 2))
      
      // حذف المستخدم من Auth إذا فشل إنشاء الملف الشخصي
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { 
          error: `خطأ في إنشاء الملف الشخصي: ${profileError.message}`,
          details: profileError
        },
        { status: 400 }
      )
    }

    console.log('✅ User profile created successfully:', insertedProfile)

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: insertedProfile
      }
    })

  } catch (error) {
    console.error('💥 Registration error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { 
        error: `خطأ في التسجيل: ${error.message}`,
        details: error
      },
      { status: 500 }
    )
  }
}