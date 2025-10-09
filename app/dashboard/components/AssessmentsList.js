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

      // Call API
      const response = await fetch('/api/assessments/riasec/user-results', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'فشل جلب التقييمات');
      }

      console.log('✅ Assessments loaded:', result.assessments.length);
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
        {assessments.map((assessment) => (
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
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {assessment.primary_type.icon}
              </div>
              
              {/* Info */}
              <div>
                <h3 style={{ 
                  color: 'var(--text-primary)', 
                  marginBottom: '5px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  direction: 'rtl'
                }}>
                  كود هولاند: {assessment.holland_code}
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '14px',
                  marginBottom: '5px',
                  direction: 'rtl'
                }}>
                  النمط الأساسي: {assessment.primary_type.name}
                </p>
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
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: assessment.confidence_score >= 80 ? 'var(--accent-neon)' : 
                             assessment.confidence_score >= 60 ? 'var(--accent-purple)' : 
                             'var(--accent-pink)',
                  color: 'var(--dark-bg)',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginBottom: '5px'
                }}>
                  {assessment.confidence_score}%
                </div>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '11px' 
                }}>
                  درجة الثقة
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Navigate to results page with assessment data
                  window.location.href = `/assessments/riasec/results?id=${assessment.id}`;
                }}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
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
        ))}
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
