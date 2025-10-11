// Import React and necessary hooks
import React, { useState, useEffect, useRef } from 'react';

// Import chart libraries
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  Filler,
} from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  Filler
);

const Big5InternationalResults = ({ 
  algorithmResults, 
  onRetakeAssessment, 
  onBackToAssessments 
}) => {
  console.log('🎉 Big5InternationalResults: بداية component');
  console.log('📦 algorithmResults:', algorithmResults);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const resultsRef = useRef(null);
  
  // استخراج البيانات
  const raw_scores = algorithmResults?.raw_scores || {};
  const profile_code = algorithmResults?.profile_code || '';
  const profile_name = algorithmResults?.profile_name || { ar: '', en: '', fr: '' };
  const ranking = algorithmResults?.ranking || [];
  const summary = algorithmResults?.summary || '';
  const indices = algorithmResults?.indices || {};
  
  // Colors
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    text: '#ffffff',
    textSecondary: '#a8a8b8'
  };

  // Trait colors and info
  const traitInfo = {
    O: { name: 'الانفتاح', icon: '🌟', color: '#667eea' },
    C: { name: 'يقظة الضمير', icon: '⚙️', color: '#10b981' },
    E: { name: 'الانبساطية', icon: '🤝', color: '#f59e0b' },
    A: { name: 'المقبولية', icon: '❤️', color: '#ec4899' },
    N: { name: 'العصابية', icon: '🧠', color: '#8b5cf6' }
  };

  // جلب التوصيات المهنية
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!profile_code) return;
      
      console.log('🚀 جلب توصيات Big5 لـ:', profile_code);
      setLoadingRecommendations(true);
      
      try {
        const response = await fetch(`/api/assessments/big5/recommendations?profile=${profile_code}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب التوصيات:', data);
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب التوصيات:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    
    fetchRecommendations();
  }, [profile_code]);

  // إعداد بيانات الرادار
  const prepareRadarData = () => {
    if (!raw_scores) return null;
    
    const labels = Object.keys(raw_scores).map(key => traitInfo[key]?.name || key);
    const data = Object.values(raw_scores).map(s => s.percentage);
    
    return {
      labels,
      datasets: [{
        label: 'نتائج Big Five',
        data,
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 2,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#667eea'
      }]
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: { family: 'Cairo, Arial, sans-serif', size: 14 }
        }
      },
      title: {
        display: true,
        text: 'نتائج تقييم Big Five',
        color: '#ffffff',
        font: { family: 'Cairo, Arial, sans-serif', size: 18, weight: 'bold' }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#ffffff',
          font: { family: 'Cairo, Arial, sans-serif', size: 12 }
        },
        ticks: {
          color: '#a8a8b8',
          backdropColor: 'transparent',
          min: 0,
          max: 100
        }
      }
    }
  };

  // Top 3 traits
  const top3Traits = ranking.slice(0, 3);

  // Render Overview Tab
  const renderOverview = () => (
    <div>
      {/* Profile Name - أولاً */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '40px',
        border: '3px solid rgba(102, 126, 234, 0.4)',
        marginBottom: '40px',
        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎯</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#667eea',
          marginBottom: '15px',
          direction: 'rtl'
        }}>
          ملفك الشخصي
        </h2>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '25px',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl'
        }}>
          {profile_name.ar || 'الشخصية المتوازنة'}
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#ffffff',
            direction: 'rtl',
            lineHeight: '1.8',
            marginBottom: '15px'
          }}>
            النسب المئوية لأبعاد شخصيتك الخمسة:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            {Object.entries(traitInfo).map(([key, info]) => {
              const score = raw_scores[key];
              return (
                <div key={key} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '15px',
                  border: `2px solid ${info.color}40`
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{info.icon}</div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: info.color,
                    marginBottom: '5px'
                  }}>
                    {score?.percentage?.toFixed(0) || 0}%
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    direction: 'rtl'
                  }}>
                    {info.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Card - ثانياً */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '40px',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '64px' }}>📝</div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#10b981',
            margin: 0,
            direction: 'rtl'
          }}>
            ملخص شخصيتك
          </h2>
        </div>
        <p style={{
          fontSize: '20px',
          lineHeight: '1.8',
          color: '#ffffff',
          direction: 'rtl',
          fontFamily: 'Cairo, Arial, sans-serif',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '25px',
          borderRadius: '15px',
          borderRight: '4px solid #10b981'
        }}>
          {summary}
        </p>
      </div>

      {/* Top 3 Traits */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '30px',
        padding: '40px',
        marginBottom: '40px',
        border: '2px solid rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          🏆 أبرز 3 سمات في شخصيتك
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          position: 'relative'
        }}>
          {top3Traits.map((trait, index) => (
            <div key={trait.trait} style={{
              textAlign: 'center',
              padding: '30px',
              background: index === 0 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                : 'rgba(255, 255, 255, 0.08)',
              borderRadius: '25px',
              border: `3px solid ${index === 0 ? '#10b981' : traitInfo[trait.trait]?.color}`,
              minWidth: '200px',
              transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
              boxShadow: index === 0 ? '0 10px 30px rgba(16, 185, 129, 0.3)' : 'none',
              position: 'relative'
            }}>
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}>
                  🥇 الأعلى
                </div>
              )}
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>
                {traitInfo[trait.trait]?.icon}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: index === 0 ? '#10b981' : traitInfo[trait.trait]?.color,
                marginBottom: '10px'
              }}>
                {trait.percentage.toFixed(0)}%
              </div>
              <div style={{
                fontSize: '18px',
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                {trait.name_ar}
              </div>
              <div style={{
                fontSize: '14px',
                color: colors.textSecondary,
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px 12px',
                borderRadius: '10px'
              }}>
                {raw_scores[trait.trait]?.level_ar}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '40px',
        border: '2px solid rgba(102, 126, 234, 0.3)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          📊 الرسم البياني الراداري
        </h3>
        
        <div style={{ height: '500px' }}>
          {prepareRadarData() && (
            <Radar data={prepareRadarData()} options={radarOptions} />
          )}
        </div>
      </div>
    </div>
  );

  // Render Analysis Tab
  const renderAnalysis = () => (
    <div>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        🔍 تحليل متقدم
      </h2>

      {/* All Traits Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {Object.entries(raw_scores).map(([trait, data]) => (
          <div key={trait} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '25px',
            border: `2px solid ${traitInfo[trait]?.color}30`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '48px' }}>{traitInfo[trait]?.icon}</div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: traitInfo[trait]?.color,
                  marginBottom: '5px'
                }}>
                  {traitInfo[trait]?.name}
                </h3>
                <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                  {data.level_ar}
                </div>
              </div>
            </div>

            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: traitInfo[trait]?.color,
              marginBottom: '10px'
            }}>
              {data.percentage.toFixed(0)}%
            </div>

            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div style={{
                height: '100%',
                width: `${data.percentage}%`,
                background: traitInfo[trait]?.color,
                transition: 'width 0.5s ease'
              }}></div>
            </div>

            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: colors.textSecondary,
              direction: 'rtl'
            }}>
              {data.interpretation}
            </p>
          </div>
        ))}
      </div>

      {/* Indices */}
      {indices && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {indices.profile_elevation && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
              <h4 style={{ color: '#3b82f6', fontSize: '18px', marginBottom: '10px' }}>
                قوة الاهتمامات
              </h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                {indices.profile_elevation.score}%
              </div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '10px' }}>
                {indices.profile_elevation.interpretation}
              </div>
            </div>
          )}

          {indices.differentiation && (
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
              <h4 style={{ color: '#8b5cf6', fontSize: '18px', marginBottom: '10px' }}>
                وضوح الملف
              </h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {indices.differentiation.score.toFixed(0)}
              </div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '10px' }}>
                {indices.differentiation.interpretation}
              </div>
            </div>
          )}

          {indices.consistency && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔄</div>
              <h4 style={{ color: '#10b981', fontSize: '18px', marginBottom: '10px' }}>
                التوافق
              </h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                {indices.consistency.score.toFixed(0)}%
              </div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '10px' }}>
                {indices.consistency.interpretation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render Careers Tab
  const renderCareers = () => {
    // ترجمة المسارات المهنية للعربية
    const translateCareerText = (text) => {
      if (!text) return text;
      
      const translations = {
        // Career categories
        'STEM & Engineering': 'العلوم والتكنولوجيا والهندسة',
        'Data & Analytics': 'البيانات والتحليلات',
        'Software & IT': 'البرمجيات وتقنية المعلومات',
        'Design & Creative Media': 'التصميم والإعلام الإبداعي',
        'Marketing & Communications': 'التسويق والاتصالات',
        'Entrepreneurship': 'ريادة الأعمال',
        'Education & L&D': 'التعليم والتطوير',
        'Healthcare & Life Sciences': 'الرعاية الصحية وعلوم الحياة',
        'Environmental & Sustainability': 'البيئة والاستدامة',
        'Public Service & Law': 'الخدمة العامة والقانون',
        'Finance & Business': 'المالية والأعمال',
        'Sales & Customer Relations': 'المبيعات وعلاقات العملاء',
        'Operations & Management': 'العمليات والإدارة',
        
        // Common terms
        'Top Career Matches': 'أفضل المسارات المهنية المناسبة',
        'Strong Fit': 'مناسب بشدة',
        'Good Fit': 'مناسب',
        'Moderate Fit': 'مناسب بشكل متوسط',
        'Why this fits': 'لماذا يناسبك',
        'Key strengths': 'نقاط القوة الرئيسية',
        'Development areas': 'مجالات التطوير',
        'Recommended roles': 'الأدوار الموصى بها',
        'Next steps': 'الخطوات التالية'
      };
      
      let translatedText = text;
      Object.entries(translations).forEach(([en, ar]) => {
        const regex = new RegExp(en, 'gi');
        translatedText = translatedText.replace(regex, ar);
      });
      
      return translatedText;
    };

    return (
      <div>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>💼</div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px'
          }}>
            المسارات المهنية المناسبة لك
          </h2>
          <p style={{
            fontSize: '18px',
            color: colors.textSecondary,
            direction: 'rtl'
          }}>
            بناءً على تحليل شخصيتك، إليك أفضل المسارات المهنية التي تناسبك
          </p>
        </div>

        {loadingRecommendations && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '25px',
            padding: '60px',
            textAlign: 'center',
            border: '2px solid rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px',
              animation: 'pulse 2s infinite'
            }}>⏳</div>
            <div style={{
              fontSize: '20px',
              color: '#ffffff',
              marginBottom: '10px'
            }}>
              جاري تحليل ملفك الشخصي...
            </div>
            <div style={{
              fontSize: '16px',
              color: colors.textSecondary
            }}>
              يرجى الانتظار بينما نجد أفضل المسارات لك
            </div>
          </div>
        )}

        {!loadingRecommendations && recommendations && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            borderRadius: '25px',
            padding: '40px',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 15px 35px rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
            }}>
              <div style={{ fontSize: '48px' }}>🎯</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#10b981',
                margin: 0
              }}>
                التوصيات المهنية الخاصة بك
              </h3>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '15px',
              padding: '30px',
              borderRight: '4px solid #10b981'
            }}>
              <div style={{
                fontSize: '18px',
                lineHeight: '2',
                color: '#ffffff',
                direction: 'rtl',
                fontFamily: 'Cairo, Arial, sans-serif',
                whiteSpace: 'pre-wrap'
              }}>
                {translateCareerText(recommendations)}
              </div>
            </div>
            
            <div style={{
              marginTop: '25px',
              padding: '20px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '15px',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '24px' }}>💡</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#667eea'
                }}>
                  نصيحة مهنية
                </div>
              </div>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                direction: 'rtl',
                margin: 0,
                lineHeight: '1.6'
              }}>
                هذه التوصيات مبنية على تحليل علمي لشخصيتك. ننصحك بالبحث أكثر في المجالات التي تثير اهتمامك والتحدث مع محترفين في هذه المجالات.
              </p>
            </div>
          </div>
        )}

        {!loadingRecommendations && !recommendations && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '25px',
            padding: '60px',
            textAlign: 'center',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <h3 style={{
              fontSize: '24px',
              color: '#ffffff',
              marginBottom: '15px'
            }}>
              لا توجد توصيات محددة
            </h3>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              direction: 'rtl',
              lineHeight: '1.6'
            }}>
              لم نتمكن من العثور على توصيات مهنية محددة لملفك الشخصي حالياً.
              <br />
              يمكنك مراجعة التحليل المتقدم لفهم نقاط قوتك بشكل أفضل.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '40px 20px',
      color: colors.text
    }} ref={resultsRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            🎉 نتائج تقييم Big Five
          </h1>
          <p style={{ fontSize: '18px', color: colors.textSecondary }}>
            تحليل شامل لأبعاد شخصيتك الخمسة
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', name: '📊 نظرة عامة', icon: '📊' },
            { id: 'analysis', name: '🔍 تحليل متقدم', icon: '🔍' },
            { id: 'careers', name: '💼 مسارات مهنية', icon: '💼' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: `2px solid ${activeTab === tab.id ? '#667eea' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 'bold' : '600',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, Arial, sans-serif'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'careers' && renderCareers()}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '50px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onRetakeAssessment}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}
          >
            🔄 إعادة التقييم
          </button>

          <button
            onClick={onBackToAssessments}
            style={{
              padding: '15px 30px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}
          >
            ← العودة للتقييمات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Big5InternationalResults;
