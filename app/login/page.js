'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useAppContext } from '../context/AppContext'

// إنشاء عميل Supabase للواجهة الأمامية
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { actions } = useAppContext()
  
  // Get redirect URL from query params
  const [redirectUrl, setRedirectUrl] = useState('/dashboard')
  
  // Extract redirect parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      if (redirect) {
        setRedirectUrl(decodeURIComponent(redirect))
        console.log('🔗 Redirect URL detected:', redirect)
      }
    }
  }, [])

  // دالة تسجيل الدخول بـ Google
  const handleGoogleLogin = async () => {
    alert('🚅 Google Login غير متاح حالياً. استخدم Facebook أو التسجيل العادي.')
  }

  // دالة تسجيل الدخول بـ Facebook (بدون email scope نهائياً)
  const handleFacebookLogin = async () => {
    alert('✅ Facebook Button تم الضغط عليه!')
    
    try {
      console.log('🔗 بداية Facebook Login (public_profile only)...')
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        alert('❌ Supabase URL غير معرف!')
        return
      }
      
      // مسح أي cache لـ Facebook في المتصفح
      if (window.FB) {
        window.FB.logout()
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`, // استخدام redirectUrl
          scopes: 'public_profile', // فقط public_profile بدون email
          queryParams: {
            scope: 'public_profile' // تأكيد إضافي
          }
        }
      })
      
      console.log('Facebook OAuth response:', { data, error })
      
      if (error) {
        console.error('❌ خطأ في Facebook OAuth:', error)
        alert('خطأ Facebook: ' + JSON.stringify(error, null, 2))
      } else {
        console.log('✅ Facebook OAuth نجح، جاري التوجيه...')
        alert('✅ جاري توجيهك لـ Facebook...')
      }
      
    } catch (error) {
      console.error('❌ خطأ عام في Facebook:', error)
      alert('حدث خطأ في Facebook Login: ' + error.message)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log('🔑 محاولة تسجيل الدخول...', { email })
      
      // إرسال طلب تسجيل الدخول للـ API الجديد
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('✅ تم تسجيل الدخول بنجاح:', result)
        
        // Set Supabase session first
        if (result.session?.access_token && result.session?.refresh_token) {
          console.log('🔐 Setting Supabase session...')
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token
          })
          
          if (sessionError) {
            console.error('❌ Error setting session:', sessionError)
          } else {
            console.log('✅ Supabase session set successfully')
          }
        }
        
        // حفظ بيانات المستخدم في localStorage
        const userData = {
          id: result.user.id,
          name: result.user.profile.full_name || result.user.profile.first_name + ' ' + result.user.profile.last_name || result.user.email.split('@')[0],
          email: result.user.email,
          profile: result.user.profile,
          token: result.session.access_token
        }
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('userToken', userData.token)
        
        // Update Context
        console.log('🔄 Updating Context with user data:', userData)
        actions.login(userData)
        
        alert('مرحباً بك مرة أخرى، ' + userData.name + '!')
        
        setIsLoading(false)
        console.log('🚀 Redirecting to:', redirectUrl)
        router.push(redirectUrl)
      } else {
        console.error('❌ فشل في تسجيل الدخول:', result)
        
        // التحقق من نوع الخطأ
        if (result.action === 'clear_storage') {
          // مسح بيانات الجلسة تلقائياً
          localStorage.clear()
          sessionStorage.clear()
          alert('تم مسح بيانات الجلسة المنتهية الصلاحية. يرجى المحاولة مرة أخرى.')
        } else {
          alert('خطأ في تسجيل الدخول: ' + (result.error || 'خطأ غير معروف'))
        }
        
        throw new Error(result.error || 'فشل في تسجيل الدخول')
      }
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول:', error)
      
      // التحقق من نوع الخطأ
      if (error.message.includes('refresh token') || error.message.includes('localStorage')) {
        // مسح بيانات الجلسة القديمة
        localStorage.clear()
        sessionStorage.clear()
        alert('تم مسح بيانات الجلسة القديمة. يرجى المحاولة مرة أخرى.')
      } else {
        alert('خطأ في تسجيل الدخول: ' + error.message)
      }
      
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animation"></div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <Link href="/" className="logo">School2Career</Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/assessments" className="nav-link">التقييمات</Link>
            <Link href="/careers" className="nav-link">المهن</Link>
            <Link href="/about" className="nav-link">عن المنصة</Link>
            <Link href="/signup">
              <button className="cta-button">إنشاء حساب</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 20px 40px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '25px',
          padding: '50px',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Card Background Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 0%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
            zIndex: -1
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              تسجيل الدخول
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              أهلاً بك مرة أخرى! سجل دخولك للمتابعة
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-neon)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 50px 15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-neon)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 255, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  style={{ 
                    marginLeft: '8px',
                    accentColor: 'var(--accent-neon)'
                  }} 
                />
                تذكرني
              </label>
              <Link 
                href="/forgot-password" 
                style={{ 
                  color: 'var(--accent-neon)', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                background: isLoading ? 'var(--text-secondary)' : 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginLeft: '10px'
                  }}></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              ليس لديك حساب؟
            </p>
            <Link href="/signup">
              <button style={{
                padding: '15px 30px',
                background: 'transparent',
                color: 'var(--accent-purple)',
                border: '2px solid var(--accent-purple)',
                borderRadius: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--accent-purple)'
                e.target.style.color = 'white'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = 'var(--accent-purple)'
                e.target.style.transform = 'translateY(0)'
              }}>
                إنشاء حساب جديد
              </button>
            </Link>
          </div>

          {/* Social Login (اختياري) */}
          <div style={{ 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--text-secondary)', 
              marginBottom: '20px' 
            }}>
              أو سجل دخولك باستخدام
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                type="button"
                onClick={handleFacebookLogin}
                style={{
                  width: '120px',
                  height: '50px',
                  background: '#1877f2',
                  border: 'none',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#166fe5'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1877f2'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
                title="تفعيل Facebook في Supabase Dashboard مطلوب"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button 
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '120px',
                  height: '50px',
                  background: '#fff',
                  border: '1px solid #dadce0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: '#3c4043',
                  fontWeight: '600',
                  fontSize: '14px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8f9fa'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
                title="تفعيل Google في Supabase Dashboard مطلوب"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
            
            {/* ملاحظة حول OAuth Providers */}
            <div style={{ 
              marginTop: '15px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                📧 لتفعيل تسجيل الدخول بهذه المواقع، يجب تفعيلها في 
                <br/>
                <strong>Supabase Dashboard → Authentication → Providers</strong>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}