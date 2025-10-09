'use client';

export default function StatsTab({ user, assessments }) {
  // Calculate stats from assessments
  const stats = {
    total_assessments: assessments?.length || 0,
    average_confidence: assessments?.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / assessments.length)
      : 0,
    latest_assessment: assessments?.[0]?.completed_date || null,
    most_common_type: assessments?.length > 0 
      ? assessments[0]?.primary_type?.type || 'N/A'
      : 'N/A'
  };

  return (
    <div>
      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            {stats.total_assessments}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            تقييم مكتمل
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            {stats.average_confidence}%
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            متوسط درجة الثقة
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            {stats.most_common_type}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            النمط الأكثر شيوعاً
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ef4444',
            marginBottom: '10px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            {stats.latest_assessment 
              ? new Date(stats.latest_assessment).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
              : 'لا يوجد'}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            آخر تقييم
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '20px',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl'
        }}>
          📊 سجل التقييمات
        </h2>

        {assessments && assessments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {assessments.map((assessment, index) => (
              <div
                key={assessment.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    fontSize: '32px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '10px',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {assessment.primary_type?.icon || '🎯'}
                  </div>
                  <div>
                    <div style={{
                      color: 'var(--text-primary)',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      direction: 'rtl'
                    }}>
                      {assessment.holland_code}
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      fontFamily: 'Cairo, Arial, sans-serif',
                      direction: 'rtl'
                    }}>
                      {new Date(assessment.completed_date).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: assessment.confidence_score >= 80 ? '#10b981' : 
                             assessment.confidence_score >= 60 ? '#3b82f6' : '#f59e0b',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {assessment.confidence_score}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
            <p>لم تقم بإكمال أي تقييم بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
