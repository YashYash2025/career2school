'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SaveResultsButton({ algorithmResults, onSaveSuccess, onSaveError }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    const checkAuth = async () => {
      // تحقق من Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
      } else {
        // تحقق من localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser({ id: userData.id });
        }
      }
    };

    checkAuth();
  }, []);

  const handleSave = async () => {
    if (!user) {
      // إذا لم يكن مسجل دخول، وجهه لصفحة تسجيل الدخول
      alert('يرجى تسجيل الدخول أولاً لحفظ النتائج');
      window.location.href = '/login';
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      console.log('💾 حفظ النتائج...');
      console.log('📊 البيانات:', algorithmResults);

      const response = await fetch('/api/assessments/riasec/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          holland_code: algorithmResults.holland_code,
          raw_scores: algorithmResults.raw_scores,
          ranking: algorithmResults.ranking,
          confidence_score: algorithmResults.confidence_score || 0
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ تم حفظ النتائج بنجاح');
        setIsSaved(true);
        if (onSaveSuccess) {
          onSaveSuccess(result);
        }
      } else {
        console.error('❌ فشل حفظ النتائج:', result.error);
        setError(result.error);
        if (onSaveError) {
          onSaveError(result.error);
        }
      }
    } catch (err) {
      console.error('❌ خطأ في حفظ النتائج:', err);
      setError('حدث خطأ أثناء حفظ النتائج');
      if (onSaveError) {
        onSaveError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // إذا لم يكن مسجل دخول
  if (!user) {
    return (
      <button
        onClick={() => window.location.href = '/login'}
        style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}
      >
        <span style={{ fontSize: '20px' }}>🔐</span>
        <span>تسجيل الدخول لحفظ النتائج</span>
      </button>
    );
  }

  // إذا تم الحفظ بالفعل
  if (isSaved) {
    return (
      <div
        style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Cairo, Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}
      >
        <span style={{ fontSize: '20px' }}>✅</span>
        <span>تم حفظ النتائج بنجاح!</span>
      </div>
    );
  }

  // زر الحفظ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          padding: '15px 30px',
          background: isSaving 
            ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
            : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'Cairo, Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          opacity: isSaving ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSaving) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSaving) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        <span style={{ fontSize: '20px' }}>
          {isSaving ? '⏳' : '💾'}
        </span>
        <span>
          {isSaving ? 'جاري الحفظ...' : 'حفظ النتائج في حسابي'}
        </span>
      </button>

      {error && (
        <div
          style={{
            padding: '10px 15px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#ef4444',
            fontSize: '14px',
            fontFamily: 'Cairo, Arial, sans-serif',
            textAlign: 'center'
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
}
