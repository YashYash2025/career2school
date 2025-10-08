import { useState, useCallback } from 'react';

const useRIASECInternational = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const calculateResults = useCallback(async (responses, options = {}) => {
    console.log('🚀 useRIASECInternational: بداية calculateResults');
    console.log('📦 الاستجابات الواردة:', responses);
    console.log('⚙️ الخيارات:', options);
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        responses,
        userId: options.userId || null,
        toolCode: options.toolCode || 'RIASEC-180',
        options: {
          country: options.country || 'international',
          version: options.version || 'full',
          lambda: options.lambda || 0.35,
          sdGate: options.sdGate || 1.0,
          ...options
        }
      };
      
      console.log('📦 البيانات المرسلة للـ API:', payload);

      const response = await fetch('/api/assessments/riasec/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📡 رد الـ API (status):', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ خطأ في الـ API:', errorData);
        throw new Error(errorData.error || 'فشل في حساب النتائج');
      }

      const data = await response.json();
      console.log('🎉 نتائج الـ API:', data);
      
      setResults(data.data);
      return data.data;

    } catch (err) {
      console.error('Error calculating RIASEC results:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestions = useCallback(async (version = '180', language = 'ar', randomize = false, useStratifiedSampling = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        version,
        language,
        randomize: randomize.toString(),
        stratified: useStratifiedSampling.toString()
      });

      const response = await fetch(`/api/assessments/riasec/questions?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحميل الأسئلة');
      }

      const data = await response.json();
      
      // Log stratified sampling info
      if (data.data.metadata.stratified_sampling) {
        console.log('✅ Questions fetched with balanced RIASEC distribution');
      }
      
      return data.data;

    } catch (err) {
      console.error('Error fetching RIASEC questions:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserHistory = useCallback(async (userId, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        userId,
        limit: limit.toString()
      });

      const response = await fetch(`/api/assessments/riasec/calculate?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحميل التاريخ');
      }

      const data = await response.json();
      return data.data;

    } catch (err) {
      console.error('Error fetching user history:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetailedResults = useCallback(async (resultId, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        resultId,
        format: options.format || 'detailed',
        includeComparison: (options.includeComparison || false).toString()
      });

      const response = await fetch(`/api/assessments/riasec/results?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحميل النتائج التفصيلية');
      }

      const data = await response.json();
      return data.data;

    } catch (err) {
      console.error('Error fetching detailed results:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAnalytics = useCallback(async (userId, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        userId,
        type: options.type || 'comprehensive',
        timeframe: options.timeframe || '1year',
        includeNorms: (options.includeNorms || false).toString()
      });

      const response = await fetch(`/api/assessments/riasec/analytics?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إنشاء التحليلات');
      }

      const data = await response.json();
      return data.data;

    } catch (err) {
      console.error('Error generating analytics:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const testAlgorithm = useCallback(async (testType = 'algorithm_validation', parameters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        test_type: testType,
        parameters
      };

      const response = await fetch('/api/assessments/riasec/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في اختبار الخوارزمية');
      }

      const data = await response.json();
      return data;

    } catch (err) {
      console.error('Error testing algorithm:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Utility function to format responses for the algorithm
  const formatResponses = useCallback((answers, questions) => {
    const formatted = {};
    
    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer !== undefined && answer !== null) {
        // تحويل -1 (لا أحب) إلى 0 حسب نظام [0, 0, 1]
        const normalizedAnswer = answer === -1 ? 0 : answer;
        formatted[`${question.type}${question.order || index + 1}`] = normalizedAnswer;
      }
    });
    
    return formatted;
  }, []);

  // Utility function to validate responses completeness
  const validateResponses = useCallback((responses, expectedCount = 180) => {
    const responseCount = Object.keys(responses).length;
    const isComplete = responseCount >= expectedCount;
    const completionRate = (responseCount / expectedCount) * 100;
    
    return {
      isComplete,
      responseCount,
      expectedCount,
      completionRate: Math.round(completionRate)
    };
  }, []);

  // Get version-specific question count
  const getQuestionCount = useCallback((version) => {
    const versionMap = {
      'RIASEC-30': 30,
      'RIASEC-60': 60,
      'RIASEC-180': 180,
      '30': 30,
      '60': 60,
      '180': 180,
      'short': 30,
      'medium': 60,
      'full': 180
    };
    
    return versionMap[version] || 180;
  }, []);

  return {
    // State
    loading,
    error,
    results,
    
    // Main functions
    calculateResults,
    fetchQuestions,
    fetchUserHistory,
    getDetailedResults,
    generateAnalytics,
    testAlgorithm,
    
    // Utility functions
    formatResponses,
    validateResponses,
    getQuestionCount,
    clearResults,
    clearError
  };
};

export default useRIASECInternational;