'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function UnifiedNavigation({ showBackButton = false, backUrl = '/assessments' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('ar');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session first
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is authenticated via Supabase
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email?.split('@')[0],
            token: session.access_token
          };
          
          // Update localStorage
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('userToken', userData.token);
          
          setUser(userData);
          console.log('✅ User authenticated via Supabase:', userData.email);
        } else {
          // Fallback to localStorage
          const localUserData = localStorage.getItem('userData');
          if (localUserData) {
            setUser(JSON.parse(localUserData));
            console.log('⚠️ Using localStorage user data (no Supabase session)');
          } else {
            console.log('❌ No user session found');
          }
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        // Fallback to localStorage
        const localUserData = localStorage.getItem('userData');
        if (localUserData) {
          setUser(JSON.parse(localUserData));
        }
      }
    };

    checkAuth();

    // جلب اللغة المحفوظة
    const savedLang = localStorage.getItem('language') || 'ar';
    setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setShowLangMenu(false);
    // يمكن إضافة reload أو تحديث الصفحة هنا
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      await supabase.auth.signOut();
      console.log('✅ Signed out from Supabase');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    setUser(null);
    router.push('/login');
  };

  const languages = {
    ar: { name: 'العربية', flag: '🇸🇦' },
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' }
  };

  const translations = {
    ar: {
      back: 'رجوع',
      home: 'الرئيسية',
      assessments: 'التقييمات',
      careers: 'المهن',
      dashboard: 'لوحة التحكم',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج'
    },
    en: {
      back: 'Back',
      home: 'Home',
      assessments: 'Assessments',
      careers: 'Careers',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout'
    },
    fr: {
      back: 'Retour',
      home: 'Accueil',
      assessments: 'Évaluations',
      careers: 'Carrières',
      dashboard: 'Tableau de bord',
      login: 'Connexion',
      logout: 'Déconnexion'
    }
  };

  const t = translations[language];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: 'rgba(15, 15, 30, 0.98)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      
      {/* Left Side - Back Button or Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {showBackButton ? (
          <button
            onClick={() => router.push(backUrl)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '8px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.back}
          </button>
        ) : (
          <Link href="/" style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            School2Career
          </Link>
        )}
      </div>

      {/* Center - Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
      }}>
        <Link href="/" style={{
          color: pathname === '/' ? '#667eea' : '#a8a8b8',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          {t.home}
        </Link>
        <Link href="/assessments" style={{
          color: pathname.includes('/assessments') ? '#667eea' : '#a8a8b8',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          {t.assessments}
        </Link>
        <Link href="/careers" style={{
          color: pathname === '/careers' ? '#667eea' : '#a8a8b8',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          {t.careers}
        </Link>
        {user && (
          <Link href="/dashboard" style={{
            color: pathname === '/dashboard' ? '#667eea' : '#a8a8b8',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            {t.dashboard}
          </Link>
        )}
      </div>

      {/* Right Side - Language & User */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Cairo, Arial, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <span style={{ fontSize: '16px' }}>{languages[language].flag}</span>
            <span>{languages[language].name}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: 0,
              background: 'rgba(15, 15, 30, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '150px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              zIndex: 1001
            }}>
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: language === code ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    transition: 'all 0.3s ease',
                    textAlign: 'right'
                  }}
                  onMouseEnter={(e) => {
                    if (language !== code) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== code) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'Cairo, Arial, sans-serif',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                👤
              </div>
              <span>{user.name || user.email}</span>
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '45px',
                right: 0,
                background: 'rgba(15, 15, 30, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '180px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                zIndex: 1001
              }}>
                <Link href="/dashboard" style={{
                  display: 'block',
                  padding: '10px 12px',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}>
                  📊 {t.dashboard}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'block',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    transition: 'all 0.3s ease',
                    textAlign: language === 'ar' ? 'right' : 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  🚪 {t.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Cairo, Arial, sans-serif',
            transition: 'all 0.3s ease'
          }}>
            {t.login}
          </Link>
        )}
      </div>
    </nav>
  );
}
