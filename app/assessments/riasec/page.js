'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RIASECAssessments() {
  const router = useRouter()

  const versions = [
    { 
      icon: '🎓', 
      title: 'RIASEC للمدارس (60 سؤال)', 
      desc: 'مخصص لطلاب المرحلة الإعدادية والثانوية - أسئلة مبسطة ومناسبة', 
      time: '15-20 دقيقة', 
      path: '/assessments/riasec/enhanced?version=school',
      badge: 'للمدارس',
      questions: 60,
      accuracy: 'عالية',
      targetAge: '13-18 سنة',
      targetGroup: 'طلاب المدارس'
    },
    { 
      icon: '🎯', 
      title: 'RIASEC للجامعات والخريجين (60 سؤال)', 
      desc: 'مخصص لطلاب الجامعة والخريجين الجدد - أسئلة متخصصة ومهنية', 
      time: '15-20 دقيقة', 
      path: '/assessments/riasec/enhanced?version=college',
      badge: 'للجامعات',
      recommended: true,
      questions: 60,
      accuracy: 'عالية',
      targetAge: '18+ سنة',
      targetGroup: 'طلاب الجامعة والخريجين'
    }
  ]

  return (
    <>
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

      {/* Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(15, 15, 30, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 1000,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <Link href="/assessments" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '50px',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 5px 15px rgba(118, 75, 162, 0.4)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          العودة للتقييمات
        </Link>
        <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
          تقييم RIASEC للميول المهنية
        </div>
        <div></div>
      </div>

      {/* Main Content */}
      <main style={{ 
        paddingTop: '120px', 
        paddingLeft: '160px',
        paddingRight: '160px',
        paddingBottom: '60px',
        minHeight: '100vh',
        maxWidth: '1000px',
        margin: '0 auto',
        direction: 'rtl' // Ensure RTL for the entire main content
      }}>
        
        {/* Header Section Group */}
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
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '12px 16px',
              borderRadius: '15px',
              fontSize: '24px'
            }}>🎯</span>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              تقييم RIASEC للميول المهنية
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#a8a8b8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            التقييم العلمي الأكثر دقة في العالم لاكتشاف ميولك المهنية الحقيقية
          </p>
        </div>

        {/* Scientific Excellence Group */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '40px',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              direction: 'rtl'
            }}>
              التميز العلمي والتقني
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '18px'
              }}>🔬</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              margin: 0
            }}>
              مبني على أحدث الأبحاث العلمية والمعايير الدولية
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px' }}>خوارزميات متطورة</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8' }}>أحدث الخوارزميات والتقنيات</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📊</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px' }}>معايير علمية دولية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8' }}>مبني على أحدث الابحاث</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(240, 147, 251, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px' }}>نتائج فورية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8' }}>احصل على نتائجك في ثوان</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📈</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px' }}>تقارير تفاعلية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8' }}>تقارير مصورة وتفاعلية</p>
            </div>
          </div>
        </div>

        {/* Smart Features Group */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.08))',
          padding: '30px',
          borderRadius: '25px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          marginBottom: '50px',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            direction: 'rtl'
          }}>
            لماذا تختار خوارزمياتنا المتطورة؟
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '18px'
            }}>⚡</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔄</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px' }}>تحليل ذكي</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8' }}>خوارزميات ذكية</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🎯</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px' }}>توصيات مخصصة</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8' }}>مبنية على شخصيتك</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🚀</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px' }}>رؤى مستقبلية</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8' }}>تحليل اتجاهات المستقبل</p>
            </div>
          </div>
        </div>

        {/* Global Versions Section */}
        <div style={{ 
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          padding: '30px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '26px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              direction: 'rtl'
            }}>
              النسخ العالمية المعتمدة
              <span style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '18px'
              }}>🌍</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              margin: 0
            }}>
              مبنية على نظرية هولاند العلمية والمعايير الدولية
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', // Increased from 320px to make cards bigger
            gap: '25px',
            maxWidth: '750px',  // Reduced from 900px for more constrained grid
            margin: '0 auto'    // Center the grid
          }}>
            {versions.map((version, index) => (
              <div key={index} style={{
                background: version.recommended ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '18px',
                padding: '25px', // Increased from 20px
                border: version.recommended ? '2px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                direction: 'rtl',
                textAlign: 'right'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                
                {/* Badge */}
                {version.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '15px',
                    background: version.recommended ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    {version.badge} {version.recommended && ' ⭐'}
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '18px', direction: 'rtl' }}> {/* Increased gap and margin */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',  // Increased from 16px
                      marginBottom: '8px', 
                      color: 'white', 
                      textAlign: 'right',
                      fontWeight: 'bold'
                    }}>
                      {version.title}
                    </h3>
                    <p style={{
                      color: '#a8a8b8', 
                      fontSize: '12px',  // Increased from 11px
                      textAlign: 'right',
                      lineHeight: '1.4'
                    }}>
                      {version.desc}
                    </p>
                  </div>
                  <div style={{
                    width: '55px',     // Increased from 50px
                    height: '55px',    // Increased from 50px
                    background: version.recommended ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '14px', // Increased from 12px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',  // Increased from 24px
                    flexShrink: 0
                  }}>
                    {version.icon}
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',      // Increased from 10px
                  marginBottom: '18px' // Increased from 15px
                }}>
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px' }}> {/* Increased padding and border radius */}
                    <div style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}>عدد الأسئلة</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{version.questions}</div> {/* Increased from 14px */}
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px' }}> {/* Increased padding and border radius */}
                    <div style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}>الوقت المطلوب</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{version.time}</div> {/* Increased from 14px */}
                  </div>
                </div>

                <button 
                  onClick={() => router.push(version.path)}
                  style={{
                    width: '100%',
                    padding: '14px',  // Increased from 12px
                    background: version.recommended ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px', // Increased from 10px
                    color: 'white',
                    fontSize: '15px',  // Increased from 14px
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}>
                  ابدأ التقييم الآن 🚀
                </button>
              </div>
            ))}
          </div>
        </div>



      </main>
    </>
  )
}