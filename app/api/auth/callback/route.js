import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    console.log('🔗 OAuth Callback - Code received:', code ? 'Yes' : 'No')
    
    if (code) {
      // استبدال الكود بجلسة مستخدم
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('❌ خطأ في تبديل الكود:', sessionError)
        return NextResponse.redirect(new URL('/login?error=oauth_error', request.url))
      }
      
      if (sessionData.session && sessionData.user) {
        console.log('✅ جلسة OAuth تم إنشاؤها بنجاح')
        console.log('👤 بيانات المستخدم:', sessionData.user)
        
        // استخراج البيانات من Facebook
        const user = sessionData.user
        const userMetadata = user.user_metadata || {}
        const identity = user.identities && user.identities.length > 0 ? user.identities[0] : {}
        
        // تحضير بيانات المستخدم (بدون email)
        const userData = {
          id: user.id,
          name: userMetadata.full_name || userMetadata.name || userMetadata.first_name || 'مستخدم Facebook',
          email: null, // لا نطلب email من Facebook
          provider: 'facebook',
          avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
          profile: {
            full_name: userMetadata.full_name || userMetadata.name,
            first_name: userMetadata.first_name,
            last_name: userMetadata.last_name,
            picture: userMetadata.avatar_url || userMetadata.picture
          },
          facebook_data: {
            sub: identity.id,
            provider_id: identity.identity_data?.sub,
            facebook_id: userMetadata.sub
          },
          token: sessionData.session.access_token
        }
        
        console.log('📋 بيانات المستخدم المعدة:', userData)
        
        // توجيه للوحة التحكم مع البيانات
        const dashboardUrl = new URL('/dashboard', request.url)
        dashboardUrl.searchParams.set('oauth_success', 'true')
        dashboardUrl.searchParams.set('user_data', JSON.stringify(userData))
        
        return NextResponse.redirect(dashboardUrl)
      }
    }
    
    // إذا لم تنجح العملية، توجيه للوحة التحكم العادية
    console.log('⚠️ لم يتم العثور على كود OAuth، توجيه عادي')
    return NextResponse.redirect(new URL('/dashboard', request.url))
    
  } catch (error) {
    console.error('❌ خطأ في OAuth callback:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}