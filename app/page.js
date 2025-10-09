'use client'
'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, selectors } from './context/AppContext'
import { useTranslation, LanguageSwitcher } from './lib/translation'

export default function Home() {
  const { t, currentLanguage, direction } = useTranslation()
  const { state, actions } = useAppContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  // Check login status
  useEffect(() => {
    console.log('🔍 Checking login status:', {
      isLoggedIn: selectors.isLoggedIn(state),
      userData: selectors.getUserData(state),
      localStorage: localStorage.getItem('userData')
    })
    
    if (selectors.isLoggedIn(state)) {
      setIsLoggedIn(true)
      setUserInfo(selectors.getUserData(state))
    } else {
      // Don't automatically logout - just update UI state
      setIsLoggedIn(false)
    }
  }, [state])

  // Handle logout
  const handleLogout = () => {
    console.log('🚪 Logout called from home page')
    console.trace('Logout stack trace')
    actions.logout()
    setIsLoggedIn(false)
    setUserInfo({ name: '', email: '' })
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <div dir={direction} className={`${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
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
            <LanguageSwitcher />
            <Link href="/" className="nav-link">{t('nav.home')}</Link>
            <Link href="/assessments" className="nav-link" aria-label={t('nav.assessments_aria')}>{t('nav.assessments')}</Link>
            <Link href="/careers" className="nav-link">{t('nav.careers')}</Link>
            <Link href="/about" className="nav-link">{t('nav.about')}</Link>
            {isLoggedIn ? (
              <div className="user-menu-container">
                <button
                  className="user-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {userInfo.name || t('nav.user')}
                </button>
                {showUserMenu && (
                  <div className="user-menu">
                    <Link href="/dashboard" className="user-menu-item">
                      {t('nav.dashboard')}
                    </Link>
                    <button onClick={handleLogout} className="user-menu-item logout-btn">
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-link">{t('nav.login')}</Link>
                <Link href="/signup" className="nav-link">{t('nav.signup')}</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {t('hero.title_1')}
              <br />
              <span className="gradient-text">School2Career</span>
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => router.push('/assessments')}
              >
                {t('hero.start_assessment')}
              </button>
              <button
                className="secondary-btn"
                onClick={() => router.push('/about')}
              >
                {t('hero.watch_video')}
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="cards-container">
              <div className="feature-card">
                <div className="card-icon">🎯</div>
                <h3 className="card-title">{t('features.comprehensive_assessment')}</h3>
                <p className="card-description">{t('features.comprehensive_assessment_desc')}</p>
              </div>
              <div className="feature-card">
                <div className="card-icon">🚀</div>
                <h3 className="card-title">{t('features.instant_results')}</h3>
                <p className="card-description">{t('features.instant_results_desc')}</p>
              </div>
              <div className="feature-card">
                <div className="card-icon">💡</div>
                <h3 className="card-title">{t('features.smart_recommendations')}</h3>
                <p className="card-description">{t('features.smart_recommendations_desc')}</p>
              </div>
              <div className="feature-card">
                <div className="card-icon">🎓</div>
                <h3 className="card-title">{t('features.clear_paths')}</h3>
                <p className="card-description">{t('features.clear_paths_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">{t('stats.users')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">{t('stats.assessments')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1,500+</div>
            <div className="stat-label">{t('stats.career_paths')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">{t('stats.satisfaction')}</div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="targets" id="targets">
        <h2 className="section-title">{t('targets.title')}</h2>
        <div className="targets-grid">
          <div className="target-card">
            <div className="target-icon">🎓</div>
            <h3 className="target-title">{t('targets.students.title')}</h3>
            <div className="target-age">{t('targets.students.age')}</div>
            <p className="target-description">{t('targets.students.description')}</p>
            <ul className="target-features">
              <li>{t('targets.students.features.academic_discovery')}</li>
              <li>{t('targets.students.features.specialization')}</li>
              <li>{t('targets.students.features.future_planning')}</li>
              <li>{t('targets.students.features.informed_decisions')}</li>
            </ul>
          </div>
          <div className="target-card">
            <div className="target-icon">👨‍💼</div>
            <h3 className="target-title">{t('targets.professionals.title')}</h3>
            <div className="target-age">{t('targets.professionals.age')}</div>
            <p className="target-description">{t('targets.professionals.description')}</p>
            <ul className="target-features">
              <li>{t('targets.professionals.features.skill_assessment')}</li>
              <li>{t('targets.professionals.features.development_opportunities')}</li>
              <li>{t('targets.professionals.features.promotion_planning')}</li>
              <li>{t('targets.professionals.features.career_change')}</li>
            </ul>
          </div>
          <div className="target-card">
            <div className="target-icon">🏢</div>
            <h3 className="target-title">{t('targets.organizations.title')}</h3>
            <div className="target-age">{t('targets.organizations.size')}</div>
            <p className="target-description">{t('targets.organizations.description')}</p>
            <ul className="target-features">
              <li>{t('targets.organizations.features.employee_assessment')}</li>
              <li>{t('targets.organizations.features.development_programs')}</li>
              <li>{t('targets.organizations.features.candidate_selection')}</li>
              <li>{t('targets.organizations.features.team_building')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="skills">
        <h2 className="section-title">{t('skills.title')}</h2>
        <div className="skills-grid">
          <div className="skill-item">
            <div className="skill-icon">🧪</div>
            <div className="skill-name">{t('skills.scientific.name')}</div>
            <div className="skill-category">{t('skills.scientific.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">📖</div>
            <div className="skill-name">{t('skills.literary.name')}</div>
            <div className="skill-category">{t('skills.literary.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">💻</div>
            <div className="skill-name">{t('skills.technical.name')}</div>
            <div className="skill-category">{t('skills.technical.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">🎨</div>
            <div className="skill-name">{t('skills.artistic.name')}</div>
            <div className="skill-category">{t('skills.artistic.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">🤝</div>
            <div className="skill-name">{t('skills.social.name')}</div>
            <div className="skill-category">{t('skills.social.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">💡</div>
            <div className="skill-name">{t('skills.critical_thinking.name')}</div>
            <div className="skill-category">{t('skills.critical_thinking.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">⚽</div>
            <div className="skill-name">{t('skills.sports.name')}</div>
            <div className="skill-category">{t('skills.sports.category')}</div>
          </div>
          <div className="skill-item">
            <div className="skill-icon">🏥</div>
            <div className="skill-name">{t('skills.medical.name')}</div>
            <div className="skill-category">{t('skills.medical.category')}</div>
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="paths" id="paths">
        <h2 className="section-title">{t('paths.title')}</h2>
        <div className="paths-container">
          <div className="path-card">
            <div className="path-icon">🔬</div>
            <h3 className="path-title">{t('paths.science.title')}</h3>
            <p className="path-subtitle">{t('paths.science.subtitle')}</p>
            <p className="path-description">{t('paths.science.description')}</p>
            <button className="path-btn" onClick={() => router.push('/careers/science')}>
              {t('paths.explore_more')}
            </button>
          </div>
          <div className="path-card">
            <div className="path-icon">💻</div>
            <h3 className="path-title">{t('paths.technology.title')}</h3>
            <p className="path-subtitle">{t('paths.technology.subtitle')}</p>
            <p className="path-description">{t('paths.technology.description')}</p>
            <button className="path-btn" onClick={() => router.push('/careers/technology')}>
              {t('paths.explore_more')}
            </button>
          </div>
          <div className="path-card">
            <div className="path-icon">🎨</div>
            <h3 className="path-title">{t('paths.arts.title')}</h3>
            <p className="path-subtitle">{t('paths.arts.subtitle')}</p>
            <p className="path-description">{t('paths.arts.description')}</p>
            <button className="path-btn" onClick={() => router.push('/careers/arts')}>
              {t('paths.explore_more')}
            </button>
          </div>
          <div className="path-card">
            <div className="path-icon">💼</div>
            <h3 className="path-title">{t('paths.business.title')}</h3>
            <p className="path-subtitle">{t('paths.business.subtitle')}</p>
            <p className="path-description">{t('paths.business.description')}</p>
            <button className="path-btn" onClick={() => router.push('/careers/business')}>
              {t('paths.explore_more')}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">{t('cta.title')}</h2>
          <p className="cta-description">
            {t('cta.description')}
          </p>
          <div className="cta-buttons">
            <button
              className="cta-primary-btn"
              onClick={() => router.push('/signup')}
            >
              {t('cta.start_assessment')}
            </button>
            <button
              className="cta-secondary-btn"
              onClick={() => router.push('/login')}
            >
              {t('cta.login')}
            </button>
          </div>
        </div>
      </section>

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
            {t('footer.copyright')}
            <br />
            {t('footer.developer')}
          </div>
        </div>
      </footer>
    </div>
  )
}