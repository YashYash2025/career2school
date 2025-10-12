'use client'

import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation'
import { useTranslation } from '../lib/translation'

export default function Careers() {
  const { t, direction } = useTranslation()
  
  const getDemandTranslation = (demand) => {
    if (demand === 'عالي جداً' || demand === 'Very High' || demand === 'Très Élevé') return t('careers_page.demand.very_high')
    if (demand === 'عالي' || demand === 'High' || demand === 'Élevé') return t('careers_page.demand.high')
    if (demand === 'متوسط' || demand === 'Medium' || demand === 'Moyen') return t('careers_page.demand.medium')
    return t('careers_page.demand.low')
  }
  const careerPaths = [
    {
      category: t('careers_page.categories.science_tech'),
      icon: "🔬",
      careers: [
        { key: 'doctor', demand: "عالي" },
        { key: 'engineer', demand: "عالي" },
        { key: 'data_scientist', demand: "عالي جداً" },
        { key: 'researcher', demand: "متوسط" }
      ]
    },
    {
      category: t('careers_page.categories.technology_programming'),
      icon: "💻",
      careers: [
        { key: 'app_developer', demand: "عالي جداً" },
        { key: 'cyber_security', demand: "عالي جداً" },
        { key: 'ui_designer', demand: "عالي" },
        { key: 'systems_analyst', demand: "عالي" }
      ]
    },
    {
      category: t('careers_page.categories.business_management'),
      icon: "💼",
      careers: [
        { key: 'project_manager', demand: "عالي" },
        { key: 'accountant', demand: "متوسط" },
        { key: 'digital_marketer', demand: "عالي" },
        { key: 'business_consultant', demand: "عالي" }
      ]
    },
    {
      category: t('careers_page.categories.arts_creativity'),
      icon: "🎨",
      careers: [
        { key: 'graphic_designer', demand: "متوسط" },
        { key: 'photographer', demand: "متوسط" },
        { key: 'content_writer', demand: "عالي" },
        { key: 'video_editor', demand: "عالي" }
      ]
    }
  ]

  return (
    <>
      {/* Unified Navigation */}
      <UnifiedNavigation />
      
      {/* Animated Background */}
      <div className="bg-animation"></div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      {/* Main Content */}
      <main style={{ paddingTop: '120px', minHeight: '100vh', direction: direction }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 50px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px', direction: direction }}>
            <h1 className="section-title">{t('careers_page.title')}</h1>
            <p style={{ 
              fontSize: '20px', 
              color: 'var(--text-secondary)', 
              marginTop: '20px',
              lineHeight: '1.6'
            }}>
              {t('careers_page.subtitle')}
            </p>
          </div>

          {/* Career Categories */}
          {careerPaths.map((category, index) => (
            <div key={index} style={{ marginBottom: '60px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '48px',
                  background: 'var(--card-bg)',
                  padding: '15px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {category.icon}
                </div>
                <h2 style={{
                  fontSize: '32px',
                  background: 'var(--primary-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {category.category}
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px'
              }}>
                {category.careers.map((career, careerIndex) => {
                  const careerData = t(`careers_page.careers.${career.key}`)
                  return (
                  <div key={careerIndex} className="target-card" style={{
                    background: 'var(--card-bg)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <h3 style={{
                      fontSize: '24px',
                      color: 'var(--text-primary)',
                      marginBottom: '10px'
                    }}>
                      {careerData.name}
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '15px',
                      lineHeight: '1.5'
                    }}>
                      {careerData.desc}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {t('careers_page.market_demand')}
                      </span>
                      <span style={{
                        background: career.demand === 'عالي جداً' || career.demand === 'Very High' ? 'var(--accent-neon)' :
                                   career.demand === 'عالي' || career.demand === 'High' ? 'var(--accent-purple)' :
                                   'var(--accent-pink)',
                        color: career.demand === 'عالي جداً' || career.demand === 'Very High' ? 'var(--dark-bg)' : 'white',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getDemandTranslation(career.demand)}
                      </span>
                    </div>
                  </div>
                  )
                }))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '25px',
            padding: '50px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '80px'
          }}>
            <h2 style={{
              fontSize: '36px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              لست متأكداً من المسار المناسب لك؟
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              ابدأ بأحد تقييماتنا المتخصصة لاكتشاف المهن التي تناسب شخصيتك ومهاراتك
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/assessments">
                <button className="primary-btn">
                  ابدأ تقييم الميول المهنية
                </button>
              </Link>
              <Link href="/about">
                <button className="secondary-btn">
                  تعرف على المنصة
                </button>
              </Link>
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