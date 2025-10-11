'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import UnifiedNavigation from '@/app/components/UnifiedNavigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Big5VersionSelector() {
  const router = useRouter();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_tools_branding')
        .select('*')
        .eq('tool_code', 'BIG5')
        .single();

      if (!error && data) {
        setBranding(data);
      }
    } catch (err) {
      console.error('Error loading branding:', err);
    } finally {
      setLoading(false);
    }
  };

  const versions = [
    {
      id: 'middle-school',
      title: 'المدارس الإعدادية',
      titleEn: 'Middle School',
      titleFr: 'Collège',
      description: 'مصمم خصيصاً لطلاب المرحلة الإعدادية (12-15 سنة)',
      descriptionEn: 'Designed specifically for middle school students (12-15 years)',
      descriptionFr: 'Conçu spécifiquement pour les élèves du collège (12-15 ans)',
      icon: '🎒',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      features: [
        'أسئلة مبسطة ومناسبة للعمر',
        'تقييم شامل للشخصية',
        'توجيه مبكر للمسار المهني'
      ]
    },
    {
      id: 'high-school',
      title: 'المدارس الثانوية',
      titleEn: 'High School',
      titleFr: 'Lycée',
      description: 'مثالي لطلاب المرحلة الثانوية (15-18 سنة)',
      descriptionEn: 'Ideal for high school students (15-18 years)',
      descriptionFr: 'Idéal pour les élèves du lycée (15-18 ans)',
      icon: '📚',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      features: [
        'تحليل متقدم للشخصية',
        'ربط بالتخصصات الجامعية',
        'توصيات مهنية دقيقة'
      ]
    },
    {
      id: 'college',
      title: 'الجامعات والخريجين',
      titleEn: 'College & Fresh Graduates',
      titleFr: 'Université et Jeunes Diplômés',
      description: 'للطلاب الجامعيين والخريجين الجدد',
      descriptionEn: 'For college students and fresh graduates',
      descriptionFr: 'Pour les étudiants universitaires et les jeunes diplômés',
      icon: '🎓',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      features: [
        'تحليل احترافي شامل',
        'توافق مع سوق العمل',
        'استراتيجيات التطوير المهني'
      ]
    }
  ];

  const handleVersionSelect = (versionId) => {
    router.push(`/assessments/big-five/enhanced?version=${versionId}`);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: -1
      }}></div>

      {/* Navigation */}
      <UnifiedNavigation showBackButton={true} backUrl="/assessments" />

      {/* Main Content */}
      <main style={{ 
        paddingTop: '100px', 
        paddingLeft: '160px',
        paddingRight: '160px',
        paddingBottom: '60px',
        minHeight: '100vh',
        maxWidth: '1000px',
        margin: '0 auto',
        direction: 'rtl'
      }}>
        
        {/* Header Section Group */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
          padding: '40px 35px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          marginBottom: '50px',
          textAlign: 'center',
          color: 'white',
          direction: 'rtl'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px',
            direction: 'rtl'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '12px 16px',
              borderRadius: '15px',
              fontSize: '24px'
            }}>🧠</span>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              {branding?.brand_name_ar || 'مرآة الشخصية™'}
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#a8a8b8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            {branding?.slogan_ar || 'افهم نفسك لتختار مستقبلك'}
          </p>
        </div>

        {/* Scientific Excellence Group */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08))',
          padding: '35px',
          borderRadius: '25px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '40px',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              التميز العلمي والتقني
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '18px'
              }}>🔬</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              margin: 0,
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              مبني على نموذج Big Five العلمي والمعايير الدولية
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px', fontFamily: 'Cairo, Arial, sans-serif' }}>خوارزميات متطورة</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>أحدث الخوارزميات والتقنيات</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📊</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px', fontFamily: 'Cairo, Arial, sans-serif' }}>معايير علمية دولية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>مبني على أحدث الأبحاث</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(240, 147, 251, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px', fontFamily: 'Cairo, Arial, sans-serif' }}>نتائج فورية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>احصل على نتائجك في ثوان</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📈</div>
              <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '6px', fontFamily: 'Cairo, Arial, sans-serif' }}>تقارير تفاعلية</h3>
              <p style={{ fontSize: '11px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>تقارير مصورة وتفاعلية</p>
            </div>
          </div>
        </div>

        {/* Smart Features Group */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.08))',
          padding: '30px',
          borderRadius: '25px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          marginBottom: '50px',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            direction: 'rtl',
            fontFamily: 'Cairo, Arial, sans-serif',
            fontSize: '18px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            لماذا تختار خوارزمياتنا المتطورة؟
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '18px'
            }}>⚡</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔄</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px', fontFamily: 'Cairo, Arial, sans-serif' }}>تحليل ذكي</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>خوارزميات ذكية</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🎯</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px', fontFamily: 'Cairo, Arial, sans-serif' }}>توصيات مخصصة</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>مبنية على شخصيتك</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🚀</div>
              <h4 style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '3px', fontFamily: 'Cairo, Arial, sans-serif' }}>رؤى مستقبلية</h4>
              <p style={{ fontSize: '10px', color: '#a8a8b8', fontFamily: 'Cairo, Arial, sans-serif' }}>تحليل اتجاهات المستقبل</p>
            </div>
          </div>
        </div>

        {/* Versions Section */}
        <div style={{ 
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          padding: '30px',
          borderRadius: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          direction: 'rtl'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '26px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              اختر النسخة المناسبة لك
              <span style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '18px'
              }}>🌍</span>
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              margin: 0,
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              {branding?.description_ar || '3 تقييمات متطورة من مرآة School2Career'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {versions.map((version) => (
              <div
                key={version.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '25px',
                  padding: '35px',
                  border: `2px solid ${version.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => handleVersionSelect(version.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${version.color}40`;
                  e.currentTarget.style.borderColor = version.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `${version.color}40`;
                }}
              >
                {/* Icon */}
                <div style={{
                  fontSize: '64px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {version.icon}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: version.color,
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  direction: 'rtl'
                }}>
                  {version.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '16px',
                  color: '#a8a8b8',
                  marginBottom: '25px',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  direction: 'rtl'
                }}>
                  {version.description}
                </p>

                {/* Features */}
                <div style={{ marginBottom: '25px' }}>
                  {version.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#d1d5db',
                        fontFamily: 'Cairo, Arial, sans-serif',
                        direction: 'rtl'
                      }}
                    >
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: version.color,
                        flexShrink: 0
                      }}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: version.gradient,
                    border: 'none',
                    borderRadius: '15px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${version.color}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ابدأ التقييم ←
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
