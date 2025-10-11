'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AssessmentsList({ userId }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchAssessments();
  }, [userId]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('⚠️ No active session');
        setLoading(false);
        return;
      }

      console.log('📡 Fetching assessments for user:', userId);

      // Call unified API for all assessments
      const response = await fetch('/api/assessments/user-results', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'فشل جلب التقييمات');
      }

      console.log('✅ Assessments loaded:', result.assessments.length);
      console.log('📊 Assessment types:', result.assessments.map(a => a.assessment_type));
      setAssessments(result.assessments);

    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          جاري تحميل التقييمات...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <div style={{ color: '#ef4444', fontSize: '16px', marginBottom: '20px' }}>
          {error}
        </div>
        <button
          onClick={fetchAssessments}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Empty state
  if (assessments.length === 0) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
        <h3 style={{ 
          color: 'var(--text-primary)', 
          fontSize: '20px', 
          marginBottom: '10px',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          لم تقم بإكمال أي تقييم بعد
        </h3>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '14px', 
          marginBottom: '30px' 
        }}>
          ابدأ أول تقييم لك الآن واكتشف ميولك المهنية!
        </p>
        <Link href="/assessments">
          <button style={{
            padding: '15px 30px',
            background: 'var(--primary-gradient)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            ابدأ تقييم جديد
          </button>
        </Link>
      </div>
    );
  }

  // Assessments list
  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h2 style={{ 
        fontSize: '24px',
        marginBottom: '20px',
        color: 'var(--text-primary)',
        fontFamily: 'Cairo, Arial, sans-serif',
        direction: 'rtl'
      }}>
        التقييمات المكتملة ({assessments.length})
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {assessments.map((assessment) => {
          const displayData = assessment.display_data || {};
          const isBig5 = assessment.assessment_type === 'Big5';
          const isRIASEC = assessment.assessment_type === 'RIASEC';
          
          return (
            <div 
              key={assessment.id} 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Icon */}
                <div style={{
                  fontSize: '40px',
                  background: isBig5 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {displayData.icon || '📊'}
                </div>
                
                {/* Info */}
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: isBig5 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                               'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {isBig5 ? 'مرآة الشخصية™' : isRIASEC ? 'بوصلة المهن™' : assessment.tool_name}
                  </div>
                  
                  <h3 style={{ 
                    color: 'var(--text-primary)', 
                    marginBottom: '5px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
                  }}>
                    {isBig5 ? (
                      displayData.profile_name || assessment.profile_type
                    ) : isRIASEC ? (
                      `كود هولاند: ${displayData.holland_code}`
                    ) : (
                      assessment.profile_type
                    )}
                  </h3>
                  
                  {isRIASEC && displayData.primary_type && (
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '14px',
                      marginBottom: '5px',
                      direction: 'rtl'
                    }}>
                      النمط الأساسي: {displayData.primary_type.name}
                    </p>
                  )}
                  
                  {isBig5 && displayData.top_trait && (
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '14px',
                      marginBottom: '5px',
                      direction: 'rtl'
                    }}>
                      أعلى بُعد: {displayData.top_trait.name_ar} ({displayData.top_trait.percentage?.toFixed(0)}%)
                    </p>
                  )}
                  
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '12px',
                    direction: 'rtl'
                  }}>
                    {new Date(assessment.completed_date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Score & Action */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px' 
              }}>
                {(isRIASEC && displayData.confidence_score) && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: displayData.confidence_score >= 80 ? 'var(--accent-neon)' : 
                                 displayData.confidence_score >= 60 ? 'var(--accent-purple)' : 
                                 'var(--accent-pink)',
                      color: 'var(--dark-bg)',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '5px'
                    }}>
                      {displayData.confidence_score}%
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '11px' 
                    }}>
                      درجة الثقة
                    </div>
                  </div>
                )}
                
                {isBig5 && assessment.percentage_score && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '5px'
                    }}>
                      {assessment.percentage_score?.toFixed(0)}%
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '11px' 
                    }}>
                      أعلى درجة
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    // Navigate to appropriate results page
                    if (isBig5) {
                      // For now, show alert - will need to create Big5 results page
                      alert('صفحة نتائج Big5 قيد التطوير');
                    } else if (isRIASEC) {
                      window.location.href = `/assessments/riasec/results?id=${assessment.id}`;
                    } else {
                      alert('عرض النتائج قريباً');
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    background: isBig5 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                               'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
                  }}
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <Link href="/assessments">
        <button style={{
          width: '100%',
          marginTop: '20px',
          padding: '15px',
          background: 'var(--primary-gradient)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl'
        }}>
          ابدأ تقييم جديد
        </button>
      </Link>
    </div>
  );
}
