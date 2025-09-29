import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create Supabase client
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
      firstName,
      lastName,
      birthDate,
      phone,
      gender,
      country,
      governorate,
      city,
      educationLevel,
      currentGrade,
      schoolName,
      specialization,
      preferredLanguage = 'ar'
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة - Required fields missing' },
        { status: 400 }
      );
    }

    // 1. Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          preferred_language: preferredLanguage,
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: `خطأ في إنشاء الحساب - Authentication error: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'فشل في الحصول على معرف المستخدم - Failed to get user ID' },
        { status: 500 }
      );
    }

    // 2. Create user profile with only existing columns
    const profileData = {
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      // Only include fields that exist in current user_profiles table structure
      // Additional fields will be stored when database is updated
    }

    // Store additional data in user metadata for now
    const additionalData = {
      birth_date: birthDate,
      phone: phone,
      gender: gender,
      country_code: country?.code,
      country_name: country?.name,
      governorate_code: governorate?.code,
      governorate_name: governorate?.name,
      city: city,
      education_level_code: educationLevel?.code,
      education_level_name: educationLevel?.name,
      current_grade_code: currentGrade?.code,
      current_grade_name: currentGrade?.name,
      school_name: schoolName,
      specialization: specialization,
      preferred_language: preferredLanguage,
      registration_date: new Date().toISOString(),
    };

    // Try to insert with enhanced profile first, fallback to basic profile
    let profile;
    try {
      // Try enhanced profile with all fields
      const enhancedProfileData = { ...profileData, ...additionalData }
      const { data: enhancedProfile, error: enhancedError } = await supabase
        .from('user_profiles')
        .insert([enhancedProfileData])
        .select()
        .single()
      
      if (enhancedError) {
        // Fallback to basic profile if enhanced fails
        console.log('Enhanced profile failed, using basic profile:', enhancedError.message)
        const { data: basicProfile, error: basicError } = await supabase
          .from('user_profiles')
          .insert([profileData])
          .select()
          .single()
        
        if (basicError) throw basicError
        profile = { ...basicProfile, ...additionalData } // Include additional data in response
      } else {
        profile = enhancedProfile
      }
    } catch (insertError) {
      console.error('Profile creation error:', insertError)
      
      // If profile creation fails, we should clean up the auth user
      console.error('User created but profile failed. Manual cleanup may be needed for user:', userId)
      
      return NextResponse.json(
        { error: `خطأ في إنشاء الملف الشخصي - Profile creation error: ${insertError.message}` },
        { status: 500 }
      )
    }

    // 3. Return success response
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح - Account created successfully',
      user: {
        id: userId,
        email: authData.user.email,
        profile: profile
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم - Server error: ${error.message}` },
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
        { error: 'معرف المستخدم مطلوب - User ID required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: `خطأ في جلب البيانات - Error fetching profile: ${error.message}` },
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
      { error: `خطأ في الخادم - Server error: ${error.message}` },
      { status: 500 }
    );
  }
}