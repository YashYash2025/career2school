'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, selectors } from '../context/AppContext'
import UnifiedNavigation from '../components/UnifiedNavigation'
import { useTranslation } from '../lib/translation'

export default function Assessments() {
  const { state, actions } = useAppContext()
  const { t, currentLanguage, direction } = useTranslation()
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
      title: t('assessments_page.personality_mirror.title'),
      brandTitle: t('assessments_page.personality_mirror.brand'),
      subtitle: t('assessments_page.personality_mirror.subtitle'),
      description: t('assessments_page.personality_mirror.description'),
      time: null,
      path: '/assessments/big-five',
      active: true,
      badge: t('assessments_page.personality_mirror.badge')
    },
    {
      icon: '🎯',
      title: t('assessments_page.career_compass.title'),
      brandTitle: t('assessments_page.career_compass.brand'),
      subtitle: t('assessments_page.career_compass.subtitle'),
      description: t('assessments_page.career_compass.description'),
      time: null,
      path: '/assessments/riasec',
      active: true,
      badge: t('assessments_page.career_compass.badge')
    },
    {
      icon: '🌟',
      title: t('assessments_page.values_motivations.title'),
      subtitle: t('assessments_page.values_motivations.subtitle'),
      time: t('assessments_page.values_motivations.time'),
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
        {t('status.loading')}
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
      direction: direction,
      textAlign: direction === 'rtl' ? 'right' : 'left',
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
          {assessment.badge || t('assessments_page.personality_group.badge')}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', direction: direction, flexDirection: direction === 'rtl' ? 'row' : 'row' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '20px',
              color: 'white',
              textAlign: 'right',
              fontWeight: 'bold',
              margin: 0
            }}>
              {assessment.title}
            </h3>
            {assessment.badge && (
              <span style={{
                background: `linear-gradient(135deg, rgb(${themeColor}), rgba(${themeColor}, 0.8))`,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {assessment.badge}
              </span>
            )}
          </div>
          <p style={{
            color: '#a8a8b8',
            fontSize: '14px',
            textAlign: 'right',
            lineHeight: '1.5',
            margin: 0
          }}>
            {assessment.subtitle}
          </p>
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, rgb(${themeColor}), rgba(${themeColor}, 0.8))`,
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          flexShrink: 0,
          boxShadow: `0 8px 20px rgba(${themeColor}, 0.3)`
        }}>
          {assessment.icon}
        </div>
      </div>

      {assessment.description && (
        <div style={{
          background: `rgba(${themeColor}, 0.1)`,
          padding: '15px',
          borderRadius: '12px',
          border: `1px solid rgba(${themeColor}, 0.2)`,
          marginBottom: '20px'
        }}>
          <p style={{
            color: '#d1d5db',
            fontSize: '13px',
            textAlign: direction === 'rtl' ? 'right' : 'left',
            lineHeight: '1.6',
            margin: 0,
            direction: direction
          }}>
            {assessment.description}
          </p>
        </div>
      )}

      {assessment.time && (
        <div style={{
          background: `rgba(${themeColor}, 0.15)`,
          padding: '12px',
          borderRadius: '12px',
          border: `1px solid rgba(${themeColor}, 0.3)`,
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ color: `rgb(${themeColor})`, fontSize: '12px', fontWeight: 'bold' }}>الوقت المطلوب</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{assessment.time}</div>
        </div>
      )}

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
        {assessment.disabled ? t('assessments_page.coming_soon') + ' 🔥' : t('assessments_page.start_assessment') + ' 🚀'}
      </button>
    </div>
  )

  return (
    <>
      {/* Unified Navigation */}
      <UnifiedNavigation />

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
        paddingTop: '100px',
        paddingLeft: '160px',
        paddingRight: '160px',
        paddingBottom: '60px',
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
        direction: direction
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
          direction: direction
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px',
            direction: direction
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('assessments_page.main_title')}
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
            {t('assessments_page.main_subtitle')}
          </p>
        </div>

        {/* مجموعة الشخصية والميول */}
        <div style={{
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          direction: direction
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
              direction: direction
            }}>
              {t('assessments_page.personality_group.title')}
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
              {t('assessments_page.personality_group.subtitle')}
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
          direction: direction
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
          direction: direction
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
          direction: direction
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