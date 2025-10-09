'use client'

import Link from 'next/link'
import SharedNavigation from '../components/SharedNavigation'

export default function Careers() {
  const careerPaths = [
    {
      category: "العلوم والتكنولوجيا",
      icon: "🔬",
      careers: [
        { name: "طبيب", desc: "تشخيص وعلاج الأمراض", demand: "عالي" },
        { name: "مهندس", desc: "تصميم وبناء الحلول التقنية", demand: "عالي" },
        { name: "عالم بيانات", desc: "تحليل البيانات واستخراج الأنماط", demand: "عالي جداً" },
        { name: "باحث علمي", desc: "إجراء البحوث والاكتشافات", demand: "متوسط" }
      ]
    },
    {
      category: "التكنولوجيا والبرمجة",
      icon: "💻",
      careers: [
        { name: "مطور تطبيقات", desc: "تطوير التطبيقات والمواقع", demand: "عالي جداً" },
        { name: "مهندس أمن سيبراني", desc: "حماية الأنظمة الرقمية", demand: "عالي جداً" },
        { name: "مصمم واجهات", desc: "تصميم تجربة المستخدم", demand: "عالي" },
        { name: "محلل أنظمة", desc: "تحليل وتطوير الأنظمة", demand: "عالي" }
      ]
    },
    {
      category: "الأعمال والإدارة",
      icon: "💼",
      careers: [
        { name: "مدير مشاريع", desc: "إدارة وتنفيذ المشاريع", demand: "عالي" },
        { name: "محاسب", desc: "إدارة الأمور المالية", demand: "متوسط" },
        { name: "مسوق رقمي", desc: "التسويق عبر المنصات الرقمية", demand: "عالي" },
        { name: "مستشار أعمال", desc: "تقديم الاستشارات الإدارية", demand: "عالي" }
      ]
    },
    {
      category: "الفنون والإبداع",
      icon: "🎨",
      careers: [
        { name: "مصمم جرافيك", desc: "تصميم المواد البصرية", demand: "متوسط" },
        { name: "مصور", desc: "التصوير الفوتوغرافي والفيديو", demand: "متوسط" },
        { name: "كاتب محتوى", desc: "كتابة المحتوى الإبداعي", demand: "عالي" },
        { name: "مونتير", desc: "تحرير الفيديو والصوت", demand: "عالي" }
      ]
    }
  ]

  return (
    <>
      {/* Shared Navigation */}
      <SharedNavigation />
      
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
            <Link href="/about" className="nav-link">عن المنصة</Link>
            <Link href="/login" className="nav-link">تسجيل الدخول</Link>
            <Link href="/signup">
              <button className="cta-button">ابدأ الآن</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 50px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 className="section-title">المهن والمسارات الوظيفية</h1>
            <p style={{ 
              fontSize: '20px', 
              color: 'var(--text-secondary)', 
              marginTop: '20px',
              lineHeight: '1.6'
            }}>
              اكتشف الوظائف والمسارات المهنية التي تناسب مهاراتك واهتماماتك
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
                {category.careers.map((career, careerIndex) => (
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
                      {career.name}
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '15px',
                      lineHeight: '1.5'
                    }}>
                      {career.desc}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        الطلب في السوق
                      </span>
                      <span style={{
                        background: career.demand === 'عالي جداً' ? 'var(--accent-neon)' :
                                   career.demand === 'عالي' ? 'var(--accent-purple)' :
                                   'var(--accent-pink)',
                        color: career.demand === 'عالي جداً' ? 'var(--dark-bg)' : 'white',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {career.demand}
                      </span>
                    </div>
                  </div>
                ))}
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