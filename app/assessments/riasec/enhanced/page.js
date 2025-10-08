'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useRIASECInternational from '../../../hooks/useRIASECInternational';
import RIASECInternationalResults from '../../../components/assessments/RIASECInternationalResults';
import RIASECSchool2CareerResults from '../../../components/assessments/RIASECSchool2CareerResults';
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
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar as RechartsRadar, ResponsiveContainer, BarChart, 
  Bar as RechartsBar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend as RechartsLegend, 
  PieChart, Pie, Cell 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const RIASECInternationalAssessment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const versionParam = searchParams.get('version');
  
  const [currentStage, setCurrentStage] = useState(versionParam ? 'loading' : 'intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [sessionId] = useState(`riasec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [startTime, setStartTime] = useState(null);
  const [assessmentConfig, setAssessmentConfig] = useState({
    version: versionParam || '60',
    country: 'international',
    language: 'ar'
  });
  
  // Enhanced state for new features
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChartType, setSelectedChartType] = useState('chartjs');
  const [assessmentVersion, setAssessmentVersion] = useState('student');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [savedResults, setSavedResults] = useState([]);
  const [showQuickSummary, setShowQuickSummary] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [linkedinJobs, setLinkedinJobs] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [careerMatches, setCareerMatches] = useState([]);
  const resultsRef = useRef(null);
  
  // Enhanced career database with 2024 salary data
  const enhancedCareerDatabase = {
    'R': [
      {
        title: 'مهندس ميكانيكي',
        match: 95,
        hollandCode: 'R',
        description: 'تصميم وتطوير الآلات والأنظمة الميكانيكية',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '35,000 - 55,000 ريال/سنة',
          '3-7': '55,000 - 85,000 ريال/سنة', 
          '8-15': '85,000 - 120,000 ريال/سنة',
          '15+': '120,000 - 200,000 ريال/سنة'
        },
        skills: ['تحليل هندسي', 'تصميم CAD', 'حل المشكلات', 'تفكير نقدي'],
        industries: ['الصناعة', 'الطيران', 'السيارات', 'الطاقة'],
        workEnvironment: 'مكاتب ومصانع ومختبرات',
        jobOutlook: 'نمو متوقع 4% حتى 2032',
        linkedinJobs: 1250
      },
      {
        title: 'فني كمبيوتر',
        match: 88,
        hollandCode: 'RC',
        description: 'صيانة وإصلاح أجهزة الكمبيوتر والشبكات',
        educationLevel: '📜 دبلوم (سنتان)',
        salaryRanges: {
          '0-2': '20,000 - 35,000 ريال/سنة',
          '3-7': '35,000 - 50,000 ريال/سنة',
          '8-15': '50,000 - 65,000 ريال/سنة', 
          '15+': '65,000 - 85,000 ريال/سنة'
        },
        skills: ['استكشاف الأخطاء', 'صيانة الأجهزة', 'شبكات', 'أنظمة تشغيل'],
        industries: ['تقنية المعلومات', 'التعليم', 'الصحة', 'الحكومة'],
        workEnvironment: 'مكاتب ومراكز خدمة',
        jobOutlook: 'نمو سريع 8% حتى 2032',
        linkedinJobs: 890
      }
    ],
    'I': [
      {
        title: 'عالم بيانات',
        match: 96,
        hollandCode: 'IRA',
        description: 'تحليل البيانات الضخمة لاستخراج رؤى تجارية',
        educationLevel: '🎯 ماجستير متخصص',
        salaryRanges: {
          '0-2': '60,000 - 90,000 ريال/سنة',
          '3-7': '90,000 - 150,000 ريال/سنة',
          '8-15': '150,000 - 250,000 ريال/سنة',
          '15+': '250,000 - 400,000 ريال/سنة'
        },
        skills: ['برمجة Python/R', 'إحصاء', 'تعلم آلة', 'تصور البيانات'],
        industries: ['التقنية', 'المصرفية', 'الصحة', 'التجارة الإلكترونية'],
        workEnvironment: 'مكاتب ومختبرات بحثية',
        jobOutlook: 'نمو استثنائي 35% حتى 2032',
        linkedinJobs: 2100
      },
      {
        title: 'باحث طبي',
        match: 92,
        hollandCode: 'IR',
        description: 'إجراء البحوث الطبية وتطوير العلاجات',
        educationLevel: '🏛️ دكتوراه/بحث علمي',
        salaryRanges: {
          '0-2': '80,000 - 120,000 ريال/سنة',
          '3-7': '120,000 - 200,000 ريال/سنة',
          '8-15': '200,000 - 350,000 ريال/سنة',
          '15+': '350,000 - 500,000 ريال/سنة'
        },
        skills: ['منهجية البحث', 'إحصاء حيوي', 'كتابة علمية', 'تحليل نقدي'],
        industries: ['الأدوية', 'المستشفيات', 'الجامعات', 'الحكومة'],
        workEnvironment: 'مختبرات ومراكز بحثية',
        jobOutlook: 'نمو قوي 13% حتى 2032',
        linkedinJobs: 450
      }
    ],
    'A': [
      {
        title: 'مصمم UX/UI',
        match: 94,
        hollandCode: 'AIS',
        description: 'تصميم واجهات المستخدم وتحسين تجربة الاستخدام',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '45,000 - 70,000 ريال/سنة',
          '3-7': '70,000 - 120,000 ريال/سنة',
          '8-15': '120,000 - 180,000 ريال/سنة',
          '15+': '180,000 - 280,000 ريال/سنة'
        },
        skills: ['تصميم واجهات', 'بحث المستخدم', 'نماذج أولية', 'تفكير تصميمي'],
        industries: ['التقنية', 'الألعاب', 'التجارة الإلكترونية', 'الإعلام'],
        workEnvironment: 'استوديوهات تصميم ومكاتب إبداعية',
        jobOutlook: 'نمو سريع 13% حتى 2032',
        linkedinJobs: 1680
      }
    ],
    'S': [
      {
        title: 'أخصائي نفسي',
        match: 93,
        hollandCode: 'SIA',
        description: 'تقديم العلاج النفسي والدعم الصحي النفسي',
        educationLevel: '🎯 ماجستير متخصص',
        salaryRanges: {
          '0-2': '50,000 - 80,000 ريال/سنة',
          '3-7': '80,000 - 130,000 ريال/سنة',
          '8-15': '130,000 - 200,000 ريال/سنة',
          '15+': '200,000 - 300,000 ريال/سنة'
        },
        skills: ['استشارة نفسية', 'تشخيص', 'علاج سلوكي', 'تواصل فعال'],
        industries: ['الصحة', 'التعليم', 'الخدمات الاجتماعية', 'القطاع الخاص'],
        workEnvironment: 'عيادات ومستشفيات ومراكز صحية',
        jobOutlook: 'نمو قوي 8% حتى 2032',
        linkedinJobs: 340
      }
    ],
    'E': [
      {
        title: 'مدير تسويق',
        match: 95,
        hollandCode: 'EAS',
        description: 'تطوير وتنفيذ استراتيجيات التسويق والعلامة التجارية',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '60,000 - 100,000 ريال/سنة',
          '3-7': '100,000 - 180,000 ريال/سنة',
          '8-15': '180,000 - 300,000 ريال/سنة',
          '15+': '300,000 - 500,000 ريال/سنة'
        },
        skills: ['استراتيجية تسويق', 'إدارة فرق', 'تحليل السوق', 'قيادة'],
        industries: ['التجزئة', 'التقنية', 'الخدمات المالية', 'التجارة الإلكترونية'],
        workEnvironment: 'مكاتب شركات ومؤسسات',
        jobOutlook: 'نمو قوي 10% حتى 2032',
        linkedinJobs: 2340
      }
    ],
    'C': [
      {
        title: 'محاسب قانوني',
        match: 96,
        hollandCode: 'CES',
        description: 'إعداد وتدقيق البيانات المالية والتقارير المحاسبية',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '40,000 - 60,000 ريال/سنة',
          '3-7': '60,000 - 95,000 ريال/سنة',
          '8-15': '95,000 - 150,000 ريال/سنة',
          '15+': '150,000 - 250,000 ريال/سنة'
        },
        skills: ['محاسبة مالية', 'تدقيق', 'تحليل مالي', 'برامج محاسبية'],
        industries: ['المحاسبة', 'المصرفية', 'الحكومة', 'الشركات'],
        workEnvironment: 'مكاتب محاسبية وشركات',
        jobOutlook: 'نمو متوسط 6% حتى 2032',
        linkedinJobs: 1450
      }
    ]
  };

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes slideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .slide-in {
        animation: slideIn 0.5s ease-out;
      }
      .fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      .pulse {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Enhanced utility functions
  const calculateConfidenceScore = (scores) => {
    const values = Object.values(scores);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    const differentiation = range / (max || 1);
    return Math.round(Math.min(100, (differentiation * 80) + (max / (questions.length/6) * 20)));
  };

  const getMatchLevel = (percentage) => {
    if (percentage >= 85) {
      return { level: 'تطابق ممتاز', color: '#10b981', icon: '🏆', badge: 'ممتاز' };
    } else if (percentage >= 70) {
      return { level: 'تطابق جيد جداً', color: '#3b82f6', icon: '🏅', badge: 'جيد جداً' };
    } else if (percentage >= 55) {
      return { level: 'تطابق جيد', color: '#f59e0b', icon: '⭐', badge: 'جيد' };
    } else {
      return { level: 'خيارات إضافية', color: '#6b7280', icon: '📝', badge: 'إضافي' };
    }
  };

  const getExperienceLabel = (level) => {
    const labels = {
      '0-2': '👼 مبتدئين (0-2 سنة)',
      '3-7': '💼 متوسط (3-7 سنوات)',
      '8-15': '🌟 خبراء (8-15 سنة)',
      '15+': '🏆 قيادات (15+ سنة)'
    };
    return labels[level] || level;
  };

  const generateShareLink = (password) => {
    const resultData = {
      scores: results?.scores || {},
      timestamp: Date.now(),
      password: password || null,
      sessionId
    };
    const encoded = btoa(JSON.stringify(resultData));
    return `${window.location.origin}/shared-results/${encoded}`;
  };

  const exportToPDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('riasec-assessment-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const saveToDatabase = async (results) => {
    try {
      const response = await fetch('/api/assessments/riasec/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          results,
          assessmentVersion,
          timestamp: new Date().toISOString(),
          duration: startTime ? Math.round((new Date() - startTime) / 1000) : 0
        })
      });
      
      if (response.ok) {
        console.log('✅ Results saved to database successfully');
        return true;
      } else {
        console.error('❌ Failed to save results to database');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      return false;
    }
  };

  const getCareerMatches = (scores) => {
    if (!scores) return [];
    
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    const primaryType = sortedTypes[0][0];
    const matches = [];
    
    // Get careers for primary type
    if (enhancedCareerDatabase[primaryType]) {
      matches.push(...enhancedCareerDatabase[primaryType]);
    }
    
    // Calculate match percentages based on score alignment
    return matches.map(career => {
      const primaryScore = scores[primaryType];
      const maxPossibleScore = questions.length / 6 * 3; // 3 is max per question
      const matchPercentage = Math.round((primaryScore / maxPossibleScore) * 100);
      
      return {
        ...career,
        match: Math.min(matchPercentage, 98), // Cap at 98%
        matchLevel: getMatchLevel(matchPercentage)
      };
    }).sort((a, b) => b.match - a.match);
  };

  // Auto-start assessment when version is provided via URL
  useEffect(() => {
    if (versionParam) {
      console.log(`🚀 Auto-starting assessment for version: ${versionParam}`);
      setAssessmentConfig(prev => ({
        ...prev,
        version: versionParam
      }));
      // Start loading questions immediately
      setCurrentStage('loading');
    }
  }, [versionParam]);

  const {
    loading,
    error,
    results,
    calculateResults,
    fetchQuestions,
    formatResponses,
    validateResponses,
    clearError
  } = useRIASECInternational();

  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    dark: '#0f0f1e',
    card: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textSecondary: '#a8a8b8'
  };

  // تعريف الدوال قبل useEffect
  const loadQuestions = async () => {
    try {
      console.log('🔄 Loading questions with config:', assessmentConfig);
      
      // Direct API call to ensure we get the questions
      const params = new URLSearchParams({
        version: assessmentConfig.version,
        language: assessmentConfig.language,
        randomize: 'true'
      });
      
      const response = await fetch(`/api/assessments/riasec/questions?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 API Response:', data);
      
      if (data.success && data.data && data.data.questions) {
        console.log(`✅ Loaded ${data.data.questions.length} questions from API`);
        console.log('📋 Using real database questions!');
        console.log('🔍 First 3 questions:', data.data.questions.slice(0, 3).map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          order: q.order
        })));
        setQuestions(data.data.questions);
        setStartTime(new Date()); // Set start time when questions are loaded
        setCurrentStage('assessment'); // Go directly to assessment
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (err) {
      console.error('❌ Error loading questions:', err);
      setCurrentStage('error');
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    // Auto-advance only if it's the last question
    if (currentQuestion === questions.length - 1) {
      console.log('📝 آخر سؤال تم الإجابة عليه - سيبدأ حساب النتائج...');
      setTimeout(() => {
        finishAssessment(newAnswers);
      }, 500);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentQuestion === questions.length - 1 && answers[currentQuestion] !== undefined) {
      // Finish assessment if on last question and answered
      finishAssessment(answers);
    }
  };

  useEffect(() => {
    if (currentStage === 'loading' && questions.length === 0) {
      loadQuestions();
    }
  }, [currentStage, assessmentConfig.version, loadQuestions, questions.length]); // Added missing dependencies

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (currentStage !== 'assessment') return;
      
      // Number keys for answers
      if (event.key >= '0' && event.key <= '2') {
        const value = parseInt(event.key);
        handleAnswer(value);
      }
      
      // Arrow keys for navigation
      if (event.key === 'ArrowLeft' && currentQuestion > 0) {
        goToPreviousQuestion();
      }
      if (event.key === 'ArrowRight' && currentQuestion < questions.length - 1 && answers[currentQuestion] !== undefined) {
        goToNextQuestion();
      }
      
      // Enter to finish assessment on last question
      if (event.key === 'Enter' && currentQuestion === questions.length - 1 && answers[currentQuestion] !== undefined) {
        goToNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStage, currentQuestion, answers, questions.length, goToNextQuestion, goToPreviousQuestion, handleAnswer]); // Added missing dependencies

  const finishAssessment = async (finalAnswers) => {
    try {
      console.log('🎯 بداية finishAssessment');
      console.log('📊 الإجابات النهائية:', finalAnswers);
      console.log('❓ عدد الأسئلة:', questions.length);
      console.log('⚙️ إعدادات التقييم:', assessmentConfig);
      
      setCurrentStage('calculating');
      
      // Format responses for the algorithm
      const formattedResponses = formatResponses(finalAnswers, questions);
      console.log('🔄 الاستجابات المنسقة:', formattedResponses);
      console.log('📈 عدد الاستجابات المنسقة:', Object.keys(formattedResponses).length);
      
      // Get correct question count based on version
      const getExpectedQuestionCount = (version) => {
        switch(version) {
          case '30': return 30;
          case '60': return 60; 
          case '180': return 180;
          case 'school2career': return 120;
          case 'school2career-30': return 30;
          case 'school2career-60': return 60;
          case 'school2career-120': return 120;
          default: return questions.length; // Use actual loaded questions count
        }
      };
      
      const expectedCount = getExpectedQuestionCount(assessmentConfig.version);
      console.log('🎯 العدد المتوقع:', expectedCount);
      
      // Validate completeness
      const validation = validateResponses(formattedResponses, expectedCount);
      console.log('✅ نتائج التحقق:', validation);
      
      if (!validation.isComplete) {
        console.warn(`Assessment incomplete: ${validation.completionRate}% complete (${validation.responseCount}/${validation.expectedCount})`);
      } else {
        console.log(`✅ Assessment complete: ${validation.completionRate}% (${validation.responseCount}/${validation.expectedCount})`);
      }

      console.log('🚀 بداية استدعاء calculateResults...');
      
      // Calculate results using the appropriate algorithm
      const algorithmResults = await calculateResults(formattedResponses, {
        toolCode: (assessmentConfig.version === 'school2career' || 
                  assessmentConfig.version.startsWith('school2career-'))
          ? 'RIASEC_SCHOOL2CAREER' 
          : `RIASEC-${assessmentConfig.version}`,
        country: assessmentConfig.country,
        version: assessmentConfig.version === '30' ? 'short' : 
                 assessmentConfig.version === '60' ? 'medium' : 
                 assessmentConfig.version === 'school2career' || 
                 assessmentConfig.version.startsWith('school2career-') ? 'enhanced' : 'full'
      });
      
      console.log('🎉 نتائج الخوارزمية:', algorithmResults);

      setCurrentStage('results');
      
    } catch (err) {
      console.error('❌ خطأ في حساب النتائج:', err);
      console.error('❌ تفاصيل الخطأ:', err.stack);
      setCurrentStage('error');
    }
  };

  const retakeAssessment = () => {
    setCurrentStage('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setQuestions([]);
    clearError();
  };

  const backToAssessments = () => {
    router.push('/assessments');
  };

  // Intro Stage
  if (currentStage === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '40px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          direction: 'rtl',
          textAlign: 'center'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 30px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px'
            }}>
              🎯
            </div>
            
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: colors.text, marginBottom: '15px' }}>
              تقييم RIASEC الدولي المتقدم
            </h1>
            <p style={{ fontSize: '20px', color: colors.textSecondary, marginBottom: '10px' }}>
              خوارزمية دولية متطورة لتحديد الميول المهنية
            </p>
            <p style={{ fontSize: '16px', color: colors.textSecondary }}>
              يدعم 3 نسخ مختلفة (30، 60، 180 سؤال) مع معايير دولية دقيقة
            </p>
          </div>

          {/* Version Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '20px', color: colors.text, marginBottom: '20px', textAlign: 'center' }}>
              اختر نسخة التقييم - النسخة المختارة: {assessmentConfig.version} سؤال
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {[
                { 
                  version: '30', 
                  title: 'النسخة السريعة', 
                  duration: '10-15 دقيقة', 
                  questions: '30 سؤال',
                  description: 'مثالية للتقييم السريع والحصول على فكرة عامة عن الميول',
                  icon: '⚡'
                },
                { 
                  version: '60', 
                  title: 'النسخة المتوسطة', 
                  duration: '20-25 دقيقة', 
                  questions: '60 سؤال', 
                  recommended: true,
                  description: 'توازن مثالي بين الدقة والوقت - موصى بها للأغلبية',
                  icon: '🎯'
                },
                { 
                  version: '180', 
                  title: 'النسخة الشاملة', 
                  duration: '45-60 دقيقة', 
                  questions: '180 سؤال',
                  description: 'التحليل الأكثر دقة وتفصيلاً مع تقرير شامل ومفصل',
                  icon: '📊'
                },
                { 
                  version: 'school2career', 
                  title: 'نسخة School2Career المطورة', 
                  duration: '30-35 دقيقة', 
                  questions: '120 سؤال',
                  featured: true,
                  description: 'نسخة حديثة تركز على الوظائف المستقبلية مع تقارير ملهمة تساعدك على تحقيق أحلامك المهنية',
                  icon: '🚀'
                }
              ].map((option) => (
                <button
                  key={option.version}
                  onClick={() => setAssessmentConfig(prev => ({ ...prev, version: option.version }))}
                  style={{
                    padding: '25px',
                    background: assessmentConfig.version === option.version 
                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${assessmentConfig.version === option.version 
                      ? 'rgba(102, 126, 234, 0.8)' 
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '20px',
                    color: colors.text,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    textAlign: 'right', // Right-align text for Arabic
                    direction: 'rtl', // RTL direction
                    transform: assessmentConfig.version === option.version ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: assessmentConfig.version === option.version 
                      ? '0 8px 25px rgba(102, 126, 234, 0.3)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (assessmentConfig.version !== option.version) {
                      e.target.style.transform = 'scale(1.01)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (assessmentConfig.version !== option.version) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                >
                  {option.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '15px', // Changed from right to left for RTL
                      background: `linear-gradient(135deg, ${colors.accent}, #f5576c)`,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(240, 147, 251, 0.3)'
                    }}>
                      ⭐ موصى به
                    </div>
                  )}
                  {option.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '15px', // Changed from right to left for RTL
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                    }}>
                      🚀 جديد
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', direction: 'rtl' }}>
                    <div style={{ order: 1 }}> {/* Text comes first in RTL */}
                      <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', textAlign: 'right' }}>
                        {option.title}
                      </div>
                      <div style={{ fontSize: '14px', color: colors.textSecondary, textAlign: 'right' }}>
                        {option.questions} • {option.duration}
                      </div>
                    </div>
                    <span style={{ fontSize: '28px', order: 2 }}>{option.icon}</span> {/* Icon comes after in RTL */}
                  </div>
                  <div style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: '1.4', textAlign: 'right' }}>
                    {option.description}
                  </div>
                  {assessmentConfig.version === option.version && (
                    <div style={{
                      marginTop: '15px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      textAlign: 'center',
                      color: '#10b981',
                      fontWeight: 'bold'
                    }}>
                      ✓ النسخة المختارة
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Country Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', color: colors.text, marginBottom: '15px', textAlign: 'center' }}>
              اختر المعايير المرجعية
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              {[
                { code: 'international', name: 'دولية', flag: '🌍' },
                { code: 'egypt', name: 'مصر', flag: '🇪🇬' },
                { code: 'saudi', name: 'السعودية', flag: '🇸🇦' }
              ].map((country) => (
                <button
                  key={country.code}
                  onClick={() => setAssessmentConfig(prev => ({ ...prev, country: country.code }))}
                  style={{
                    padding: '12px 20px',
                    background: assessmentConfig.country === country.code 
                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${assessmentConfig.country === country.code 
                      ? 'rgba(102, 126, 234, 0.8)' 
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {[
              { icon: '🔬', title: 'خوارزمية علمية', desc: 'معايير دولية متطورة' },
              { icon: '📊', title: 'تحليل شامل', desc: 'مؤشرات جودة متقدمة' },
              { icon: '🎯', title: 'دقة عالية', desc: 'نتائج موثوقة ومفصلة' },
              { icon: '🌟', title: 'تقرير تفاعلي', desc: 'عرض بصري متطور' }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{feature.icon}</div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '5px' }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '13px', color: colors.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => startAssessment()}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading 
                ? 'rgba(255, 255, 255, 0.1)' 
                : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                جاري التحميل...
              </>
            ) : (
              <>
                🚀 ابدأ التقييم الآن
              </>
            )}
          </button>
          
          {/* Auto-start button if version is provided via URL */}
          {versionParam && (
            <button
              onClick={() => startAssessment({ version: versionParam })}
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                marginTop: '15px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              ⚡ بدء مباشر - نسخة {versionParam === 'school2career' ? 'School2Career (120 سؤال)' : `${versionParam} سؤال`}
            </button>
          )}
          
          {/* Error Display */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ خطأ: {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading Stage (when starting assessment directly)
  if (currentStage === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>🎯</div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>جاري تحضير التقييم...</div>
          <div style={{ fontSize: '16px', color: colors.textSecondary }}>
            تحميل الأسئلة وإعداد الخوارزمية
          </div>
        </div>
      </div>
    );
  }

  // Assessment Stage
  if (currentStage === 'assessment' || currentStage === 'loading') {
    if (currentStage === 'loading' || questions.length === 0) {
      return (
        <div style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '20px',
              animation: 'spin 2s linear infinite'
            }}>🔄</div>
            <div style={{ fontSize: '24px', marginBottom: '10px', direction: 'rtl' }}>جاري تحميل الأسئلة...</div>
            <div style={{ fontSize: '16px', color: colors.textSecondary, direction: 'rtl' }}>
              نسخة {assessmentConfig.version === 'school2career' 
                ? 'School2Career المطورة (120 سؤال)' 
                : `${assessmentConfig.version} سؤال`} - 
              {assessmentConfig.country === 'international' ? 'معايير دولية' : 
               assessmentConfig.country === 'egypt' ? 'معايير مصر' : 'معايير السعودية'}
            </div>
          </div>
        </div>
      );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
        paddingTop: '20px'
      }}>
        {/* Debug Info Header */}
        <div style={{
          background: 'rgba(255, 69, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(255, 69, 0, 0.3)',
          padding: '15px',
          marginBottom: '10px',
          direction: 'rtl'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '14px' }}>
              <div>
                <strong>📄 معلومات السؤال:</strong><br/>
                ID: {currentQ.id}<br/>
                Order: {currentQ.order}<br/>
                Type: {currentQ.type}<br/>
                Tool Code: RIASEC_{assessmentConfig.version}
              </div>
              <div>
                <strong>🔤 النصوص:</strong><br/>
                العربي: {currentQ.text || currentQ.question_ar || currentQ.activity_ar || 'غير متوفر'}<br/>
                English: {currentQ.question_en || currentQ.activity_en || currentQ.text_en || 'غير متوفر'}<br/>
                Français: {currentQ.question_fr || currentQ.activity_fr || currentQ.text_fr || 'غير متوفر'}
              </div>
              <div>
                <strong>📊 معلومات التقييم:</strong><br/>
                النسخة: {assessmentConfig.version}<br/>
                البلد: {assessmentConfig.country}<br/>
                اللغة: {assessmentConfig.language}<br/>
                عدد الأسئلة: {questions.length}
              </div>
              <div>
                <strong>✅ حالة الإجابة:</strong><br/>
                الإجابة الحالية: {answers[currentQuestion] !== undefined ? 
                  (answers[currentQuestion] === -1 ? 'لا أحب (0)' : 
                   answers[currentQuestion] === 0 ? 'محايد (0)' : 'أحب (1)') : 'لم يتم الإجابة'}<br/>
                تم الإجابة على: {Object.keys(answers).length} من {questions.length}
              </div>
            </div>
            
            {/* Raw Data Debug */}
            <div style={{ marginTop: '10px', fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
              <strong>🔍 بيانات السؤال الخام:</strong><br/>
              {JSON.stringify(currentQ, null, 2)}
            </div>
          </div>
        </div>

        {/* Header */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
          padding: '20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentStage('intro')}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <span>←</span>
                العودة للإعدادات
              </button>
              
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                style={{
                  background: currentQuestion === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                  color: currentQuestion === 0 ? colors.textSecondary : colors.text,
                  border: `1px solid ${currentQuestion === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>⇦</span>
                السؤال السابق
              </button>
            </div>
            
            <div style={{ color: colors.text, textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                السؤال {currentQuestion + 1} من {questions.length}
              </div>
              <div style={{ fontSize: '14px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
                <span style={{ 
                  background: 'rgba(102, 126, 234, 0.2)', 
                  padding: '4px 10px', 
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>
                  📊 النسخة: {assessmentConfig.version === 'school2career' 
                    ? 'School2Career المطورة' 
                    : `${assessmentConfig.version} سؤال`}
                </span>
                <span style={{ 
                  background: 'rgba(118, 75, 162, 0.2)', 
                  padding: '4px 10px', 
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>
                  🌍 المعايير: {assessmentConfig.country === 'international' ? 'دولية' : assessmentConfig.country === 'egypt' ? 'مصر' : 'السعودية'}
                </span>
              </div>
            </div>
            
            <div style={{ color: colors.text, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{Math.round(progress)}%</div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>مكتمل</div>
              {answers[currentQuestion] !== undefined && (
                <div style={{ 
                  fontSize: '11px', 
                  color: '#f59e0b', 
                  marginTop: '4px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '8px'
                }}>
                  تم الإجابة: {answers[currentQuestion] === 2 ? 'أوافق بشدة' : answers[currentQuestion] === 1 ? 'أوافق' : 'لا أوافق'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 40px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '40px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            textAlign: 'center',
            direction: 'rtl' // RTL support for Arabic
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              color: colors.text, 
              marginBottom: '30px', 
              lineHeight: '1.6',
              textAlign: 'center',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif',
              fontWeight: '600'
            }}>
              {currentQ.text || currentQ.question_ar || 'سؤال غير متوفر'}
            </h2>
            
            {/* Answer Options - Clean layout without tips */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px', 
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              {[
                { 
                  value: -1, // نستخدم -1 للعرض، لكن نحوله لـ 0 عند الحساب
                  label_ar: 'لا أحب', 
                  label_en: 'Dislike', 
                  label_fr: 'Je n\'aime pas', 
                  emoji: '👎', 
                  color: '#ef4444',
                  bgColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                },
                { 
                  value: 0, 
                  label_ar: 'محايد', 
                  label_en: 'Neutral', 
                  label_fr: 'Neutre', 
                  emoji: '😐', 
                  color: '#94a3b8',
                  bgColor: 'rgba(148, 163, 184, 0.1)',
                  borderColor: 'rgba(148, 163, 184, 0.3)'
                },
                { 
                  value: 1, 
                  label_ar: 'أحب', 
                  label_en: 'Like', 
                  label_fr: 'J\'aime', 
                  emoji: '👍', 
                  color: '#10b981',
                  bgColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  style={{
                    padding: '24px 20px',
                    background: answers[currentQuestion] === option.value 
                      ? option.bgColor 
                      : 'rgba(255, 255, 255, 0.08)',
                    border: answers[currentQuestion] === option.value 
                      ? `3px solid ${option.color}` 
                      : '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    color: colors.text,
                    cursor: 'pointer',
                    width: '100%',
                    height: '160px',
                    transition: 'all 0.3s ease',
                    transform: answers[currentQuestion] === option.value ? 'scale(1.02)' : 'scale(1)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: answers[currentQuestion] === option.value 
                      ? `0 8px 25px ${option.color}40` 
                      : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    if (answers[currentQuestion] !== option.value) {
                      e.target.style.background = option.bgColor;
                      e.target.style.borderColor = option.borderColor;
                      e.target.style.transform = 'translateY(-4px) scale(1.02)';
                      e.target.style.boxShadow = `0 8px 25px ${option.color}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[currentQuestion] !== option.value) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div style={{ fontSize: '50px', marginBottom: '15px' }}>{option.emoji}</div>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px',
                    direction: 'rtl',
                    lineHeight: '1.3',
                    color: colors.text,
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}>
                    {option.label_ar}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons - RTL layout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', direction: 'rtl' }}>
              <button
                onClick={goToNextQuestion}
                disabled={currentQuestion >= questions.length - 1 || answers[currentQuestion] === undefined}
                style={{
                  padding: '12px 24px',
                  background: (currentQuestion >= questions.length - 1 || answers[currentQuestion] === undefined) 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: (currentQuestion >= questions.length - 1 || answers[currentQuestion] === undefined) 
                    ? colors.textSecondary 
                    : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (currentQuestion >= questions.length - 1 || answers[currentQuestion] === undefined) 
                    ? 'not-allowed' 
                    : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  direction: 'rtl'
                }}
              >
                <span>←</span> {/* Left arrow for RTL next */}
                {currentQuestion >= questions.length - 1 ? 'إنهاء التقييم' : 'السؤال التالي'}
              </button>

              <div style={{ color: colors.textSecondary, fontSize: '14px', textAlign: 'center' }}>
                {answers[currentQuestion] !== undefined ? (
                  <span style={{ color: '#10b981' }}>✓ تم الإجابة</span>
                ) : (
                  'اختر إجابتك'
                )}
              </div>

              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                style={{
                  padding: '12px 24px',
                  background: currentQuestion === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                  color: currentQuestion === 0 ? colors.textSecondary : colors.text,
                  border: `1px solid ${currentQuestion === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '12px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  direction: 'rtl'
                }}
              >
                السؤال السابق
                <span>→</span> {/* Right arrow for RTL previous */}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculating Stage
  if (currentStage === 'calculating') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⚙️</div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>جاري حساب النتائج...</div>
          <div style={{ fontSize: '16px', color: colors.textSecondary }}>
            يتم استخدام الخوارزمية الدولية المتقدمة
          </div>
        </div>
      </div>
    );
  }

  // Results Stage
  if (currentStage === 'results') {
    // Choose appropriate results component based on version
    if (assessmentConfig.version === 'school2career' || assessmentConfig.version.startsWith('school2career-')) {
      return (
        <RIASECSchool2CareerResults
          algorithmResults={results?.algorithm_results}
          onRetakeAssessment={retakeAssessment}
          onBackToAssessments={backToAssessments}
          userInfo={{ sessionId, startTime, config: assessmentConfig }}
        />
      );
    } else {
      return (
        <RIASECInternationalResults
          algorithmResults={results?.algorithm_results}
          onRetakeAssessment={retakeAssessment}
          onBackToAssessments={backToAssessments}
          userInfo={{ sessionId, startTime, config: assessmentConfig }}
        />
      );
    }
  }

  // Error Stage
  if (currentStage === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '15px' }}>
            حدث خطأ أثناء معالجة النتائج
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: '30px' }}>
            {error || 'خطأ غير معروف'}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={retakeAssessment}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              إعادة المحاولة
            </button>
            <button
              onClick={backToAssessments}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const RIASECWithSuspense = () => {
  return (
    <Suspense fallback={<div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white'
    }}>جاري التحميل...</div>}>
      <RIASECInternationalAssessment />
    </Suspense>
  );
};

export default RIASECWithSuspense;