'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Big5InternationalResults from '@/app/components/assessments/Big5InternationalResults';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Big5ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, [params.id]);

  const loadResults = async () => {
    try {
      console.log('📊 جلب نتائج Big5 للـ ID:', params.id);
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('❌ خطأ في جلب النتائج:', error);
        setError('لم نتمكن من العثور على هذا التقييم');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('التقييم غير موجود');
        setLoading(false);
        return;
      }

      console.log('✅ تم جلب النتائج:', data);
      
      // استخراج detailed_scores
      const algorithmResults = data.detailed_scores || {};
      
      setResults(algorithmResults);
      setLoading(false);
    } catch (err) {
      console.error('❌ خطأ:', err);
      setError('حدث خطأ في تحميل النتائج');
      setLoading(false);
    }
  };

  const handleRetake = () => {
    router.push('/assessments/big-five/enhanced?version=college');
  };

  const handleBackToAssessments = () => {
    router.push('/dashboard');
  };

  if (loading) {
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
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري تحميل النتائج...</div>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>{error}</div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '20px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}
          >
            العودة للداشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <Big5InternationalResults
      algorithmResults={results}
      onRetakeAssessment={handleRetake}
      onBackToAssessments={handleBackToAssessments}
    />
  );
}
