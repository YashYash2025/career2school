'use client';

import React, { useState, useEffect } from 'react';

const RIASECSchool2CareerResults = ({ 
  algorithmResults, 
  onRetakeAssessment, 
  onBackToAssessments, 
  userInfo 
}) => {
  const [currentView, setCurrentView] = useState('overview');
  const [animationStep, setAnimationStep] = useState(0);

  // Color palette focused on dreams and aspirations
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2', 
    success: '#10b981',
    warning: '#f59e0b',
    dream: '#8b5cf6',
    future: '#06b6d4',
    text: '#ffffff',
    textSecondary: '#a8a8b8',
    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  if (!algorithmResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2>لم يتم العثور على نتائج</h2>
        </div>
      </div>
    );
  }

  const renderOverview = () => {
    const { personality_insights, dream_pathway, future_readiness } = algorithmResults;
    
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '30px',
          padding: '50px',
          marginBottom: '40px',
          textAlign: 'center',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '60px',
            opacity: 0.1,
            transform: `rotate(${animationStep * 90}deg)`,
            transition: 'transform 0.5s ease'
          }}>
            🌟
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            🎯 اكتشف مسارك المهني
          </h1>
          
          <div style={{
            fontSize: '24px',
            color: colors.textSecondary,
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            شخصيتك المهنية: <span style={{ 
              color: colors.success, 
              fontWeight: 'bold',
              fontSize: '28px'
            }}>
              {personality_insights?.primary_type?.name}
            </span>
          </div>

          {/* Motivation Message */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            padding: '25px',
            borderRadius: '20px',
            fontSize: '20px',
            fontStyle: 'italic',
            color: colors.text,
            fontFamily: 'Cairo, Arial, sans-serif',
            lineHeight: '1.8'
          }}>
            &ldquo;{dream_pathway?.motivation_message}&rdquo;
          </div>

          {/* Success Probability */}
          <div style={{ marginTop: '30px' }}>
            <div style={{ fontSize: '18px', color: colors.textSecondary, marginBottom: '10px' }}>
              احتمالية تحقيق أحلامك المهنية
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${dream_pathway?.success_probability || 0}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: '10px',
                transition: 'width 2s ease-in-out'
              }} />
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.success
              }}>
                {Math.round(dream_pathway?.success_probability || 0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Primary Strength */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              color: colors.success, 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🎯 نقطة قوتك الأساسية
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {personality_insights?.primary_type?.score}%
            </div>
            <div style={{ fontSize: '18px', color: colors.textSecondary }}>
              {personality_insights?.primary_type?.description}
            </div>
          </div>

          {/* Future Readiness */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              color: colors.future, 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🚀 جاهزيتك للمستقبل
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {Math.round(future_readiness?.overall_readiness || 0)}%
            </div>
            <div style={{ fontSize: '18px', color: colors.textSecondary }}>
              مدى استعدادك لوظائف المستقبل
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💫</div>
          <div style={{ 
            fontSize: '24px', 
            fontStyle: 'italic',
            color: colors.text,
            fontFamily: 'Cairo, Arial, sans-serif',
            lineHeight: '1.6'
          }}>
            &ldquo;{algorithmResults.emotional_connection?.inspiration_quote}&rdquo;
          </div>
        </div>
      </div>
    );
  };

  const renderCareerPath = () => {
    const { career_matches, dream_pathway } = algorithmResults;
    
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '36px', 
          textAlign: 'center', 
          marginBottom: '40px',
          color: colors.text
        }}>
          🛤️ خريطة مسارك المهني
        </h2>

        {/* Dream Pathway */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '25px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '28px', marginBottom: '30px', color: colors.dream }}>
            🌟 رؤيتك طويلة المدى
          </h3>
          <div style={{ 
            fontSize: '20px', 
            lineHeight: '1.8',
            color: colors.text,
            marginBottom: '30px'
          }}>
            {dream_pathway?.long_term_vision}
          </div>

          {/* Steps Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {/* Immediate Goals */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h4 style={{ color: colors.success, marginBottom: '15px' }}>
                ⚡ أهداف فورية
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {dream_pathway?.immediate_goals?.map((goal, index) => (
                  <li key={index} style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: colors.textSecondary
                  }}>
                    • {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Short-term Steps */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h4 style={{ color: colors.future, marginBottom: '15px' }}>
                📈 خطوات قصيرة المدى
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {dream_pathway?.short_term_steps?.map((step, index) => (
                  <li key={index} style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: colors.textSecondary
                  }}>
                    • {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Career Matches */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(career_matches || {}).map(([type, match]) => (
            <div key={type} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: `1px solid ${match.match_level === 'excellent' ? 'rgba(16, 185, 129, 0.5)' : 
                                   match.match_level === 'good' ? 'rgba(6, 182, 212, 0.5)' : 
                                   'rgba(156, 163, 175, 0.3)'}`
            }}>
              <h4 style={{ 
                fontSize: '20px', 
                marginBottom: '15px',
                color: colors.text
              }}>
                {getTypeIcon(type)} {getTypeName(type)}
              </h4>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                color: match.match_level === 'excellent' ? colors.success : 
                       match.match_level === 'good' ? colors.future : colors.textSecondary
              }}>
                {Math.round(match.score)}%
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                أفضل الوظائف:
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '10px' 
              }}>
                {match.careers?.slice(0, 4).map((career, index) => (
                  <li key={index} style={{
                    fontSize: '14px',
                    color: colors.text,
                    marginBottom: '5px',
                    padding: '5px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonalMessage = () => {
    const { emotional_connection, personality_insights } = algorithmResults;
    
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '30px',
          padding: '50px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '30px' }}>💝</div>
          
          <h2 style={{ 
            fontSize: '36px', 
            marginBottom: '30px',
            color: colors.dream
          }}>
            رسالة خاصة لك
          </h2>

          <div style={{
            fontSize: '22px',
            lineHeight: '1.8',
            color: colors.text,
            fontFamily: 'Cairo, Arial, sans-serif',
            marginBottom: '40px'
          }}>
            {emotional_connection?.personal_message}
          </div>

          {/* Confidence Boosters */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: colors.dream, marginBottom: '20px' }}>
              💪 معززات الثقة
            </h3>
            {emotional_connection?.confidence_boosters?.map((booster, index) => (
              <div key={index} style={{
                fontSize: '18px',
                color: colors.text,
                marginBottom: '15px',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px'
              }}>
                ✨ {booster}
              </div>
            ))}
          </div>

          <div style={{
            fontSize: '20px',
            fontStyle: 'italic',
            color: colors.future,
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            &ldquo;تذكر: كل حلم كبير بدأ بخطوة صغيرة 🌱&rdquo;
          </div>
        </div>
      </div>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      R: '🔧', I: '🔬', A: '🎨', 
      S: '🤝', E: '👑', C: '📊'
    };
    return icons[type] || '⭐';
  };

  const getTypeName = (type) => {
    const names = {
      R: 'الواقعي العملي',
      I: 'الاستقصائي الباحث',
      A: 'الفني الإبداعي',
      S: 'الاجتماعي الخدومي',
      E: 'القيادي المغامر',
      C: 'التقليدي المنظم'
    };
    return names[type] || type;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background
    }}>
      {/* Navigation Header */}
      <div style={{
        background: 'rgba(15, 15, 30, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
        padding: '20px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              onClick={onBackToAssessments}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: colors.text,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← العودة للتقييمات
            </button>
            
            <button
              onClick={onRetakeAssessment}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 إعادة التقييم
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '5px'
          }}>
            {[
              { key: 'overview', label: '👋 نظرة عامة', icon: '🎯' },
              { key: 'career', label: '🛤️ المسار المهني', icon: '🚀' },
              { key: 'message', label: '💝 رسالة شخصية', icon: '💌' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                style={{
                  background: currentView === tab.key 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))'
                    : 'transparent',
                  color: colors.text,
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentView === tab.key ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ color: colors.text }}>
        {currentView === 'overview' && renderOverview()}
        {currentView === 'career' && renderCareerPath()}
        {currentView === 'message' && renderPersonalMessage()}
      </div>
    </div>
  );
};

export default RIASECSchool2CareerResults;