'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext, selectors } from '../context/AppContext';

export default function SharedNavigation() {
  const { state, actions } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // Check login status
  useEffect(() => {
    if (selectors.isLoggedIn(state)) {
      setIsLoggedIn(true);
      setUserInfo(selectors.getUserData(state));
    } else {
      setIsLoggedIn(false);
    }
  }, [state]);

  // Handle logout
  const handleLogout = () => {
    console.log('🚪 Logout called from SharedNavigation');
    actions.logout();
    setIsLoggedIn(false);
    setUserInfo({ name: '', email: '' });
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          School2Career
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px'
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            transition: 'color 0.3s'
          }}>
            الرئيسية
          </Link>
          <Link href="/assessments" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            transition: 'color 0.3s'
          }}>
            التقييمات
          </Link>
          <Link href="/careers" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            transition: 'color 0.3s'
          }}>
            المهن
          </Link>
          <Link href="/about" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            transition: 'color 0.3s'
          }}>
            عن المنصة
          </Link>

          {/* User Menu or Login Button */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>👤</span>
                <span>{userInfo.name || userInfo.email}</span>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  background: 'rgba(17, 24, 39, 0.98)',
                  borderRadius: '12px',
                  padding: '10px',
                  minWidth: '200px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 15px',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    📊 لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: 'transparent',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      cursor: 'pointer',
                      textAlign: 'right',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    🚪 تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/login">
                <button style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  تسجيل الدخول
                </button>
              </Link>
              <Link href="/signup">
                <button style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  إنشاء حساب
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
