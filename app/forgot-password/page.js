'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase للواجهة الأمامية
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    
    try {
      console.log('📧 إرسال رابط إعادة تعيين كلمة المرور إلى:', email)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        console.error('❌ خطأ في إرسال بريد إعادة التعيين:', error.message)
        
        let errorMessage = 'حدث خطأ في إرسال بريد إعادة تعيين كلمة المرور'
        if (error.message.includes('Email not found')) {
          errorMessage = 'البريد الإلكتروني غير مسجل في النظام'
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'تم إرسال عدد كبير من الطلبات، يرجى المحاولة لاحقاً'
        }
        
        setMessage(errorMessage)
        setIsSuccess(false)
      } else {
        console.log('✅ تم إرسال بريد إعادة التعيين بنجاح')
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى فحص صندوق الوارد والرسائل الغير مرغوب فيها.')
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('❌ خطأ عام في إعادة تعيين كلمة المرور:', error)
      setMessage('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى')
      setIsSuccess(false)
    } finally {
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
            <Link href="/login">
              <button className="cta-button">تسجيل الدخول</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
              fontSize: '32px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              استعادة كلمة المرور
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleResetPassword}>
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

              {message && (
                <div style={{
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  background: isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  color: isSuccess ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {message}
                </div>
              )}

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
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال رابط الاستعادة'
                )}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                ✅
              </div>
              <p style={{
                color: 'var(--text-primary)',
                fontSize: '18px',
                marginBottom: '30px',
                lineHeight: '1.6'
              }}>
                {message}
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setMessage('')
                  setEmail('')
                }}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  color: 'var(--accent-purple)',
                  border: '2px solid var(--accent-purple)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--accent-purple)'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = 'var(--accent-purple)'
                }}
              >
                إرسال مرة أخرى
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              تذكرت كلمة المرور؟
            </p>
            <Link href="/login">
              <button style={{
                padding: '15px 30px',
                background: 'transparent',
                color: 'var(--accent-neon)',
                border: '2px solid var(--accent-neon)',
                borderRadius: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--accent-neon)'
                e.target.style.color = 'var(--dark-bg)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = 'var(--accent-neon)'
                e.target.style.transform = 'translateY(0)'
              }}>
                العودة لتسجيل الدخول
              </button>
            </Link>
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