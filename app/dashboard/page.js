'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function DashboardContent() {
  const [user, setUser] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // تعامل مع تغيير حالة المصادقة مع Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session)
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ تم تسجيل الدخول بنجاح!')
          
          const user = session.user
          const userMetadata = user.user_metadata || {}
          
          // إعداد بيانات المستخدم من Facebook
          const realUserData = {
            id: user.id,
            name: userMetadata.full_name || userMetadata.name || userMetadata.first_name || 'مستخدم Facebook',
            email: null, // لا نطلب email من Facebook
            provider: user.app_metadata?.provider || 'facebook',
            avatar_url: userMetadata.avatar_url || userMetadata.picture,
            profile: {
              full_name: userMetadata.full_name || userMetadata.name,
              first_name: userMetadata.first_name,
              last_name: userMetadata.last_name,
              picture: userMetadata.avatar_url || userMetadata.picture
            },
            stats: {
              completed_assessments: 0,
              average_score: 0,
              total_recommendations: 0,
              active_days: 1,
              join_date: new Date().toISOString().split('T')[0]
            },
            token: session.access_token
          }
          
          console.log('📅 بيانات المستخدم الحقيقية:', realUserData)
          
          // حفظ في localStorage وتعيين الحالة
          localStorage.setItem('userData', JSON.stringify(realUserData))
          localStorage.setItem('userToken', realUserData.token)
          setUser(realUserData)
          
          alert(`مرحباً بك ${realUserData.name}! تم تسجيل الدخول بنجاح عبر ${realUserData.provider}`)
        }
      }
    )
    
    // تنظيف subscription عند إلغاء الcomponent
    return () => subscription.unsubscribe()
  }, [])
  
  useEffect(() => {
    // تحميل بيانات المستخدم عند بدء التشغيل
    const loadInitialData = async () => {
      // تحقق من وجود جلسة نشطة
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session && session.user) {
        console.log('🔍 تم العثور على جلسة نشطة')
        // سيتم معالجتها في onAuthStateChange
      } else {
        // تحقق من localStorage
        const storedUserData = localStorage.getItem('userData')
        if (storedUserData) {
          const userData = JSON.parse(storedUserData)
          console.log('📋 تم تحميل بيانات المستخدم من localStorage:', userData)
          setUser(userData)
        } else {
          console.log('⚠️ لا توجد بيانات محفوظة')
          // بيانات تجريبية فقط كملاذ أخير
          const demoUserData = {
            id: 'demo_user_' + Date.now(),
            name: "مستخدم تجريبي",
            email: "demo@school2career.com",
            provider: "demo",
            stats: {
              completed_assessments: 0,
              average_score: 0,
              total_recommendations: 0,
              active_days: 1,
              join_date: new Date().toISOString().split('T')[0]
            }
          }
          setUser(demoUserData)
        }
      }
    }
    
    loadInitialData()
    // معالجة OAuth success data
    const handleOAuthSuccess = () => {
      const oauthSuccess = searchParams.get('oauth_success')
      const userDataParam = searchParams.get('user_data')
      
      if (oauthSuccess === 'true' && userDataParam) {
        try {
          const oauthUserData = JSON.parse(userDataParam)
          console.log('✅ بيانات OAuth:', oauthUserData)
          
          // حفظ بيانات OAuth في localStorage
          localStorage.setItem('userData', JSON.stringify(oauthUserData))
          localStorage.setItem('userToken', oauthUserData.token)
          
          setUser(oauthUserData)
          
          // مسح parameters من URL
          const url = new URL(window.location)
          url.searchParams.delete('oauth_success')
          url.searchParams.delete('user_data')
          window.history.replaceState({}, '', url)
          
          alert(`مرحباً بك ${oauthUserData.name}! تم تسجيل الدخول بنجاح عبر ${oauthUserData.provider}`)
          return true
        } catch (error) {
          console.error('❌ خطأ في معالجة OAuth data:', error)
        }
      }
      return false
    }

    // جلب بيانات المستخدم
    const loadUserData = async () => {
      try {
        // أولاً تحقق من OAuth success
        if (handleOAuthSuccess()) {
          return // OAuth data handled successfully
        }
        
        // ثانياً: تحقق من جلسة Supabase النشطة
        console.log('🔍 تحقق من جلسة Supabase...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (session && session.user) {
          console.log('✅ تم العثور على جلسة Supabase نشطة:')
          console.log('User:', session.user)
          console.log('Provider:', session.user.app_metadata?.provider)
          
          const user = session.user
          const userMetadata = user.user_metadata || {}
          
          // إعداد بيانات المستخدم من جلسة Supabase (بدون email)
          const realUserData = {
            id: user.id,
            name: userMetadata.full_name || userMetadata.name || userMetadata.first_name || 'مستخدم Facebook',
            email: null, // لا نطلب email من Facebook
            provider: user.app_metadata?.provider || 'facebook',
            avatar_url: userMetadata.avatar_url || userMetadata.picture,
            profile: {
              full_name: userMetadata.full_name || userMetadata.name,
              first_name: userMetadata.first_name,
              last_name: userMetadata.last_name,
              picture: userMetadata.avatar_url || userMetadata.picture
            },
            stats: {
              completed_assessments: 0,
              average_score: 0,
              total_recommendations: 0,
              active_days: 1,
              join_date: new Date().toISOString().split('T')[0]
            },
            token: session.access_token
          }
          
          console.log('📅 بيانات المستخدم الحقيقية:', realUserData)
          
          // حفظ في localStorage وتعيين الحالة
          localStorage.setItem('userData', JSON.stringify(realUserData))
          localStorage.setItem('userToken', realUserData.token)
          setUser(realUserData)
          
          alert(`مرحباً بك ${realUserData.name}! تم تسجيل الدخول بنجاح عبر ${realUserData.provider}`)
          return
        }
        
        // ثالثاً جرب localStorage
        const storedUserData = localStorage.getItem('userData')
        const storedToken = localStorage.getItem('userToken')
        
        if (storedUserData && storedToken) {
          const userData = JSON.parse(storedUserData)
          console.log('📋 بيانات المستخدم من localStorage:', userData)
          
          // استخدام بيانات localStorage مباشرة (بدون API call)
          if (userData.profile && userData.profile.full_name) {
            userData.name = userData.profile.full_name
          } else if (userData.profile && userData.profile.first_name && userData.profile.last_name) {
            userData.name = `${userData.profile.first_name} ${userData.profile.last_name}`
          } else if (userData.name && userData.name !== 'أحمد محمد') {
            userData.name = userData.name
          } else {
            userData.name = userData.email ? userData.email.split('@')[0] : 'مستخدم'
          }
          
          console.log('✅ تم تحميل بيانات المستخدم بنجاح:', userData.name)
          setUser(userData)
        } else {
          // لو مافيش بيانات في localStorage ولا جلسة نشطة
          console.log('⚠️ لا توجد بيانات محفوظة أو جلسة نشطة، استخدام بيانات تجريبية')
          
          const userData = {
            id: 'demo_user_' + Date.now(),
            name: "مستخدم تجريبي",
            email: "demo@school2career.com",
            provider: "demo",
            stats: {
              completed_assessments: 3,
              average_score: 85,
              total_recommendations: 3,
              active_days: 12,
              join_date: "2024-01-15"
            }
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error)
        // استخدم بيانات تجريبية عند الخطأ
        const userData = {
          id: 'demo_user_error_' + Date.now(),
          name: "مستخدم تجريبي (خطأ)",
          email: "error@school2career.com",
          provider: "demo",
          stats: {
            completed_assessments: 3,
            average_score: 85,
            total_recommendations: 3,
            active_days: 12,
            join_date: "2024-01-15"
          }
        }
        setUser(userData)
      }
    }
    
    loadUserData()

    // محاكاة تحميل التقييمات المكتملة
    const userAssessments = [
      {
        id: 1,
        title: "تقييم الميول المهنية",
        completedDate: "2024-03-10",
        score: 88,
        status: "مكتمل"
      },
      {
        id: 2,
        title: "تقييم المهارات التقنية",
        completedDate: "2024-03-05",
        score: 92,
        status: "مكتمل"
      },
      {
        id: 3,
        title: "تقييم المهارات الفنية",
        completedDate: "2024-02-28",
        score: 76,
        status: "مكتمل"
      }
    ]
    setAssessments(userAssessments)

    // محاكاة التوصيات
    const userRecommendations = [
      {
        id: 1,
        title: "مطور برمجيات",
        match: 95,
        icon: "💻",
        description: "بناءً على نتائجك، أنت تتمتع بمهارات تقنية ممتازة"
      },
      {
        id: 2,
        title: "مهندس نظم",
        match: 88,
        icon: "⚙️",
        description: "قدراتك في التحليل والتفكير المنطقي عالية"
      },
      {
        id: 3,
        title: "مصمم واجهات",
        match: 82,
        icon: "🎨",
        description: "لديك حس فني جيد ومهارات في التصميم"
      }
    ]
    setRecommendations(userRecommendations)
  }, [])

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--dark-bg)'
      }}>
        <div style={{ color: 'var(--text-primary)' }}>جاري تحميل البيانات...</div>
      </div>
    )
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
          <div className="logo">School2Career</div>
          <div className="nav-links">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/assessments" className="nav-link">التقييمات</Link>
            <Link href="/careers" className="nav-link">المهن</Link>
            <Link href="/dashboard" className="nav-link">لوحة التحكم</Link>
            <div className="user-menu-container">
              <button className="user-menu-button">
                {user.name}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 50px' }}>
          
          {/* Welcome Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '48px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              مرحباً، {user.name}
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
              إليك ملخص عن نشاطك ونتائجك
            </p>
          </div>

          {/* Stats Overview */}
          <div className="stats-container" style={{ marginBottom: '60px' }}>
            <div className="stat-item">
              <div className="stat-number">{user.stats?.completed_assessments || 0}</div>
              <div className="stat-label">تقييم مكتمل</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user.stats?.average_score || 0}%</div>
              <div className="stat-label">متوسط النتائج</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user.stats?.total_recommendations || 0}</div>
              <div className="stat-label">توصية مهنية</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user.stats?.active_days || 0}</div>
              <div className="stat-label">يوم نشط</div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '30px' 
          }}>
            
            {/* Recent Assessments */}
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{ 
                fontSize: '24px',
                marginBottom: '20px',
                color: 'var(--text-primary)'
              }}>
                التقييمات المكتملة
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {assessments && assessments.length > 0 ? (
                  assessments.map((assessment) => (
                    <div key={assessment.id} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '15px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>
                          {assessment.title}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          {new Date(assessment.completed_date).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div style={{
                        background: assessment.score >= 90 ? 'var(--accent-neon)' : 
                                   assessment.score >= 80 ? 'var(--accent-purple)' : 
                                   'var(--accent-pink)',
                        color: 'var(--dark-bg)',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontWeight: 'bold'
                      }}>
                        {assessment.score}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    padding: '40px 20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
                    <p>لم تقم بإكمال أي تقييم بعد</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>ابدأ أول تقييم لك الآن!</p>
                  </div>
                )}
              </div>
              <Link href="/assessments">
                <button style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '15px',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  ابدأ تقييم جديد
                </button>
              </Link>
            </div>

            {/* Career Recommendations */}
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{ 
                fontSize: '24px',
                marginBottom: '20px',
                color: 'var(--text-primary)'
              }}>
                التوصيات المهنية
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <div key={rec.id} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '15px',
                      padding: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px', marginLeft: '10px' }}>{rec.icon}</span>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>
                            {rec.title}
                          </h3>
                          <div style={{
                            background: 'var(--accent-neon)',
                            color: 'var(--dark-bg)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            display: 'inline-block'
                          }}>
                            {rec.match_percentage || rec.match}% تطابق
                          </div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {rec.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    padding: '40px 20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>💼</div>
                    <p>لا توجد توصيات مهنية بعد</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>أكمل تقييماً للحصول على توصيات</p>
                  </div>
                )}
              </div>
              <Link href="/careers">
                <button style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '15px',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--accent-purple)',
                  borderRadius: '15px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  استكشف المزيد من المهن
                </button>
              </Link>
            </div>

          </div>

          {/* Quick Actions */}
          <div style={{ 
            marginTop: '60px',
            background: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '32px',
              marginBottom: '30px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}>
              إجراءات سريعة
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <button 
                className="path-card"
                onClick={() => router.push('/assessments')}
                style={{ cursor: 'pointer' }}
              >
                <div className="path-icon">🎯</div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>تقييم جديد</h3>
                <p style={{ fontSize: '14px' }}>ابدأ تقييم جديد لاكتشاف المزيد</p>
              </button>
              
              <button 
                className="path-card"
                onClick={() => router.push('/results')}
                style={{ cursor: 'pointer' }}
              >
                <div className="path-icon">📊</div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>عرض النتائج</h3>
                <p style={{ fontSize: '14px' }}>راجع جميع نتائجك السابقة</p>
              </button>
              
              <button 
                className="path-card"
                onClick={() => router.push('/careers')}
                style={{ cursor: 'pointer' }}
              >
                <div className="path-icon">💼</div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>استكشف المهن</h3>
                <p style={{ fontSize: '14px' }}>تصفح المهن المناسبة لك</p>
              </button>
              
              <button 
                className="path-card"
                onClick={() => router.push('/profile')}
                style={{ cursor: 'pointer' }}
              >
                <div className="path-icon">👤</div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>الملف الشخصي</h3>
                <p style={{ fontSize: '14px' }}>حدث بياناتك الشخصية</p>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">School2Career</div>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">💼</a>
          </div>
          <div className="copyright">
            © 2025 School2Career - جميع الحقوق محفوظة
            <br />
            تطوير د. محمد يشار
          </div>
        </div>
      </footer>
    </>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري التحميل...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}