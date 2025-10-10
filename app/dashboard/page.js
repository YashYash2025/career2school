'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProfileTab from './components/ProfileTab';
import StatsTab from './components/StatsTab';
import AssessmentsList from './components/AssessmentsList';
import FinancialTab from './components/FinancialTab';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function DashboardContent() {
  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  // Load assessments when user is set
  useEffect(() => {
    if (user && user.id) {
      console.log('👤 User is set, loading assessments for:', user.id);
      loadAssessments(null);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      let currentUser = null;
      
      if (session && session.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          profile: session.user.user_metadata
        };
        setUser(userData);
        currentUser = userData;
      } else {
        // Check localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          currentUser = userData;
        } else {
          // Redirect to login
          router.push('/login');
          return;
        }
      }
      
      // Assessments will be loaded by useEffect when user state updates
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const loadAssessments = async (session) => {
    try {
      console.log('📊 Loading assessments for user:', user?.id);
      
      // Get user ID from session or user state
      const userId = session?.user?.id || user?.id;
      
      if (!userId) {
        console.log('⚠️ No user ID available');
        return;
      }
      
      // Fetch directly from Supabase
      const { data: results, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', userId)
        .not('detailed_scores->assessment_type', 'is', null)
        .eq('detailed_scores->>assessment_type', 'RIASEC')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching assessments:', error);
        return;
      }
      
      console.log('📦 Raw results:', results);
      
      // Transform data
      const transformedAssessments = results.map(assessment => {
        const detailed_scores = assessment.detailed_scores || {};
        const holland_code = detailed_scores.holland_code || '';
        const ranking = detailed_scores.ranking || [];
        const primary_type = ranking[0] || { type: holland_code[0], percentage: 0 };

        return {
          id: assessment.id,
          holland_code,
          raw_scores: detailed_scores.raw_scores || {},
          ranking,
          completed_date: assessment.created_at,
          confidence_score: detailed_scores.confidence_score || 0,
          primary_type: {
            type: primary_type.type,
            name: getTypeName(primary_type.type),
            percentage: primary_type.percentage,
            icon: getTypeIcon(primary_type.type)
          },
          profile_type: assessment.profile_type,
          profile_description: assessment.profile_description
        };
      });
      
      setAssessments(transformedAssessments);
      console.log('✅ Loaded assessments:', transformedAssessments.length);
      
    } catch (error) {
      console.error('❌ Error loading assessments:', error);
    }
  };

  // Helper functions
  const getTypeName = (type) => {
    const names = {
      R: 'الواقعي',
      I: 'الاستقصائي',
      A: 'الفني',
      S: 'الاجتماعي',
      E: 'المغامر',
      C: 'التقليدي'
    };
    return names[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      R: '🔧',
      I: '🔬',
      A: '🎨',
      S: '🤝',
      E: '💼',
      C: '📊'
    };
    return icons[type] || '🎯';
  };

  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'البيانات الشخصية', icon: '👤' },
    { id: 'stats', label: 'التقييمات والإحصائيات', icon: '📊' },
    { id: 'financial', label: 'البيانات المالية', icon: '💰' }
  ];

  return (
    <>
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
            <Link href="/dashboard" className="nav-link">لوحة التحكم</Link>
            <div className="user-menu-container">
              <button className="user-menu-button">
                {user.name}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 50px' }}>
          
          {/* Welcome Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '48px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              مرحباً، {user.name}
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              إليك ملخص عن نشاطك ونتائجك
            </p>
          </div>

          {/* Tabs Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 30px',
                  borderRadius: '15px',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  direction: 'rtl',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === tab.id ? 'white' : '#9ca3af',
                  boxShadow: activeTab === tab.id
                    ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                    : 'none',
                  transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '20px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'stats' && <StatsTab user={user} assessments={assessments} />}
            {activeTab === 'financial' && <FinancialTab />}
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
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري التحميل...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
