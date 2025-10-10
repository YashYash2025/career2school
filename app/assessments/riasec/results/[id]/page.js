'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import RIASECInternationalResults from '../../../../components/assessments/RIASECInternationalResults';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [params.id]);

  const loadResult = async () => {
    try {
      console.log('📊 Loading result:', params.id);
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('❌ Error:', error);
        return;
      }

      console.log('✅ Result loaded:', data);
      setResult(data);
    } catch (error) {
      console.error('💥 Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    router.push('/assessments/riasec/enhanced');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '24px' }}>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>لم يتم العثور على النتيجة</div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  // Transform the data to match the format expected by RIASECInternationalResults
  const { detailed_scores } = result;
  const { raw_scores, ranking, holland_code, confidence_score } = detailed_scores;
  
  // Transform raw_scores to the format expected by the component
  // Component expects: { R: { raw: 48, percentage: 80 }, ... }
  const transformedRawScores = {};
  ranking.forEach(item => {
    transformedRawScores[item.type] = {
      raw: item.raw,
      percentage: item.percentage
    };
  });
  
  console.log('🔄 Transformed raw_scores:', transformedRawScores);
  
  const algorithmResults = {
    holland_code,
    raw_scores: transformedRawScores,
    ranking,
    confidence_score,
    indices: detailed_scores.indices || {},
    triad_details: detailed_scores.triad_details || {}
  };

  return (
    <RIASECInternationalResults
      algorithmResults={algorithmResults}
      onRetakeAssessment={handleRetake}
      onBackToAssessments={handleBackToDashboard}
    />
  );
}
