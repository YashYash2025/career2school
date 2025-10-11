'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AssessmentHeader Component
 * Header with navigation controls for assessments
 * 
 * @param {number} currentQuestion - Current question index
 * @param {number} totalQuestions - Total number of questions
 * @param {number} progress - Progress percentage (0-100)
 * @param {function} onCancel - Cancel handler
 * @param {string} assessmentType - Type of assessment (for display)
 */
const AssessmentHeader = ({
  currentQuestion,
  totalQuestions,
  progress,
  onCancel,
  assessmentType = 'التقييم'
}) => {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/assessments');
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl'
        }}>
          {/* Right side - Question info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              السؤال {currentQuestion + 1} من {totalQuestions}
            </div>
            <div style={{
              background: 'rgba(102, 126, 234, 0.2)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#667eea',
              fontWeight: '600'
            }}>
              {assessmentType}
            </div>
          </div>

          {/* Left side - Progress and controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Progress */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                {Math.round(progress)}%
              </div>
              <div style={{ fontSize: '12px', color: '#a8a8b8' }}>
                مكتمل
              </div>
            </div>

            {/* Control buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🏠 الرئيسية
              </button>

              <button
                onClick={handleCancelClick}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          maxWidth: '1200px',
          margin: '15px auto 0',
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            transition: 'width 0.3s ease'
          }} />
        </div>
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
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'scaleIn 0.3s ease',
            direction: 'rtl',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h3 style={{
              fontSize: '24px',
              color: '#ffffff',
              marginBottom: '15px',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              هل أنت متأكد؟
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#a8a8b8',
              marginBottom: '30px',
              lineHeight: '1.6',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              سيتم فقدان جميع إجاباتك الحالية. هل تريد حقاً إلغاء التقييم؟
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={confirmCancel}
                style={{
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
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
                نعم، إلغاء التقييم
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '12px 30px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
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
                لا، متابعة التقييم
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AssessmentHeader;
