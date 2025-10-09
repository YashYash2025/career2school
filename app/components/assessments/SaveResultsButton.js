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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login?redirect=/assessments/riasec/enhanced';
      return;
    }

    if (!algorithmResults) {
      setError('لا توجد نتائج لحفظها');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Prepare data
      const saveData = {
        holland_code: algorithmResults.holland_code,
        raw_scores: algorithmResults.raw_scores,
        ranking: algorithmResults.ranking,
        confidence_score: calculateConfidenceScore(algorithmResults.raw_scores)
      };

      console.log('💾 Saving results:', saveData);

      // Call API
      const response = await fetch('/api/assessments/riasec/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(saveData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'فشل حفظ النتائج');
      }

      console.log('✅ Results saved:', result);

      setIsSaved(true);
      
      // Call success callback
      if (onSaveSuccess) {
        onSaveSuccess(result);
      }

      // Show success message
      setTimeout(() => {
        alert('✅ تم حفظ النتائج بنجاح! يمكنك مراجعتها في لوحة التحكم.');
      }, 100);

    } catch (err) {
      console.error('❌ Save error:', err);
      setError(err.message);
      
      // Call error callback
      if (onSaveError) {
        onSaveError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate confidence score
  const calculateConfidenceScore = (scores) => {
    if (!scores || typeof scores !== 'object') return 0;
    
    const percentages = Object.values(scores)
      .map(scoreObj => parseFloat(scoreObj.percentage) || 0)
      .filter(val => !isNaN(val));
    
    if (percentages.length === 0) return 0;
    
    const max = Math.max(...percentages);
    const min = Math.min(...percentages);
    const range = max - min;
    const differentiation = range / (max || 1);
    
    return Math.round(Math.min(100, (differentiation * 70) + (max / 100 * 30)));
  };

  // If already saved, show success state
  if (isSaved) {
    return (
      <button
        disabled
        style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'Cairo, Arial, sans-serif',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          opacity: 0.8
        }}
      >
        <span>✅</span>
        <span>النتائج محفوظة</span>
      </button>
    );
  }

  // If not logged in
  if (!user) {
    return (
      <button
        onClick={handleSave}
        style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'Cairo, Arial, sans-serif',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
        }}
      >
        <span>🔐</span>
        <span>تسجيل الدخول لحفظ النتائج</span>
      </button>
    );
  }

  // Normal save button
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          padding: '15px 30px',
          background: isSaving 
            ? 'linear-gradient(135deg, #6b7280, #4b5563)'
            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'Cairo, Arial, sans-serif',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease',
          opacity: isSaving ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSaving) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSaving) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
          }
        }}
      >
        {isSaving ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
            <span>جاري الحفظ...</span>
          </>
        ) : (
          <>
            <span>💾</span>
            <span>حفظ النتائج في حسابي</span>
          </>
        )}
      </button>

      {error && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          color: '#ef4444',
          fontSize: '14px',
          fontFamily: 'Cairo, Arial, sans-serif',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
