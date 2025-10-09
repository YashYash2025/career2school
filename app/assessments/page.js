'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, selectors } from '../context/AppContext'
import SharedNavigation from '../components/SharedNavigation'

export default function Assessments() {
  const { state, actions } = useAppContext()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (selectors.isLoggedIn(state)) {
      setUser(selectors.getUserData(state))
    }
    setLoading(false)
  }, [state])

  // مجموعة الشخصية والميول
  const personalityGroup = [
    {
      icon: '🧠',
      title: 'Big Five Personality',
      subtitle: 'اختبار الشخصية الخماسي الكبير',
      time: '30 دقيقة',
      path: null,
      disabled: true
    },
    {
      icon: '🎯',
      title: 'RIASEC/Holland Code',
      subtitle: '6 نسخ متطورة من السريع للشامل + نسختنا الذكية School2Career\nخوارزميات متقدمة وتوصيات مستقبلية مخصصة',
      time: '10-60 دقيقة',
      path: '/assessments/riasec',
      active: true
    },
    {
      icon: '🌟',
      title: 'Values & Motivations',
      subtitle: 'اختبار القيم والدوافع',
      time: '15 دقيقة',
      path: null,
      disabled: true
    }
  ]

  // مجموعة الذكاء والقدرات المعرفية
  const intelligenceGroup = [
    {
      icon: '💡',
      title: 'Multiple Intelligences',
      subtitle: 'اختبار الذكاءات المتعددة',
      time: '20 دقيقة',
      disabled: true
    },
    {
      icon: '❤️',
      title: 'Emotional Intelligence',
      subtitle: 'اختبار الذكاء العاطفي',
      time: '30 دقيقة',
      disabled: true
    },
    {
      icon: '⚙️',
      title: 'ICAR',
      subtitle: 'قياس القدرات المعرفية العامة',
      time: '60 دقيقة',
      disabled: true
    },
    {
      icon: '🔬',
      title: 'Mental Rotation Test',
      subtitle: 'القدرات المكانية والتصور الفراغي',
      time: '20 دقيقة',
      disabled: true
    }
  ]

  // مجموعة المهارات الأكاديمية
  const academicGroup = [
    {
      icon: '🔄',
      title: 'TIMSS',
      subtitle: 'تقييم القدرات الأكاديمية',
      time: '45 دقيقة',
      disabled: true
    },
    {
      icon: '📖',
      title: 'PIRLS',
      subtitle: 'تقييم مهارات القراءة والفهم',
      time: '80 دقيقة',
      disabled: true
    },
    {
      icon: '🎨',
      title: 'VARK Learning Styles',
      subtitle: 'تحديد نمط التعلم المفضل',
      time: '10 دقيقة',
      disabled: true
    }
  ]

  // مجموعة المهارات الاجتماعية والمهنية
  const socialGroup = [
    {
      icon: '💼',
      title: 'Career Interests',
      subtitle: 'اختبار الاهتمامات المهنية',
      time: '25 دقيقة',
      disabled: true
    },
    {
      icon: '🗣️',
      title: 'Communication Styles',
      subtitle: 'تقييم أساليب التواصل',
      time: '10 دقيقة',
      disabled: true
    },
    {
      icon: '⚡',
      title: 'Skills Assessment',
      subtitle: 'تقييم المهارات',
      time: '20 دقيقة',
      disabled: true
    },
    {
      icon: '🔥',
      title: 'Motivation Scale',
      subtitle: 'قياس الدافعية للتعلم والإنجاز',
      time: '15 دقيقة',
      disabled: true
    }
  ]

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white' 
      }}>
        جاري التحميل...
      </div>
    )
  }

  const renderAssessmentCard = (assessment, themeColor) => (
    <div key={assessment.title} style={{
      background: assessment.active ? `rgba(${themeColor}, 0.15)` : `rgba(${themeColor}, 0.08)`,
      borderRadius: '20px',
      padding: '25px',
      border: assessment.active ? `2px solid rgba(${themeColor}, 0.4)` : `1px solid rgba(${themeColor}, 0.2)`,
      transition: 'all 0.3s ease',
      cursor: assessment.path ? 'pointer' : 'default',
      position: 'relative',
      direction: 'rtl',
      textAlign: 'right',
      opacity: assessment.disabled ? 0.7 : 1
    }}
    onMouseEnter={(e) => {
      if (assessment.path) {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(${themeColor}, 0.25)`
      }
    }}
    onMouseLeave={(e) => {
      if (assessment.path) {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }
    }}>
      
      {assessment.active && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '15px',
          background: `linear-gradient(135deg, rgb(${themeColor}), rgba(${themeColor}, 0.8))`,
          color: 'white',
          padding: '6px 14px',
          borderRadius: '15px',
          fontSize: '11px',
          fontWeight: 'bold',
          boxShadow: `0 6px 20px rgba(${themeColor}, 0.4)`
        }}>
          متاح الآن ✨
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', direction: 'rtl' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            marginBottom: '8px', 
            color: 'white', 
            textAlign: 'right',
            fontWeight: 'bold'
          }}>
            {assessment.title}
          </h3>
          <p style={{
            color: '#a8a8b8', 
            fontSize: assessment.title === 'RIASEC/Holland Code' ? '15px' : '12px', 
            textAlign: 'right',
            lineHeight: '1.5'
          }}>
            {assessment.subtitle}
          </p>
        </div>
        <div style={{
          width: '55px',
          height: '55px',
          background: `linear-gradient(135deg, rgb(${themeColor}), rgba(${themeColor}, 0.8))`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          flexShrink: 0
        }}>
          {assessment.icon}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {assessment.title === 'RIASEC/Holland Code' ? (
          <div style={{
            background: `rgba(${themeColor}, 0.15)`,
            padding: '18px',
            borderRadius: '15px',
            border: `1px solid rgba(${themeColor}, 0.3)`,
            textAlign: 'center'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: `rgb(${themeColor})`, fontSize: '13px', fontWeight: 'bold' }}>النسخ العالمية</div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>30-180 سؤال</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: `rgb(${themeColor})`, fontSize: '13px', fontWeight: 'bold' }}>School2Career</div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>مطور بذكاء</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: `rgba(${themeColor}, 0.2)`,
            padding: '15px',
            borderRadius: '15px',
            border: `1px solid rgba(${themeColor}, 0.3)`
          }}>
            <div style={{ color: `rgb(${themeColor})`, fontSize: '13px', fontWeight: 'bold' }}>الوقت المطلوب</div>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{assessment.time}</div>
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          if (assessment.path) {
            router.push(assessment.path)
          }
        }}
        style={{
          width: '100%',
          padding: '16px',
          background: assessment.active 
            ? `linear-gradient(135deg, rgb(${themeColor}), rgba(${themeColor}, 0.8))` 
            : assessment.disabled 
              ? 'rgba(255, 255, 255, 0.1)' 
              : `rgba(${themeColor}, 0.3)`,
          border: 'none',
          borderRadius: '14px',
          color: 'white',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: assessment.path ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}>
        {assessment.disabled ? 'قريباً 🔥' : 'ابدأ الاختبار 🚀'}
      </button>
    </div>
  )

  return (
    <>
      {/* Shared Navigation */}
      <SharedNavigation />
      
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: -1
      }}></div>

      {/* Main Content */}
      <main style={{ 
        paddingTop: '120px', 
        paddingLeft: '160px',
        paddingRight: '160px',
        paddingBottom: '60px',
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
        direction: 'rtl'
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
          padding: '40px 35px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          marginBottom: '50px',
          textAlign: 'center',
          color: 'white',
          direction: 'rtl'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px',
            direction: 'rtl'
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              منصة التقييمات الذكية
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '12px 16px',
              borderRadius: '15px',
              fontSize: '24px'
            }}>🎯</span>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#a8a8b8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            استكشف قدراتك وميولك مع مجموعة متنوعة من التقييمات العلمية المتطورة
          </p>
        </div>

        {/* مجموعة الشخصية والميول */}
        <div style={{
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              direction: 'rtl'
            }}>
              الشخصية والميول
              <span style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '10px 14px',
                borderRadius: '15px',
                fontSize: '20px'
              }}>👤</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0
            }}>
              اكتشف شخصيتك وميولك المهنية وقيمك الأساسية
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {personalityGroup.map(assessment => renderAssessmentCard(assessment, '102, 126, 234'))}
          </div>
        </div>

        {/* مجموعة الذكاء والقدرات المعرفية */}
        <div style={{
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              direction: 'rtl'
            }}>
              الذكاء والقدرات المعرفية
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '10px 14px',
                borderRadius: '15px',
                fontSize: '20px'
              }}>🧠</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0
            }}>
              قيس أنواع الذكاء المختلفة وقدراتك المعرفية والعقلية
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {intelligenceGroup.map(assessment => renderAssessmentCard(assessment, '16, 185, 129'))}
          </div>
        </div>

        {/* مجموعة المهارات الأكاديمية */}
        <div style={{
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              direction: 'rtl'
            }}>
              المهارات الأكاديمية
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                padding: '10px 14px',
                borderRadius: '15px',
                fontSize: '20px'
              }}>📚</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0
            }}>
              اختبر قدراتك الأكاديمية ومهاراتك في القراءة والرياضيات والعلوم
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {academicGroup.map(assessment => renderAssessmentCard(assessment, '251, 191, 36'))}
          </div>
        </div>

        {/* مجموعة المهارات الاجتماعية والمهنية */}
        <div style={{
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              direction: 'rtl'
            }}>
              المهارات الاجتماعية والمهنية
              <span style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                padding: '10px 14px',
                borderRadius: '15px',
                fontSize: '20px'
              }}>🤝</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0
            }}>
              طور مهاراتك في التواصل والقيادة والعمل الجماعي
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {socialGroup.map(assessment => renderAssessmentCard(assessment, '239, 68, 68'))}
          </div>
        </div>

      </main>

    </>
  )
}