'use client'

import Link from 'next/link'
import SharedNavigation from '../components/SharedNavigation'

export default function About() {
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
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 className="section-title">عن منصة School2Career</h1>
            <p style={{ 
              fontSize: '24px', 
              color: 'var(--text-secondary)', 
              marginTop: '20px',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '20px auto 0'
            }}>
              منصة ذكية لاكتشاف المسارات المهنية وتوجيه الطلاب نحو مستقبل مشرق
            </p>
          </div>

          {/* Mission Section */}
          <section style={{ marginBottom: '80px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '60px',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '42px',
                  background: 'var(--primary-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '30px'
                }}>
                  مهمتنا
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  marginBottom: '30px'
                }}>
                  نؤمن بأن كل طالب يمتلك إمكانات فريدة تحتاج إلى اكتشاف وتوجيه صحيح. 
                  مهمتنا هي مساعدة الطلاب على فهم أنفسهم بشكل أعمق واكتشاف المسارات المهنية 
                  التي تتماشى مع شخصياتهم ومهاراتهم الفطرية.
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px',
                    color: 'var(--text-primary)'
                  }}>
                    <span style={{ fontSize: '24px' }}>✨</span>
                    اكتشاف المواهب والميول الشخصية
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px',
                    color: 'var(--text-primary)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🎯</span>
                    توجيه علمي مبني على تقييمات دقيقة
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    color: 'var(--text-primary)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🚀</span>
                    إعداد الطلاب لسوق العمل المستقبلي
                  </li>
                </ul>
              </div>
              <div className="feature-card" style={{
                background: 'var(--card-bg)',
                padding: '40px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌟</div>
                <h3 style={{
                  fontSize: '28px',
                  color: 'var(--text-primary)',
                  marginBottom: '15px'
                }}>
                  رؤيتنا
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  أن نكون المنصة الرائدة في الشرق الأوسط لتوجيه الطلاب مهنياً، 
                  ومساعدة جيل جديد من المواهب على بناء مستقبل مهني ناجح ومؤثر.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section style={{ marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '42px',
              textAlign: 'center',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '60px'
            }}>
              ما يميز منصتنا
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              <div className="target-card">
                <div className="target-icon">🧠</div>
                <h3 className="target-title">تقييمات علمية دقيقة</h3>
                <p className="target-description">
                  نستخدم أحدث النظريات النفسية والتربوية في تصميم تقييماتنا، 
                  مما يضمن نتائج موثوقة ودقيقة تعكس الشخصية الحقيقية للطالب.
                </p>
              </div>
              <div className="target-card">
                <div className="target-icon">🤖</div>
                <h3 className="target-title">ذكاء اصطناعي متقدم</h3>
                <p className="target-description">
                  نوظف تقنيات الذكاء الاصطناعي لتحليل البيانات وتقديم توصيات 
                  مخصصة لكل طالب بناءً على نتائج التقييمات والبيانات الشخصية.
                </p>
              </div>
              <div className="target-card">
                <div className="target-icon">📊</div>
                <h3 className="target-title">تقارير شاملة ومفصلة</h3>
                <p className="target-description">
                  نقدم تقارير واضحة ومفهومة تشمل نقاط القوة والضعف، 
                  والمهن المناسبة، والخطوات العملية للتطوير المهني.
                </p>
              </div>
              <div className="target-card">
                <div className="target-icon">👥</div>
                <h3 className="target-title">دعم مستمر</h3>
                <p className="target-description">
                  فريق من المختصين في التوجيه المهني متاح لتقديم الاستشارات 
                  والإجابة على الأسئلة ومتابعة تقدم الطلاب.
                </p>
              </div>
              <div className="target-card">
                <div className="target-icon">🌍</div>
                <h3 className="target-title">محتوى محلي وعالمي</h3>
                <p className="target-description">
                  نوازن بين المعايير العالمية في التقييم والاحتياجات المحلية 
                  لسوق العمل، مما يضمن ملاءمة التوصيات للبيئة المحيطة.
                </p>
              </div>
              <div className="target-card">
                <div className="target-icon">🔄</div>
                <h3 className="target-title">تحديث مستمر</h3>
                <p className="target-description">
                  نحدث قاعدة بياناتنا ونماذجنا باستمرار لتواكب التغيرات 
                  في سوق العمل والتطورات في مجال التوجيه المهني.
                </p>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="stats" style={{ marginBottom: '80px' }}>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">طالب مستفيد</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">نوع تقييم</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1,500+</div>
                <div className="stat-label">مسار مهني</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">نسبة الرضا</div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section style={{ marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '42px',
              textAlign: 'center',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '60px'
            }}>
              فريق العمل
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>👨‍💼</div>
                <h3 style={{
                  fontSize: '24px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  د. محمد يشار
                </h3>
                <p style={{ color: 'var(--accent-neon)', marginBottom: '15px' }}>
                  المؤسس والمطور الرئيسي
                </p>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  خبير في تطوير البرمجيات والتقييمات النفسية، 
                  مع أكثر من 10 سنوات من الخبرة في مجال التعليم والتكنولوجيا.
                </p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>👩‍🔬</div>
                <h3 style={{
                  fontSize: '24px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  فريق البحث
                </h3>
                <p style={{ color: 'var(--accent-purple)', marginBottom: '15px' }}>
                  متخصصون في علم النفس التربوي
                </p>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  فريق من الخبراء والأكاديميين المتخصصين في تطوير 
                  وتصميم الاختبارات النفسية والمهنية.
                </p>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>👨‍💻</div>
                <h3 style={{
                  fontSize: '24px',
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  فريق التطوير
                </h3>
                <p style={{ color: 'var(--accent-pink)', marginBottom: '15px' }}>
                  مطورون ومصممون متخصصون
                </p>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  فريق متميز من المطورين والمصممين الذين يعملون على 
                  تطوير وتحسين المنصة باستمرار.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '25px',
            padding: '50px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{
              fontSize: '36px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              ابدأ رحلتك معنا اليوم
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              انضم إلى آلاف الطلاب الذين اكتشفوا مسارهم المهني المثالي من خلال منصتنا
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/signup">
                <button className="primary-btn">
                  إنشاء حساب جديد
                </button>
              </Link>
              <Link href="/assessments">
                <button className="secondary-btn">
                  تصفح التقييمات
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