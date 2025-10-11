'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '@/app/components/UnifiedNavigation'

export default function RIASECAssessments() {
  const router = useRouter()

  const versions = [
    { 
      icon: '🎓', 
      title: 'للمدارس (60 سؤال)', 
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
      title: 'للجامعات والخريجين (60 سؤال)', 
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
      <UnifiedNavigation showBackButton={true} backUrl="/assessments" />

      {/* Main Content */}
      <main style={{ 
        paddingTop: '100px', 
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
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              بوصلة المهن™
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#a8a8b8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            اكتشف مسارك المهني بدقة علمية
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
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              اختر النسخة المناسبة لك
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {versions.map((version, index) => {
              const versionColor = version.recommended ? '#667eea' : '#10b981';
              const versionGradient = version.recommended 
                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                : 'linear-gradient(135deg, #10b981, #059669)';
              
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    padding: '35px',
                    border: `2px solid ${versionColor}40`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => router.push(version.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${versionColor}40`;
                    e.currentTarget.style.borderColor = versionColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = `${versionColor}40`;
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    {version.icon}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: versionColor,
                    marginBottom: '15px',
                    textAlign: 'center',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
                  }}>
                    {version.title}
                  </h2>

                  {/* Description */}
                  <p style={{
                    fontSize: '16px',
                    color: '#a8a8b8',
                    marginBottom: '25px',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
                  }}>
                    {version.desc}
                  </p>

                  {/* Info Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '25px'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: `1px solid ${versionColor}20`
                    }}>
                      <div style={{
                        color: versionColor,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        fontFamily: 'Cairo, Arial, sans-serif'
                      }}>
                        عدد الأسئلة
                      </div>
                      <div style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {version.questions}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: `1px solid ${versionColor}20`
                    }}>
                      <div style={{
                        color: versionColor,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        fontFamily: 'Cairo, Arial, sans-serif'
                      }}>
                        الوقت المطلوب
                      </div>
                      <div style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {version.time}
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: versionGradient,
                      border: 'none',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      direction: 'rtl'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 10px 25px ${versionColor}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ابدأ التقييم ←
                  </button>
                </div>
              );
            })}
          </div>
        </div>



      </main>
    </>
  )
}