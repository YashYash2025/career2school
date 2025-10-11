'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Big5International from '../../../lib/algorithms/Big5International';
import UnifiedNavigation from '../../../components/UnifiedNavigation';
import AnswerCard from '../../../components/assessments/AnswerCard';

export default function Big5Assessment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const versionParam = searchParams.get('version') || 'college';
  
  const [currentStage, setCurrentStage] = useState('loading');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [toolId, setToolId] = useState(null);
  const [sessionId] = useState(null); // سنستخدم null ونخلي الـ database يولد UUID تلقائياً
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // تحديد tool_code حسب النسخة
  const getToolCode = () => {
    if (versionParam === 'middle') return 'BIG5_60_MIDDLE';
    if (versionParam === 'high') return 'BIG5_60_HIGH';
    return 'BIG5_60_COLLEGE';
  };

  // جلب الأسئلة من قاعدة البيانات
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Check authentication first
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔐 Session check:', {
          hasSession: !!session,
          sessionError: sessionError,
          user: session?.user?.email
        });
        
        if (!session || sessionError) {
          console.warn('⚠️ No active session - redirecting to login');
          const currentPath = `/assessments/big-five/enhanced?version=${versionParam}`;
          alert('يجب تسجيل الدخول أولاً لإكمال التقييم');
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
        
        console.log('✅ User authenticated:', session.user.email);
        
        const toolCode = getToolCode();
        console.log('🔍 جلب أسئلة Big5 لـ:', toolCode);
        
        const response = await fetch(`/api/assessments/questions?tool_code=${toolCode}`);
        const data = await response.json();
        
        if (data.success && data.questions) {
          setQuestions(data.questions);
          setToolId(data.tool_id);
          setStartTime(Date.now());
          setCurrentStage('assessment');
          console.log('✅ تم جلب', data.questions.length, 'سؤال');
        } else {
          console.error('❌ فشل جلب الأسئلة');
          setCurrentStage('error');
        }
      } catch (error) {
        console.error('❌ خطأ في جلب الأسئلة:', error);
        setCurrentStage('error');
      }
    };

    fetchQuestions();
  }, [versionParam, router]);

  // بدء التقييم
  const startAssessment = () => {
    setStartTime(Date.now());
    setCurrentStage('assessment');
  };

  // حفظ الإجابة
  const handleAnswer = (value) => {
    const questionKey = `q${questions[currentQuestion].order_index}`;
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
    
    // الانتقال للسؤال التالي
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // انتهى التقييم
      calculateResults();
    }
  };

  // حساب النتائج
  const calculateResults = async () => {
    setIsProcessing(true);
    setCurrentStage('processing');
    
    try {
      const algorithm = new Big5International();
      const calculatedResults = algorithm.calculate(answers, questions);
      
      // Get session token for authentication
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('🔐 Session status:', session ? 'Authenticated' : 'Not authenticated');
      
      // Get user_id from session or localStorage
      let userId = session?.user?.id;
      if (!userId) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          userId = userData.id;
          console.log('📦 Using user_id from localStorage:', userId);
        }
      }
      
      // حفظ النتائج في قاعدة البيانات
      const saveResponse = await fetch('/api/assessments/big5/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({
          tool_id: toolId,
          session_id: sessionId,
          user_id: userId, // إضافة user_id كـ fallback
          responses: answers,
          results: calculatedResults,
          duration: Math.floor((Date.now() - startTime) / 1000)
        })
      });
      
      console.log('💾 Save response status:', saveResponse.status);
      
      const saveData = await saveResponse.json();
      console.log('💾 Save response data:', saveData);
      
      if (saveData.success) {
        console.log('✅ Results saved successfully with ID:', saveData.result_id);
        setResults({ ...calculatedResults, result_id: saveData.result_id });
        setCurrentStage('results');
      } else {
        console.error('❌ Failed to save results:', saveData.error);
        console.error('❌ Error details:', saveData.details);
        // حتى لو فشل الحفظ، نعرض النتائج
        setResults(calculatedResults);
        setCurrentStage('results');
      }
    } catch (error) {
      console.error('❌ خطأ في حساب النتائج:', error);
      setCurrentStage('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // الرجوع للسؤال السابق
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Colors
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    dark: '#0f0f1e',
    card: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textSecondary: '#a8a8b8'
  };

  // Big Five Traits
  const traits = {
    O: { name: 'الانفتاح', icon: '🌟', color: '#667eea' },
    C: { name: 'يقظة الضمير', icon: '⚙️', color: '#10b981' },
    E: { name: 'الانبساطية', icon: '🤝', color: '#f59e0b' },
    A: { name: 'المقبولية', icon: '❤️', color: '#ec4899' },
    N: { name: 'العصابية', icon: '🧠', color: '#8b5cf6' }
  };

  // Render Loading
  if (currentStage === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري تحميل التقييم...</div>
        </div>
      </div>
    );
  }

  // Render Error
  if (currentStage === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>حدث خطأ في تحميل التقييم</div>
          <button
            onClick={() => router.push('/assessments')}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            العودة للتقييمات
          </button>
        </div>
      </div>
    );
  }

  // Render Intro
  if (currentStage === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          color: 'white'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🧠</div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              مرآة الشخصية™
            </h1>
            <p style={{ 
              fontSize: '24px', 
              color: colors.text,
              marginBottom: '10px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              افهم نفسك لتختار مستقبلك
            </p>
            <p style={{ 
              fontSize: '16px', 
              color: colors.textSecondary,
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              اكتشف أبعاد شخصيتك الخمسة الكبرى
            </p>
          </div>

          {/* Traits */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {Object.entries(traits).map(([key, trait]) => (
              <div key={key} style={{
                background: colors.card,
                padding: '25px',
                borderRadius: '20px',
                border: `2px solid ${trait.color}30`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{trait.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: trait.color }}>
                  {trait.name}
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                {questions.length}
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>سؤال علمي</div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏱️</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
                15-20
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>دقيقة</div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                عالية
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>الدقة</div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              padding: '25px',
              borderRadius: '20px',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔬</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
                علمي
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary }}>معتمد</div>
            </div>
          </div>

          {/* Info */}
          <div style={{
            background: colors.card,
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '30px',
            border: '2px solid rgba(102, 126, 234, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '20px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              📋 ماذا ستحصل عليه:
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '24px' }}>✅</div>
                <div style={{ fontSize: '16px', color: colors.textSecondary, direction: 'rtl' }}>
                  تحليل شامل لشخصيتك
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '24px' }}>✅</div>
                <div style={{ fontSize: '16px', color: colors.textSecondary, direction: 'rtl' }}>
                  نقاط القوة والضعف
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '24px' }}>✅</div>
                <div style={{ fontSize: '16px', color: colors.textSecondary, direction: 'rtl' }}>
                  المسارات المهنية المناسبة
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '24px' }}>✅</div>
                <div style={{ fontSize: '16px', color: colors.textSecondary, direction: 'rtl' }}>
                  توصيات للتطوير الذاتي
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startAssessment}
              style={{
                padding: '20px 60px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 ابدأ التقييم
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Assessment
  if (currentStage === 'assessment' && questions[currentQuestion]) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentAnswer = answers[`q${question.order_index}`];

    return (
      <>
        {/* Navigation */}
        <UnifiedNavigation showBackButton={true} backUrl="/assessments" />
        
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '40px 20px',
          paddingTop: '100px'
        }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          color: 'white'
        }}>
          {/* Progress Section */}
          <div style={{ marginBottom: '30px' }}>
            {/* Question Counter */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              direction: 'rtl'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.text,
                fontFamily: 'Cairo, Arial, sans-serif'
              }}>
                السؤال {currentQuestion + 1} من {questions.length}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                {Math.round(progress)}%
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, #667eea, #764ba2)`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question Card */}
          <div style={{
            background: colors.card,
            padding: '40px',
            borderRadius: '20px',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            marginBottom: '30px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: '24px',
              textAlign: 'center',
              lineHeight: '1.6',
              direction: 'rtl'
            }}>
              {question.question_ar}
            </p>
          </div>

          {/* Answer Options - Using AnswerCard Component */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            marginBottom: '30px',
            maxWidth: '900px',
            margin: '0 auto 30px auto'
          }}>
            {[
              { value: 1, label: 'لا أوافق بشدة', emoji: '😟', color: '#ef4444' },
              { value: 2, label: 'لا أوافق', emoji: '🙁', color: '#f97316' },
              { value: 3, label: 'محايد', emoji: '😐', color: '#f59e0b' },
              { value: 4, label: 'أوافق', emoji: '🙂', color: '#22c55e' },
              { value: 5, label: 'أوافق بشدة', emoji: '😊', color: '#10b981' }
            ].map(option => (
              <AnswerCard
                key={option.value}
                value={option.value}
                emoji={option.emoji}
                label={option.label}
                color={option.color}
                isSelected={currentAnswer === option.value}
                onClick={handleAnswer}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '30px',
            direction: 'rtl'
          }}>
            {/* Previous Question Button */}
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ← السؤال السابق
              </button>
            )}

            {/* Cancel Button */}
            <button
              onClick={() => setShowCancelModal(true)}
              style={{
                padding: '12px 24px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, Arial, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ❌ إلغاء التقييم
            </button>
          </div>

          {/* Cancel Confirmation Modal */}
          {showCancelModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                direction: 'rtl',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
                <h3 style={{
                  fontSize: '20px',
                  color: '#ffffff',
                  marginBottom: '12px',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  هل أنت متأكد؟
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#a8a8b8',
                  marginBottom: '25px',
                  lineHeight: '1.5',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  سيتم فقدان جميع إجاباتك. هل تريد إلغاء التقييم؟
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => router.push('/assessments')}
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Cairo, Arial, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    نعم، إلغاء
                  </button>

                  <button
                    onClick={() => setShowCancelModal(false)}
                    style={{
                      padding: '10px 24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Cairo, Arial, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    لا، متابعة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </>
    );
  }

  // Render Processing
  if (currentStage === 'processing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⚙️</div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>جاري تحليل إجاباتك...</div>
          <div style={{ fontSize: '16px', color: colors.textSecondary }}>يرجى الانتظار</div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render Results
  if (currentStage === 'results' && results) {
    // استيراد component النتائج
    const Big5InternationalResults = require('../../../components/assessments/Big5InternationalResults').default;
    
    return (
      <Big5InternationalResults
        algorithmResults={results}
        onRetakeAssessment={() => {
          setCurrentStage('intro');
          setCurrentQuestion(0);
          setAnswers({});
          setResults(null);
        }}
        onBackToAssessments={() => router.push('/assessments')}
      />
    );
  }

  // Render Results (fallback)
  if (currentStage === 'results_old' && results) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎉 نتائج تقييم Big Five
          </h1>

          {/* Profile Code */}
          <div style={{
            background: colors.card,
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>ملفك الشخصي:</h2>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {results.profile_code}
            </div>
          </div>

          {/* Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {Object.entries(results.raw_scores).map(([trait, data]) => (
              <div key={trait} style={{
                background: colors.card,
                padding: '25px',
                borderRadius: '20px',
                border: `2px solid ${traits[trait].color}30`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{traits[trait].icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {traits[trait].name}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: traits[trait].color, marginBottom: '5px' }}>
                  {data.percentage.toFixed(0)}%
                </div>
                <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                  {data.level_ar}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: colors.card,
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>📝 الملخص:</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', direction: 'rtl' }}>
              {results.summary}
            </p>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📊 لوحة التحكم
            </button>
            <button
              onClick={() => router.push('/assessments')}
              style={{
                padding: '15px 30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 تقييم آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
