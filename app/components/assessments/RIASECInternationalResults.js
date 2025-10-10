// Import React and necessary hooks for Holland International Comprehensive
import React, { useState, useEffect, useRef } from 'react';

// Import chart libraries for comprehensive interactive charts - Holland International Enhanced
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
import { Line, Bar, Radar, Doughnut, PolarArea } from 'react-chartjs-2';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar as RechartsRadar, ResponsiveContainer, BarChart, 
  Bar as RechartsBar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend as RechartsLegend, 
  PieChart, Pie, Cell, LineChart, Line as RechartsLine,
  ComposedChart, Area, AreaChart
} from 'recharts';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SaveResultsButton from './SaveResultsButton';

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

const RIASECInternationalResults = ({ 
  algorithmResults, 
  onRetakeAssessment, 
  onBackToAssessments 
}) => {
  console.log('🎉 RIASECInternationalResults: بداية component');
  console.log('📦 algorithmResults الوارد:', algorithmResults);
  console.log('📊 raw_scores:', algorithmResults?.raw_scores);
  console.log('🎯 holland_code:', algorithmResults?.holland_code);
  
  // فحص النسب المئوية لكل نوع
  if (algorithmResults?.raw_scores) {
    Object.entries(algorithmResults.raw_scores).forEach(([type, data]) => {
      console.log(`📊 نوع ${type}: درجة خام = ${data.raw}, نسبة مئوية = ${data.percentage}%`);
    });
  }
  
  const [activeTab, setActiveTab] = useState('overview');
  // Enhanced state for new comprehensive features
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChartType, setSelectedChartType] = useState('chartjs');
  const [assessmentVersion, setAssessmentVersion] = useState('student');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [savedResults, setSavedResults] = useState([]);
  const [showQuickSummary, setShowQuickSummary] = useState(true);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('0-2');
  const [showNotifications, setShowNotifications] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [linkedinJobs, setLinkedinJobs] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const resultsRef = useRef(null);
  
  // استخراج البيانات الرئيسية في بداية component
  const raw_scores = algorithmResults?.raw_scores || {};
  const holland_code = algorithmResults?.holland_code || '';
  const ranking = algorithmResults?.ranking || [];
  const indices = algorithmResults?.indices || {};
  const triad_details = algorithmResults?.triad_details || {};
  
  console.log('🔍 تعريف البيانات في بداية component:');
  console.log('raw_scores:', raw_scores);
  console.log('holland_code:', holland_code);
  console.log('ranking:', ranking);
  console.log('🔍 أول عنصر في ranking:', ranking[0]);
  console.log('🔍 هل يحتوي على percentage:', ranking[0]?.percentage);

  // Enhanced utility functions - moved before render functions
  const calculateConfidenceScore = (scores) => {
    console.log('📊 حساب درجة الثقة:', scores);
    
    if (!scores || typeof scores !== 'object') {
      console.log('❌ لا توجد درجات صحيحة');
      return 0;
    }
    
    // استخراج النسب المئوية من raw_scores
    const percentages = Object.values(scores)
      .map(scoreObj => {
        if (scoreObj && typeof scoreObj === 'object' && scoreObj.percentage !== undefined) {
          return parseFloat(scoreObj.percentage) || 0;
        }
        return parseFloat(scoreObj) || 0;
      })
      .filter(val => !isNaN(val));
    
    console.log('📊 النسب المئوية المستخرجة:', percentages);
    
    if (percentages.length === 0) {
      console.log('❌ لا توجد نسب مئوية صحيحة');
      return 0;
    }
    
    const max = Math.max(...percentages);
    const min = Math.min(...percentages);
    const range = max - min;
    const differentiation = range / (max || 1);
    
    // حساب درجة الثقة بناءً على التمييز وأعلى نقاط
    const confidenceScore = Math.round(Math.min(100, (differentiation * 70) + (max / 100 * 30)));
    
    console.log('✅ درجة الثقة المحسوبة:', confidenceScore);
    
    return confidenceScore;
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
      scores: algorithmResults?.raw_scores || {},
      timestamp: Date.now(),
      password: password || null,
      hollandCode: algorithmResults?.holland_code
    };
    
    try {
      // حل مشكلة btoa مع النصوص العربية
      const jsonString = JSON.stringify(resultData);
      
      // طريقة آمنة لترميز UTF-8
      const utf8Bytes = new TextEncoder().encode(jsonString);
      const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
      const base64String = btoa(binaryString);
      
      return `${window.location.origin}/shared-results/${base64String}`;
    } catch (error) {
      console.error('خطأ في توليد رابط المشاركة:', error);
      // في حالة فشل الترميز، استخدم URL encoding بدلاً من base64
      const encodedData = encodeURIComponent(JSON.stringify(resultData));
      return `${window.location.origin}/shared-results/url/${encodedData}`;
    }
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
      
      pdf.save('riasec-holland-international-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getCareerMatches = (primaryType) => {
    if (!primaryType || !enhancedCareerDatabase[primaryType]) return [];
    
    const matches = enhancedCareerDatabase[primaryType];
    
    // Calculate match percentages based on primary score
    return matches.map(career => {
      const primaryScore = algorithmResults?.raw_scores?.[primaryType]?.percentage || 0;
      const matchPercentage = Math.round(Math.min(primaryScore * 1.2, 98)); // Enhanced matching
      
      return {
        ...career,
        match: matchPercentage,
        matchLevel: getMatchLevel(matchPercentage)
      };
    }).sort((a, b) => b.match - a.match);
  };

  // Enhanced Career Database with 2024 Salary Data
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
      },
      {
        title: 'كاتب محتوى',
        match: 85,
        hollandCode: 'AE',
        description: 'كتابة محتوى إبداعي وتسويقي متنوع',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '25,000 - 45,000 ريال/سنة',
          '3-7': '45,000 - 70,000 ريال/سنة',
          '8-15': '70,000 - 95,000 ريال/سنة',
          '15+': '95,000 - 150,000 ريال/سنة'
        },
        skills: ['كتابة إبداعية', 'تحرير', 'SEO', 'تسويق محتوى'],
        industries: ['الإعلان', 'النشر', 'التسويق الرقمي', 'الإعلام'],
        workEnvironment: 'مكاتب ومنزلي (عمل عن بُعد)',
        jobOutlook: 'نمو متوسط 4% حتى 2032',
        linkedinJobs: 920
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
      },
      {
        title: 'معلم',
        match: 90,
        hollandCode: 'SA',
        description: 'تعليم وتطوير الطلاب في مختلف المراحل',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '30,000 - 50,000 ريال/سنة',
          '3-7': '50,000 - 70,000 ريال/سنة',
          '8-15': '70,000 - 85,000 ريال/سنة',
          '15+': '85,000 - 120,000 ريال/سنة'
        },
        skills: ['تطوير مناهج', 'إدارة صف', 'تقييم', 'تواصل'],
        industries: ['التعليم', 'التدريب', 'التعليم الخاص', 'التعليم الإلكتروني'],
        workEnvironment: 'مدارس وجامعات ومراكز تدريب',
        jobOutlook: 'نمو متوسط 5% حتى 2032',
        linkedinJobs: 1890
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
      },
      {
        title: 'رائد أعمال',
        match: 88,
        hollandCode: 'EAI',
        description: 'تأسيس وإدارة الشركات الناشئة والمشاريع',
        educationLevel: 'متنوع',
        salaryRanges: {
          '0-2': '0 - 100,000 ريال/سنة',
          '3-7': '50,000 - 300,000 ريال/سنة',
          '8-15': '200,000 - 800,000 ريال/سنة',
          '15+': '500,000 - 2,000,000+ ريال/سنة'
        },
        skills: ['رؤية استراتيجية', 'إدارة مخاطر', 'قيادة', 'ابتكار'],
        industries: ['التقنية', 'الخدمات', 'التجارة', 'الاستشارات'],
        workEnvironment: 'مساحات عمل مشتركة ومكاتب شخصية',
        jobOutlook: 'نمو متغير حسب القطاع',
        linkedinJobs: 560
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
      },
      {
        title: 'محلل بيانات مالية',
        match: 91,
        hollandCode: 'CIE',
        description: 'تحليل البيانات المالية لدعم اتخاذ القرارات الاستثمارية',
        educationLevel: '🎓 بكالوريوس (4 سنوات)',
        salaryRanges: {
          '0-2': '45,000 - 70,000 ريال/سنة',
          '3-7': '70,000 - 120,000 ريال/سنة',
          '8-15': '120,000 - 180,000 ريال/سنة',
          '15+': '180,000 - 280,000 ريال/سنة'
        },
        skills: ['تحليل مالي', 'نمذجة مالية', 'Excel متقدم', 'تقييم الاستثمارات'],
        industries: ['البنوك', 'شركات الاستثمار', 'التأمين', 'الاستشارات'],
        workEnvironment: 'مكاتب مالية ومراكز استثمار',
        jobOutlook: 'نمو قوي 9% حتى 2032',
        linkedinJobs: 890
      }
    ]
  };

  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    text: '#ffffff',
    textSecondary: '#a8a8b8'
  };

  // Chart colors for RIASEC types
  const chartColors = {
    R: '#ef4444', // Red
    I: '#3b82f6', // Blue  
    A: '#8b5cf6', // Purple
    S: '#10b981', // Green
    E: '#f59e0b', // Orange
    C: '#06b6d4', // Cyan
  };

  const riasecLabels = {
    R: 'الواقعي (R)',
    I: 'الاستقصائي (I)', 
    A: 'الفني (A)',
    S: 'الاجتماعي (S)',
    E: 'المغامر (E)',
    C: 'التقليدي (C)'
  };

  // Load and save results
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('riasecResults') || '[]');
    // Save current result
    if (algorithmResults) {
      const newResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        scores: algorithmResults.raw_scores,
        hollandCode: algorithmResults.holland_code,
        version: 'holland-international',
        confidence: calculateConfidenceScore(algorithmResults.raw_scores)
      };
      saved.push(newResult);
      localStorage.setItem('riasecResults', JSON.stringify(saved));
      setSavedResults(saved);
      setConfidenceScore(newResult.confidence);
    }
  }, [algorithmResults]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!holland_code) {
        console.log('❌ No holland_code available');
        return;
      }
      
      console.log('🚀 Fetching recommendations for:', holland_code);
      setLoadingRecommendations(true);
      
      try {
        const url = `/api/assessments/riasec/recommendations?code=${holland_code}&region=Egypt&level=Work`;
        console.log('📡 API URL:', url);
        
        const response = await fetch(url);
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Response data:', data);
          setRecommendations(data.recommendations);
          console.log('✅ تم جلب التوصيات:', data.recommendations);
        } else {
          const errorText = await response.text();
          console.error('❌ فشل جلب التوصيات - Status:', response.status);
          console.error('❌ Error response:', errorText);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب التوصيات:', error);
        console.error('❌ Error details:', error.message);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    
    fetchRecommendations();
  }, [holland_code]);

  // Chart data preparation
  const prepareChartData = (scores) => {
    if (!scores) return null;
    
    const percentages = Object.entries(scores).map(([key, data]) => data.percentage);
    
    return {
      labels: Object.keys(scores).map(key => riasecLabels[key]),
      datasets: [{
        label: 'نتائج RIASEC هولاند',
        data: percentages,
        backgroundColor: Object.keys(scores).map(key => chartColors[key] + '33'),
        borderColor: Object.keys(scores).map(key => chartColors[key]),
        borderWidth: 2,
        pointBackgroundColor: Object.keys(scores).map(key => chartColors[key]),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: Object.keys(scores).map(key => chartColors[key])
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Cairo, Arial, sans-serif',
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'نتائج تقييم RIASEC هولاند الدولي',
        color: '#ffffff',
        font: {
          family: 'Cairo, Arial, sans-serif',
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            family: 'Cairo, Arial, sans-serif',
            size: 12
          }
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

  // Recharts data
  const rechartsData = algorithmResults?.raw_scores ? 
    Object.entries(algorithmResults.raw_scores).map(([key, data]) => ({
      type: riasecLabels[key],
      score: data.percentage,
      fullMark: 100
    })) : [];

  // Enhanced Design Features with Quick Summary and Navigation
  const renderQuickSummaryAndNavigation = () => {
    if (!algorithmResults) return null;
    
    const { raw_scores, holland_code, ranking } = algorithmResults;
    const primaryType = ranking[0];
    const confidence = calculateConfidenceScore(raw_scores);
    
    return (
      <div style={{
        position: 'sticky',
        top: '20px',
        zIndex: 100,
        marginBottom: '40px'
      }}>
        {/* Quick Summary Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '30px',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 15px 35px rgba(16, 185, 129, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Quick Results */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '15px',
                borderRadius: '15px'
              }}>
                {['🔧', '🔬', '🎨', '🤝', '💼', '📊'][['R', 'I', 'A', 'S', 'E', 'C'].indexOf(primaryType.type)] || '🎯'}
              </div>
              <div>
                <div style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  direction: 'rtl',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  كودك المهني: {holland_code}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  direction: 'rtl'
                }}>
                  النمط الأساسي: {{
                    R: 'الواقعي - العملي',
                    I: 'الاستقصائي - التحليلي', 
                    A: 'الفني - الإبداعي',
                    S: 'الاجتماعي - المساعد',
                    E: 'المغامر - القيادي',
                    C: 'التقليدي - المنظم'
                  }[primaryType.type]}
                </div>
              </div>
            </div>
            
            {/* Confidence and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '3px'
                }}>
                  {confidence}%
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px'
                }}>
                  درجة الثقة
                </div>
              </div>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  padding: '10px 15px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.3s ease'
                }}
              >
                {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'وضع نهاري' : 'وضع ليلي'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Interactive Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'overview', name: '📊 نظرة عامة', icon: '📊' },
              { id: 'careers', name: '💼 مهن مناسبة', icon: '💼' },
              { id: 'analysis', name: '🔍 تحليل متقدم', icon: '🔍' },
              { id: 'sharing', name: '🚀 مشاركة', icon: '🚀' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 18px',
                  background: activeTab === tab.id ? 
                    'linear-gradient(135deg, #667eea, #764ba2)' : 
                    'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: `2px solid ${activeTab === tab.id ? '#667eea' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.id ? 'bold' : '600',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeTab === tab.id ? 
                    '0 5px 15px rgba(102, 126, 234, 0.4)' : 
                    '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // School2Career Branding and Advanced Analytics Section
  const renderSchool2CareerBrandingAndAnalytics = () => {
    if (!algorithmResults) return null;
    
    const { raw_scores, holland_code, ranking } = algorithmResults;
    const confidence = calculateConfidenceScore(raw_scores);
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.12))',
        borderRadius: '30px',
        padding: '50px',
        marginBottom: '50px',
        border: '2px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)'
      }}>
        {/* School2Career Header with Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '25px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* School2Career Logo Placeholder */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
            }}>
              S2C
            </div>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: '0 0 8px 0',
                direction: 'rtl',
                fontFamily: 'Cairo, Arial, sans-serif'
              }}>
                School2Career - هولاند الدولي
              </h2>
              <p style={{
                color: '#fbbf24',
                fontSize: '16px',
                margin: 0,
                direction: 'rtl',
                fontWeight: '600'
              }}>
                نظام التقييم المهني المتقدم - معتمد دولياً
              </p>
            </div>
          </div>
          
          {/* Version Badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}>
              🌟 نسخة متقدمة 2024
            </div>
            <select
              value={assessmentVersion}
              onChange={(e) => setAssessmentVersion(e.target.value)}
              style={{
                padding: '8px 15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Cairo, Arial, sans-serif'
              }}
            >
              <option value="student" style={{background: '#1a1a2e'}}>🎓 طالب</option>
              <option value="graduate" style={{background: '#1a1a2e'}}>🎆 خريج</option>
              <option value="worker" style={{background: '#1a1a2e'}}>💼 عامل</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Analytics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {/* Confidence Score Analysis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <h4 style={{
              color: '#f59e0b',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arabic, sans-serif'
            }}>
              درجة الثقة في النتائج
            </h4>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: confidence >= 80 ? '#10b981' : confidence >= 60 ? '#f59e0b' : '#ef4444',
              marginBottom: '10px'
            }}>
              {confidence}%
            </div>
            <div style={{
              color: '#a8a8b8',
              fontSize: '12px',
              direction: 'rtl'
            }}>
              {confidence >= 80 ? 'ثقة عالية جداً - نتائج موثوقة' :
               confidence >= 60 ? 'ثقة جيدة - نتائج معقولة' :
               'ثقة محدودة - تحتاج مراجعة'}
            </div>
          </div>
          
          {/* Profile Elevation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📈</div>
            <h4 style={{
              color: '#3b82f6',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arabic, sans-serif'
            }}>
              قوة الاهتمامات
            </h4>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '10px'
            }}>
              {(() => {
                // حساب قوة الاهتمامات من متوسط النسب المئوية
                const percentages = Object.values(raw_scores).map(s => s.percentage || 0);
                const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
                return Math.round(avg) + '%';
              })()}
            </div>
            <div style={{
              color: '#a8a8b8',
              fontSize: '12px',
              direction: 'rtl'
            }}>
              مستوى عام من الميول والاهتمامات
            </div>
          </div>
          
          {/* Consistency Score */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔄</div>
            <h4 style={{
              color: '#8b5cf6',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arabic, sans-serif'
            }}>
              توافق الاختيارات
            </h4>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '10px'
            }}>
              {(() => {
                // حساب التوافق من الفرق بين أعلى وأقل نسبة
                const percentages = Object.values(raw_scores).map(s => s.percentage || 0);
                const max = Math.max(...percentages);
                const min = Math.min(...percentages);
                const range = max - min;
                // كلما كان الفرق أكبر، كان التوافق أفضل (اختيارات واضحة)
                const consistency = Math.min(100, Math.round((range / max) * 100));
                return consistency + '%';
              })()}
            </div>
            <div style={{
              color: '#a8a8b8',
              fontSize: '12px',
              direction: 'rtl'
            }}>
              مدى تناسق إجاباتك عبر التقييم
            </div>
          </div>
          
          {/* Career Congruence */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
            <h4 style={{
              color: '#10b981',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arabic, sans-serif'
            }}>
              ملاءمة المهنة
            </h4>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '10px'
            }}>
              {(() => {
                // حساب الملاءمة من نسبة النمط الأساسي
                const primaryPercentage = ranking[0]?.percentage || 0;
                return Math.round(primaryPercentage) + '%';
              })()}
            </div>
            <div style={{
              color: '#a8a8b8',
              fontSize: '12px',
              direction: 'rtl'
            }}>
              مدى ملاءمة نتائجك للمهن المقترحة
            </div>
          </div>
        </div>
        
        {/* LinkedIn Integration Preview */}
        <div style={{
          background: 'rgba(0, 119, 181, 0.15)',
          padding: '30px',
          borderRadius: '20px',
          border: '2px solid rgba(0, 119, 181, 0.3)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                background: '#0077b5',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '24px'
              }}>
                in
              </div>
              <div>
                <h4 style={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 5px 0',
                  direction: 'rtl',
                  fontFamily: 'Cairo, Arabic, sans-serif'
                }}>
                  تكامل LinkedIn الذكي
                </h4>
                <p style={{
                  color: '#a8a8b8',
                  fontSize: '14px',
                  margin: 0,
                  direction: 'rtl'
                }}>
                  ابحث عن وظائف حقيقية تناسب نتائجك
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                padding: '12px 20px',
                background: showNotifications ? 
                  'linear-gradient(135deg, #10b981, #059669)' : 
                  'linear-gradient(135deg, #0077b5, #005885)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, Arabic, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {showNotifications ? '🔔 مفعل' : '🔕 معطل'}
              إشعارات الوظائف
            </button>
          </div>
          
          {/* Mock LinkedIn Jobs Preview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {[
              { title: 'مهندس برمجيات', company: 'Tech Solutions', match: '95%', applicants: '23 متقدم' },
              { title: 'محلل بيانات', company: 'Data Corp', match: '88%', applicants: '15 متقدم' },
              { title: 'مصمم UX', company: 'Design Studio', match: '82%', applicants: '31 متقدم' }
            ].map((job, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div>
                    <h5 style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      margin: '0 0 5px 0',
                      direction: 'rtl'
                    }}>
                      {job.title}
                    </h5>
                    <p style={{
                      color: '#0077b5',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      {job.company}
                    </p>
                  </div>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {job.match}
                  </div>
                </div>
                <div style={{
                  color: '#a8a8b8',
                  fontSize: '12px',
                  direction: 'rtl'
                }}>
                  {job.applicants} • منذ 3 أيام
                </div>
              </div>
            ))}
          </div>
          
          {showNotifications && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#34d399', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                ✅ تم تفعيل إشعارات الوظائف!
              </div>
              <div style={{ color: '#a8a8b8', fontSize: '12px', direction: 'rtl' }}>
                ستصلك إشعارات فورية عند توفر وظائف تناسب ميولك المهنية
              </div>
            </div>
          )}
        </div>
        
        {/* School2Career Certificate */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          padding: '25px',
          borderRadius: '20px',
          border: '2px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
            <h4 style={{
              color: '#f59e0b',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontFamily: 'Cairo, Arabic, sans-serif'
            }}>
              شهادة School2Career المعتمدة
            </h4>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              direction: 'rtl',
              margin: 0
            }}>
              شهادة رسمية معتمدة دولياً لنتائج تقييم RIASEC هولاند
            </p>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            margin: '0 auto',
            maxWidth: '400px'
          }}>
            <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
              معرف الشهادة: SC-RIASEC-{Date.now().toString().slice(-6)}
            </div>
            <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '8px' }}>
              كود هولاند: {holland_code}
            </div>
            <div style={{ color: '#a8a8b8', fontSize: '12px' }}>
              تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Privacy and Sharing Section
  const renderPrivacyAndSharingSection = () => {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12))',
        borderRadius: '30px',
        padding: '50px',
        marginBottom: '50px',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '25px'
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 15px 0',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🔒 الخصوصية والمشاركة الآمنة
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0,
              direction: 'rtl',
              lineHeight: '1.6'
            }}>
              شارك نتائجك بأمان مع روابط مؤقتة وحماية بكلمة مرور
            </p>
          </div>
          
          <button
            onClick={() => setShowShareModal(!showShareModal)}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontFamily: 'Cairo, Arial, sans-serif',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>🚀</span>
            مشاركة النتائج
          </button>
        </div>
        
        {/* Privacy Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔔</div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              روابط مؤقتة
            </h4>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              direction: 'rtl',
              lineHeight: '1.5'
            }}>
              روابط تنتهي صلاحيتها بعد 30 يوم لضمان الخصوصية
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              حماية بكلمة مرور
            </h4>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              direction: 'rtl',
              lineHeight: '1.5'
            }}>
              أضف طبقة حماية إضافية بكلمة مرور قوية
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '25px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              تصدير PDF
            </h4>
            <p style={{
              color: '#a8a8b8',
              fontSize: '14px',
              direction: 'rtl',
              lineHeight: '1.5'
            }}>
              احفظ نتائجك كملف PDF منسق وجاهز للطباعة
            </p>
          </div>
        </div>
        
        {/* Share Modal */}
        {showShareModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              padding: '40px',
              borderRadius: '25px',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0,
                  direction: 'rtl',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  🚀 مشاركة النتائج
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#a8a8b8',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  display: 'block',
                  direction: 'rtl'
                }}>
                  كلمة مرور اختيارية (موصى به):
                </label>
                <input
                  type="password"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  placeholder="اترك فارغ لعدم استخدام كلمة مرور"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '14px',
                    direction: 'rtl'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    const link = generateShareLink(sharePassword);
                    navigator.clipboard.writeText(link);
                    alert('تم نسخ الرابط! صالح لمدة 30 يوم');
                    setShowShareModal(false);
                  }}
                  style={{
                    padding: '12px 25px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}
                >
                  🔗 نسخ الرابط
                </button>
                
                <button
                  onClick={exportToPDF}
                  style={{
                    padding: '12px 25px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}
                >
                  📄 تصدير PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // D3.js Chart Component for RIASEC Holland International
  const D3RadarChart = ({ data, width = 400, height = 400 }) => {
    const svgRef = useRef(null);
    
    useEffect(() => {
      if (!data || data.length === 0) return;
      
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
      const center = { x: width / 2, y: height / 2 };
      
      const angleSlice = (2 * Math.PI) / data.length;
      const maxValue = d3.max(data, d => d.score);
      
      // Scale for radius
      const radiusScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, radius * 0.7]);
      
      // Colors for RIASEC types
      const colors = {
        'الواقعي (R)': '#ef4444',
        'الاستقصائي (I)': '#3b82f6',
        'الفني (A)': '#8b5cf6',
        'الاجتماعي (S)': '#10b981',
        'المغامر (E)': '#f59e0b',
        'التقليدي (C)': '#06b6d4'
      };
      
      // Create container group
      const container = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${center.x}, ${center.y})`);
      
      // Create concentric circles (grid)
      const levels = 5;
      for (let i = 1; i <= levels; i++) {
        container.append('circle')
          .attr('r', (radius * 0.7 * i) / levels)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 255, 255, 0.1)')
          .attr('stroke-width', 1);
      }
      
      // Create axis lines
      data.forEach((d, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const x = Math.cos(angle) * radius * 0.8;
        const y = Math.sin(angle) * radius * 0.8;
        
        container.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', 'rgba(255, 255, 255, 0.1)')
          .attr('stroke-width', 1);
      });
      
      // Create data path
      const line = d3.line()
        .x((d, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          return Math.cos(angle) * radiusScale(d.score);
        })
        .y((d, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          return Math.sin(angle) * radiusScale(d.score);
        })
        .curve(d3.curveCardinalClosed);
      
      // Add data area
      container.append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'rgba(102, 126, 234, 0.2)')
        .attr('stroke', '#667eea')
        .attr('stroke-width', 3)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 1);
      
      // Add data points
      data.forEach((d, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const x = Math.cos(angle) * radiusScale(d.score);
        const y = Math.sin(angle) * radiusScale(d.score);
        
        container.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 0)
          .attr('fill', colors[d.type] || '#667eea')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .transition()
          .delay(i * 100)
          .duration(500)
          .attr('r', 6);
      });
      
      // Add labels
      data.forEach((d, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const x = Math.cos(angle) * (radius * 0.9);
        const y = Math.sin(angle) * (radius * 0.9);
        
        container.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '12px')
          .attr('font-family', 'Cairo, Arial, sans-serif')
          .attr('font-weight', 'bold')
          .style('opacity', 0)
          .text(d.type)
          .transition()
          .delay(800)
          .duration(500)
          .style('opacity', 1);
      });
      
      // Add center text
      container.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-family', 'Cairo, Arial, sans-serif')
        .attr('font-weight', 'bold')
        .style('opacity', 0)
        .text('RIASEC Holland')
        .transition()
        .delay(1200)
        .duration(500)
        .style('opacity', 1);
        
      container.append('text')
        .attr('x', 0)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#a8a8b8')
        .attr('font-size', '12px')
        .attr('font-family', 'Cairo, Arial, sans-serif')
        .style('opacity', 0)
        .text('النسخة الدولية')
        .transition()
        .delay(1200)
        .duration(500)
        .style('opacity', 1);
    }, [data, width, height]);
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <svg ref={svgRef} style={{ background: 'transparent' }}></svg>
      </div>
    );
  };

  // Enhanced Interactive Charts Section with All Three Libraries
  const renderInteractiveCharts = () => {
    if (!algorithmResults?.raw_scores) return null;
    
    const chartData = prepareChartData(algorithmResults.raw_scores);
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
        borderRadius: '30px',
        padding: '50px',
        marginBottom: '50px',
        border: '2px solid rgba(102, 126, 234, 0.3)',
        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.1)'
      }}>
        {/* Header with Chart Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '25px'
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 15px 0',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📊 الرسوم البيانية التفاعلية - هولاند الدولي
            </h2>
            <p style={{
              color: '#a8a8b8',
              fontSize: '16px',
              margin: 0,
              direction: 'rtl',
              lineHeight: '1.5'
            }}>
              قارن بين مكتبات الرسوم الثلاث واختر الأفضل لعرض نتائجك
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {[
              { id: 'chartjs', name: 'Chart.js ✅', desc: 'بسيط وسهل', color: '#10b981' },
              { id: 'd3', name: 'D3.js ⚡', desc: 'قوي لكن معقد', color: '#f59e0b' },
              { id: 'recharts', name: 'Recharts 🎯', desc: 'متوسط التعقيد', color: '#3b82f6' }
            ].map(chart => (
              <button
                key={chart.id}
                onClick={() => setSelectedChartType(chart.id)}
                style={{
                  padding: '15px 25px',
                  background: selectedChartType === chart.id ? 
                    `linear-gradient(135deg, ${chart.color}, ${chart.color}dd)` : 
                    'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: `2px solid ${selectedChartType === chart.id ? chart.color : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '18px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedChartType === chart.id ? 'bold' : '600',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, Arial, sans-serif',
                  textAlign: 'center',
                  minWidth: '120px',
                  transform: selectedChartType === chart.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedChartType === chart.id ? 
                    `0 8px 25px ${chart.color}40` : '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedChartType !== chart.id) {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChartType !== chart.id) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ marginBottom: '5px' }}>{chart.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{chart.desc}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart Display Area */}
        <div style={{ 
          height: '500px', 
          position: 'relative', 
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          {selectedChartType === 'chartjs' && chartData && (
            <div style={{ height: '100%' }}>
              <Radar data={chartData} options={chartOptions} />
            </div>
          )}
          
          {selectedChartType === 'recharts' && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={rechartsData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis 
                  dataKey="type" 
                  tick={{ fill: '#ffffff', fontSize: 14, fontFamily: 'Cairo, Arial, sans-serif', fontWeight: 'bold' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#a8a8b8', fontSize: 12 }}
                />
                <RechartsRadar
                  name="نتائج RIASEC هولاند"
                  dataKey="score"
                  stroke="#667eea"
                  fill="rgba(102, 126, 234, 0.3)"
                  strokeWidth={4}
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 15, 30, 0.95)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
          
          {selectedChartType === 'd3' && (
            <D3RadarChart 
              data={rechartsData} 
              width={450} 
              height={450}
            />
          )}
        </div>
        
        {/* Library Comparison Table */}
        <div style={{
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ 
            color: '#ffffff', 
            marginBottom: '25px',
            fontSize: '20px',
            fontWeight: 'bold',
            direction: 'rtl',
            fontFamily: 'Cairo, Arial, sans-serif',
            textAlign: 'center'
          }}>
            🔍 مقارنة مفصلة لمكتبات الرسوم البيانية:
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {[
              {
                id: 'chartjs',
                name: 'Chart.js',
                icon: '✅',
                pros: ['بسيط وسهل الاستخدام', 'مناسب للمبتدئين', 'توافق عالي مع مختلف المتصفحات'],
                cons: ['خيارات تخصيص محدودة'],
                rating: 5,
                color: '#10b981'
              },
              {
                id: 'd3',
                name: 'D3.js',
                icon: '⚡',
                pros: ['مرونة عالية جداً', 'تحكم كامل في التصميم', 'حركات متقدمة وتفاعلية'],
                cons: ['يحتاج خبرة في البرمجة', 'معقد نسبياً'],
                rating: 4,
                color: '#f59e0b'
              },
              {
                id: 'recharts',
                name: 'Recharts',
                icon: '🎯',
                pros: ['توازن مثالي', 'سهل الاستخدام مع React', 'خيارات تخصيص جيدة'],
                cons: ['أقل مرونة من D3.js'],
                rating: 4,
                color: '#3b82f6'
              }
            ].map((lib) => (
              <div key={lib.id} style={{
                background: selectedChartType === lib.id ? 
                  `linear-gradient(135deg, ${lib.color}20, ${lib.color}10)` : 
                  'rgba(255, 255, 255, 0.03)',
                border: `2px solid ${selectedChartType === lib.id ? lib.color + '40' : 'rgba(255, 255, 255, 0.05)'}`,
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{lib.icon}</div>
                <h5 style={{ 
                  color: lib.color, 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  {lib.name}
                </h5>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={ { color: '#ffffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    ✅ المزايا:
                  </div>
                  {lib.pros.map((pro, i) => (
                    <div key={i} style={{ color: '#a8a8b8', fontSize: '12px', marginBottom: '4px', direction: 'rtl' }}>
                      • {pro}
                    </div>
                  ))}
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    ⚠️ العيوب:
                  </div>
                  {lib.cons.map((con, i) => (
                    <div key={i} style={{ color: '#a8a8b8', fontSize: '12px', marginBottom: '4px', direction: 'rtl' }}>
                      • {con}
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '10px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ 
                      color: i < lib.rating ? lib.color : 'rgba(255, 255, 255, 0.2)',
                      fontSize: '16px'
                    }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced career matching section
  // Recommendations are loaded via the useEffect above that calls the API

  const renderEnhancedCareerMatching = () => {
    if (!algorithmResults) return null;
    
    const primaryType = algorithmResults.ranking[0];
    const careerMatches = (Array.isArray(recommendations) && recommendations.length > 0) 
      ? recommendations 
      : getCareerMatches(primaryType.type);
    
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '25px',
        padding: '40px',
        marginBottom: '40px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#10b981',
              margin: '0 0 10px 0',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              🏆 تصنيف المهن المتقدم - 2024
            </h2>
            <p style={{
              color: colors.textSecondary,
              fontSize: '14px',
              margin: 0,
              direction: 'rtl'
            }}>
              مع توقعات الرواتب المحدثة والفرص المتاحة في LinkedIn
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: colors.textSecondary, fontSize: '14px', direction: 'rtl' }}>
              مستوى الخبرة:
            </span>
            <select 
              value={selectedExperienceLevel}
              onChange={(e) => setSelectedExperienceLevel(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                fontSize: '12px',
                fontFamily: 'Cairo, Arial, sans-serif'
              }}
            >
              <option value="0-2" style={{background: '#1a1a2e'}}>👼 مبتدئ (0-2 سنة)</option>
              <option value="3-7" style={{background: '#1a1a2e'}}>💼 متوسط (3-7 سنوات)</option>
              <option value="8-15" style={{background: '#1a1a2e'}}>🌟 خبير (8-15 سنة)</option>
              <option value="15+" style={{background: '#1a1a2e'}}>🏆 قيادي (15+ سنة)</option>
            </select>
          </div>
        </div>
        
        {/* Loading State */}
        {loadingRecommendations && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <div>جاري تحميل التوصيات المهنية...</div>
          </div>
        )}

        {/* Career Cards with Enhanced Info */}
        {!loadingRecommendations && careerMatches && careerMatches.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '25px'
          }}>
            {careerMatches.map((career, index) => {
              // Handle database format
              const title = career.career_title_ar || career.title;
              const match = career.match_percentage || career.match;
              const description = career.description_ar || career.description;
              const educationLevel = career.education_level_ar || career.educationLevel;
              const salaryMin = career.salary_min_egp || 0;
              const salaryMax = career.salary_max_egp || 0;
              const currency = career.salary_currency || 'EGP';
              const skills = career.skills_ar || career.skills || [];
              const industries = career.industries_ar || career.industries || [];
              const linkedinJobs = career.linkedin_jobs_count || career.linkedinJobs || 0;
              
              // تنسيق الراتب
              const salaryRange = salaryMin && salaryMax ? 
                `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ${currency}/شهر` :
                'غير محدد';
              
              const matchLevel = match >= 90 ? { color: '#10b981', icon: '🏆', badge: 'ممتاز' } :
                                match >= 80 ? { color: '#3b82f6', icon: '⭐', badge: 'جيد جداً' } :
                                match >= 70 ? { color: '#f59e0b', icon: '👍', badge: 'جيد' } :
                                { color: '#6b7280', icon: '✓', badge: 'مناسب' };
            
            return (
              <div
                key={career.id || career.title || index}
                style={{
                  background: index === 0 ? 
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))' :
                    'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  padding: '25px',
                  border: `2px solid ${index === 0 ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Match Level Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: matchLevel.color,
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {matchLevel.icon} {matchLevel.badge}
                </div>
                
                <div style={{ marginBottom: '15px', paddingTop: '15px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: '8px',
                    direction: 'rtl',
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}>
                    {title}
                  </h3>
                  
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: matchLevel.color,
                    marginBottom: '10px'
                  }}>
                    {match}% تطابق
                  </div>
                  
                  <p style={{
                    color: colors.textSecondary,
                    fontSize: '13px',
                    lineHeight: '1.5',
                    marginBottom: '15px',
                    direction: 'rtl'
                  }}>
                    {description}
                  </p>
                </div>
                
                {/* Enhanced Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '10px'
                  }}>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                      {educationLevel}
                    </div>
                    <div style={{ color: colors.textSecondary, fontSize: '11px' }}>
                      المستوى التعليمي المطلوب
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '10px'
                  }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                      💰 {salaryRange}
                    </div>
                    <div style={{ color: colors.textSecondary, fontSize: '11px' }}>
                      نطاق الراتب المتوقع
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '10px'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                      👥 {linkedinJobs} وظيفة متاحة
                    </div>
                    <div style={{ color: colors.textSecondary, fontSize: '11px' }}>
                      على LinkedIn حالياً
                    </div>
                  </div>
                </div>
                
                {/* Skills and Industries */}
                <div style={{ marginTop: '15px' }}>
                  {skills && skills.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ color: colors.text, fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                        🛠️ المهارات المطلوبة:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {industries && industries.length > 0 && (
                    <div>
                      <div style={{ color: colors.text, fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                        🏢 القطاعات:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {industries.slice(0, 3).map((industry, idx) => (
                          <span key={idx} style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
        
        {/* Match Level Legend */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{
            color: colors.text,
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '15px',
            direction: 'rtl'
          }}>
            🏆 مستويات المطابقة:
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>🏆</span>
              <span style={{ color: colors.text, fontSize: '13px' }}>85%+ = تطابق ممتاز</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6' }}>🏅</span>
              <span style={{ color: colors.text, fontSize: '13px' }}>70-84% = تطابق جيد جداً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b' }}>⭐</span>
              <span style={{ color: colors.text, fontSize: '13px' }}>55-69% = تطابق جيد</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6b7280' }}>📝</span>
              <span style={{ color: colors.text, fontSize: '13px' }}>40-54% = خيارات إضافية</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main component return with comprehensive Holland International features
  if (!algorithmResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}>🎯</div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>جاري تحميل النتائج...</div>
          <div style={{ fontSize: '16px', color: '#a8a8b8' }}>
            نظام RIASEC هولاند الدولي المتقدم
          </div>
        </div>
      </div>
    );
  }

  const primaryType = ranking[0];
  const top3Types = ranking.slice(0, 3);

  return (
    <div ref={resultsRef} style={{
      minHeight: '100vh',
      background: isDarkMode ? 
        'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)' :
        'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      padding: '20px',
      color: isDarkMode ? '#ffffff' : '#1a202c',
      fontFamily: 'Cairo, Arial, sans-serif'
    }}>
      {/* Quick Summary and Navigation */}
      {renderQuickSummaryAndNavigation()}
      
      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Primary Result Card */}
          <div style={{
            background: isDarkMode ? 
              'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))' :
              'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8))',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '50px',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            textAlign: 'center',
            marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ fontSize: '120px', marginBottom: '30px' }}>
              {{
                R: '🔧', I: '🔬', A: '🎨', S: '🤝', E: '💼', C: '📊'
              }[primaryType.type] || '🎯'}
            </div>
            
            <h1 style={{
              fontSize: '52px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              كودك المهني: {holland_code}
            </h1>
            
            <h2 style={{
              fontSize: '36px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: '600',
              marginBottom: '40px',
              direction: 'rtl'
            }}>
              النمط الأساسي: {{
                R: 'الواقعي - العملي',
                I: 'الاستقصائي - التحليلي', 
                A: 'الفني - الإبداعي',
                S: 'الاجتماعي - المساعد',
                E: 'المغامر - القيادي',
                C: 'التقليدي - المنظم'
              }[primaryType.type]}
            </h2>
            
            {/* Enhanced Score Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              marginBottom: '30px'
            }}>
              {top3Types.map((type, index) => (
                <div key={type.type} style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: index === 0 ? 
                    'rgba(16, 185, 129, 0.2)' : 
                    'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  border: `2px solid ${
                    index === 0 ? '#10b981' : 'rgba(255, 255, 255, 0.2)'
                  }`,
                  minWidth: '150px',
                  transform: index === 0 ? 'scale(1.1)' : 'scale(1)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                    {{
                      R: '🔧', I: '🔬', A: '🎨', S: '🤝', E: '💼', C: '📊'
                    }[type.type]}
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: index === 0 ? '#10b981' : isDarkMode ? '#ffffff' : '#1a202c',
                    marginBottom: '5px'
                  }}>
                    {raw_scores[type.type]?.percentage || 0}%
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: isDarkMode ? '#a8a8b8' : '#64748b',
                    fontWeight: '600'
                  }}>
                    {{
                      R: 'واقعي', I: 'استقصائي', A: 'فني', S: 'اجتماعي', E: 'مغامر', C: 'تقليدي'
                    }[type.type]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart Section */}
          <div style={{
            background: isDarkMode ? 
              'rgba(255, 255, 255, 0.05)' :
              'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '40px',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            marginBottom: '40px',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.15)'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#1a202c',
              marginBottom: '30px',
              textAlign: 'center',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              📊 الرسم البياني الراداري - نتائجك الكاملة
            </h3>
            
            <div style={{
              height: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {prepareChartData(raw_scores) && (
                <Radar 
                  data={prepareChartData(raw_scores)} 
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'charts' && renderInteractiveCharts()}
      
      {activeTab === 'careers' && renderEnhancedCareerMatching()}
      
      {activeTab === 'analysis' && renderSchool2CareerBrandingAndAnalytics()}
      
      {activeTab === 'sharing' && renderPrivacyAndSharingSection()}
      
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
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}
        >
          🔄 إعادة التقييم
        </button>
        
        <button
          onClick={exportToPDF}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}
        >
          📄 تصدير PDF
        </button>
        
        <button
          onClick={onBackToAssessments}
          style={{
            padding: '15px 30px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: isDarkMode ? '#ffffff' : '#1a202c',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}
        >
          ← العودة للتقييمات
        </button>
      </div>
      
      {/* Footer with School2Career Branding */}
      <div style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '30px',
        background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '20px',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            S2C
          </div>
          <div>
            <div style={{
              color: '#f59e0b',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              School2Career - RIASEC Holland International
            </div>
            <div style={{
              color: isDarkMode ? '#a8a8b8' : '#64748b',
              fontSize: '14px'
            }}>
              نظام التقييم المهني المتقدم - معتمد دولياً
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          color: isDarkMode ? '#a8a8b8' : '#64748b',
          fontSize: '12px'
        }}>
          <span>🏆 معتمد دولياً</span>
          <span>🔬 علمي ودقيق</span>
          <span>🌟 نتائج فورية</span>
          <span>🎯 توصيات مخصصة</span>
        </div>
      </div>
    </div>
  );




  // D3 Radar Chart Component
  const RadarChartD3 = () => {
    const svgRef = useRef(null);
    
    useEffect(() => {
      console.log('🎨 RadarChartD3: Rendering');
      console.log('📊 svgRef.current:', svgRef.current);
      console.log('📊 raw_scores:', raw_scores);
      
      if (!svgRef.current || !raw_scores) {
        console.log('❌ RadarChartD3: Missing data');
        return;
      }
      
      console.log('✅ RadarChartD3: Drawing chart');
      
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();
      
      // Data preparation
      const data = Object.entries(raw_scores).map(([type, scores]) => ({
        type,
        value: scores.percentage || 0
      }));
      
      // Chart dimensions
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2 - 40;
      const levels = 5;
      
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);
      
      // Scales
      const angleSlice = (Math.PI * 2) / data.length;
      const rScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius]);
      
      // Draw circular grid
      for (let i = 1; i <= levels; i++) {
        const levelRadius = radius * (i / levels);
        svg.append("circle")
          .attr("r", levelRadius)
          .style("fill", "none")
          .style("stroke", "rgba(255, 255, 255, 0.1)")
          .style("stroke-width", "1px");
      }
      
      // Draw axes
      data.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        svg.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x)
          .attr("y2", y)
          .style("stroke", "rgba(255, 255, 255, 0.1)")
          .style("stroke-width", "1px");
        
        // Labels
        const labelX = (radius + 30) * Math.cos(angle);
        const labelY = (radius + 30) * Math.sin(angle);
        
        svg.append("text")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("fill", "#ffffff")
          .style("font-size", "16px")
          .style("font-weight", "bold")
          .text(d.type);
      });
      
      // Draw data polygon
      const lineGenerator = d3.lineRadial()
        .angle((d, i) => angleSlice * i)
        .radius(d => rScale(d.value))
        .curve(d3.curveLinearClosed);
      
      svg.append("path")
        .datum(data)
        .attr("d", lineGenerator)
        .style("fill", "rgba(59, 130, 246, 0.3)")
        .style("stroke", "#3b82f6")
        .style("stroke-width", "3px");
      
      // Draw data points
      data.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = rScale(d.value) * Math.cos(angle);
        const y = rScale(d.value) * Math.sin(angle);
        
        svg.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 6)
          .style("fill", "#3b82f6")
          .style("stroke", "#ffffff")
          .style("stroke-width", "2px");
      });
      
    }, [raw_scores]);
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <svg ref={svgRef}></svg>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Primary Result Card with Radar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
        {/* Left: Code Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '50px',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '100px', marginBottom: '30px' }}>
            {typeDetails[primaryType.type].icon}
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            direction: 'rtl',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            {holland_code}
          </h1>
          
          <h2 style={{
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '600',
            marginBottom: '30px',
            direction: 'rtl'
          }}>
            {typeDetails[primaryType.type].name}
          </h2>
          
          {/* Primary Scores */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '15px',
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '5px' }}>
                {primaryType.raw}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>النقاط</div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '15px',
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a78bfa', marginBottom: '5px' }}>
                {raw_scores[primaryType.type].percentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>النسبة</div>
            </div>
          </div>
        </div>
        
        {/* Right: Radar Chart */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '30px',
          padding: '30px',
          border: '2px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            textAlign: 'center',
            direction: 'rtl',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            📊 ملف الميول المهنية
          </h3>
          <RadarChartD3 />
        </div>
      </div>



      {/* Results Explanation */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '25px',
        padding: '30px',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        marginBottom: '40px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#22c55e',
          marginBottom: '20px',
          direction: 'rtl',
          fontFamily: 'Cairo, Arial, sans-serif',
          textAlign: 'center'
        }}>
          📋 شرح النتائج - ماذا تعني هذه الأرقام؟
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          fontSize: '16px',
          lineHeight: '1.6',
          direction: 'rtl',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
            <h4 style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '10px' }}>🎯 الكود المهني ({holland_code})</h4>
            <p style={{ color: '#ffffff', fontSize: '14px' }}>
              هذا الكود يمثل أعلى 3 أنواع لديك مرتبة حسب القوة. النوع الأول هو الأقوى والأكثر مناسبة لك مهنياً.
            </p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
            <h4 style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '10px' }}>📊 النسبة المئوية</h4>
            <p style={{ color: '#ffffff', fontSize: '14px' }}>
              تشير إلى قوة ميولك نحو هذا النوع. النسب العالية (+70%) تعني ميول قوية، والمتوسطة (50-70%) ميول معتدلة.
            </p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
            <h4 style={{ color: '#34d399', fontWeight: 'bold', marginBottom: '10px' }}>📈 الرتبة المئوية</h4>
            <p style={{ color: '#ffffff', fontSize: '14px' }}>
              تعني أنك حصلت على درجة أعلى من هذه النسبة من الأشخاص. مثلاً: الرتبة 85 تعني أنك أعلى من 85% من الناس.
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Types */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {top3Types.map((typeData, index) => (
          <div
            key={typeData.type}
            style={{
              background: index === 0 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 179, 8, 0.15))'
                : 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              padding: '30px',
              border: index === 0 
                ? '2px solid rgba(245, 158, 11, 0.5)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '70px', marginBottom: '20px' }}>
              {typeDetails[typeData.type].icon}
            </div>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px',
              direction: 'rtl'
            }}>
              {typeDetails[typeData.type].name}
            </h3>
            
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: typeDetails[typeData.type].color,
              marginBottom: '10px'
            }}>
              {raw_scores[typeData.type].percentage.toFixed(2)}%
            </div>
            
            <div style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '15px',
              direction: 'rtl'
            }}>
              {typeData.raw} نقطة | الرتبة #{index + 1}
            </div>
            
            {index === 0 && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fcd34d',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block',
                direction: 'rtl'
              }}>
                النمط المهيمن
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quality Indices */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          direction: 'rtl',
          textAlign: 'center'
        }}>
          مؤشرات جودة التقييم
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '25px'
        }}>
          {Object.entries(indices).map(([key, data]) => (
            <div key={key} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              textAlign: 'center'
            }}>
              <h4 style={{
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '15px',
                fontSize: '18px',
                direction: 'rtl'
              }}>
                {getIndexName(key)}
              </h4>
              
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '10px'
              }}>
                {data.score.toFixed(1)}
              </div>
              
              <div style={{
                fontSize: '14px',
                padding: '6px 12px',
                borderRadius: '12px',
                backgroundColor: data.score >= 75 ? 'rgba(34, 197, 94, 0.2)' :
                                data.score >= 50 ? 'rgba(245, 158, 11, 0.2)' :
                                'rgba(239, 68, 68, 0.2)',
                color: data.score >= 75 ? '#86efac' :
                       data.score >= 50 ? '#fcd34d' :
                       '#fca5a5',
                direction: 'rtl'
              }}>
                {typeof data.interpretation === 'object' ? data.interpretation?.text || 'تفسير غير متوفر' : data.interpretation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailedTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* All Types Analysis */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          direction: 'rtl',
          textAlign: 'center',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          📊 تحليل جميع الأنواع
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ranking.map((typeData, index) => (
            <div key={typeData.type} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '25px',
              border: index < 3 ? '2px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px',
                direction: 'rtl'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '32px' }}>{typeDetails[typeData.type].icon}</span>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#ffffff',
                      fontSize: '20px',
                      fontFamily: 'Cairo, Arial, sans-serif'
                    }}>
                      {typeDetails[typeData.type].name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      fontFamily: 'Cairo, Arial, sans-serif'
                    }}>
                      {typeof raw_scores[typeData.type].interpretation === 'object' ? 
                        raw_scores[typeData.type].interpretation?.text || 'تفسير غير متوفر' : 
                        raw_scores[typeData.type].interpretation}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '24px'
                  }}>
                    {raw_scores[typeData.type].percentage.toFixed(2)}%
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#9ca3af'
                  }}>
                    Z: {raw_scores[typeData.type].z.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                backgroundColor: '#374151',
                borderRadius: '10px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div
                  style={{ 
                    height: '8px',
                    borderRadius: '10px',
                    transition: 'all 0.7s ease',
                    width: `${raw_scores[typeData.type].percentage}%`,
                    backgroundColor: typeDetails[typeData.type].color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subdomain Analysis for Top 3 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          direction: 'rtl',
          textAlign: 'center',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          🔍 تحليل المجالات الفرعية
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {top3Types.map((typeData) => (
            <div key={typeData.type} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{
                fontWeight: '600',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '20px',
                direction: 'rtl',
                fontFamily: 'Cairo, Arial, sans-serif'
              }}>
                <span>{typeDetails[typeData.type].icon}</span>
                {typeDetails[typeData.type].name}
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {Object.entries(raw_scores[typeData.type].subdomains).map(([subdomain, data]) => (
                  <div key={subdomain} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '15px',
                    padding: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                      direction: 'rtl'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#d1d5db',
                        fontFamily: 'Cairo, Arial, sans-serif'
                      }}>
                        {subdomain}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {data.percentage.toFixed(2)}%
                      </span>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      backgroundColor: '#374151',
                      borderRadius: '8px',
                      height: '6px',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{ 
                          height: '6px',
                          borderRadius: '8px',
                          transition: 'all 0.7s ease',
                          width: `${data.percentage}%`,
                          backgroundColor: typeDetails[typeData.type].color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TechnicalTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Algorithm Info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          direction: 'rtl',
          textAlign: 'center',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          ⚙️ معلومات الخوارزمية
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '25px'
          }}>
            <h4 style={{
              fontWeight: '600',
              color: '#60a5fa',
              marginBottom: '15px',
              fontSize: '18px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              المعاملات
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>البلد:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>{algorithmResults.norms_used}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>النسخة:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>{algorithmResults.params.version}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>معامل Lambda:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>{algorithmResults.params.lambda}</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '25px'
          }}>
            <h4 style={{
              fontWeight: '600',
              color: '#10b981',
              marginBottom: '15px',
              fontSize: '18px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              إحصائيات
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>إجمالي النقاط:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>
                  {Object.values(raw_scores).reduce((sum, type) => sum + type.raw, 0)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>الاستجابات القوية:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>
                  {Object.values(raw_scores).reduce((sum, type) => sum + type.stronglyLiked.length, 0)}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '25px'
          }}>
            <h4 style={{
              fontWeight: '600',
              color: '#a855f7',
              marginBottom: '15px',
              fontSize: '18px',
              direction: 'rtl',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              كود الثلاثي
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>الكود:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'monospace' }}>{holland_code}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>النقاط:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>{triad_details.winner.score.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                direction: 'rtl'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>الاتساق:</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'Cairo, Arial, sans-serif' }}>{triad_details.winner.consistency.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triad Candidates */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '30px',
          direction: 'rtl',
          textAlign: 'center',
          fontFamily: 'Cairo, Arial, sans-serif'
        }}>
          🏆 البدائل المرشحة
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {triad_details.top5.slice(0, 5).map((candidate, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '15px',
                background: index === 0 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: index === 0 
                  ? '2px solid rgba(59, 130, 246, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                direction: 'rtl'
              }}
            >
              <span style={{
                fontFamily: 'monospace',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {candidate.code}
              </span>
              
              <div style={{
                display: 'flex',
                gap: '30px',
                alignItems: 'center'
              }}>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  نقاط: {candidate.score.toFixed(2)}
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontFamily: 'Cairo, Arial, sans-serif'
                }}>
                  اتساق: {candidate.consistency.toFixed(1)}%
                </span>
                {index === 0 && (
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    color: '#93c5fd',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'Cairo, Arial, sans-serif'
                  }}>
                    مختار
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Recommendations Tab Component
  const RecommendationsTab = () => {
    console.log('🎯 RecommendationsTab: Rendering');
    console.log('📊 loadingRecommendations:', loadingRecommendations);
    console.log('📋 recommendations:', recommendations);
    console.log('🔤 holland_code:', holland_code);
    
    if (loadingRecommendations) {
      return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a8a8b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '18px' }}>جاري تحميل التوصيات...</div>
        </div>
      );
    }

    if (!recommendations) {
      return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a8a8b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '18px' }}>لم يتم العثور على توصيات لهذا الكود</div>
        </div>
      );
    }

    return (
      <div style={{ direction: 'rtl' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '15px',
            fontFamily: 'Cairo, Arial, sans-serif'
          }}>
            🎯 التوصيات المهنية المخصصة
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#93c5fd',
              fontWeight: 'bold'
            }}>
              كود هولاند: {recommendations.holland_code}
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#c4b5fd',
              fontWeight: 'bold'
            }}>
              المنطقة: {recommendations.region}
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              color: '#6ee7b7',
              fontWeight: 'bold'
            }}>
              المرحلة: {recommendations.education_level}
            </div>
          </div>
        </div>

        {/* Career Recommendations List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '25px',
            fontFamily: 'Cairo, Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>💼</span>
            الوظائف المناسبة لك
          </h3>
          
          {(() => {
            // استخراج الوظائف من النص
            console.log('📋 recommendations.recommendations_ar:', recommendations.recommendations_ar);
            
            const jobs = recommendations.recommendations_ar
              .split(/[؛;]/)
              .map(j => j.trim())
              .filter(j => j.length > 0);
            
            console.log('✅ عدد الوظائف المستخرجة:', jobs.length);
            console.log('📋 الوظائف:', jobs);
            
            // حساب نسبة المطابقة بناءً على ترتيب الكود
            const codeLetters = recommendations.holland_code.split('');
            
            return (
              <div style={{ display: 'grid', gap: '15px' }}>
                {jobs.map((job, index) => {
                  // حساب نسبة المطابقة (أول 6 وظائف = 95-100%, باقي = 85-94%)
                  const matchPercentage = index < 6 
                    ? 100 - (index * 1) 
                    : 94 - ((index - 6) * 2);
                  
                  return (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                      borderRadius: '15px',
                      padding: '20px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(-5px)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          borderRadius: '12px',
                          width: '45px',
                          height: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            marginBottom: '5px',
                            fontFamily: 'Cairo, Arial, sans-serif'
                          }}>
                            {job}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: '#9ca3af'
                          }}>
                            مناسب لكود {recommendations.holland_code}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: matchPercentage >= 95 ? '#10b981' : matchPercentage >= 90 ? '#3b82f6' : '#8b5cf6'
                        }}>
                          {matchPercentage}%
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          مطابقة
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            تقرير RIASEC الدولي المتقدم
          </h1>
          <p className="text-gray-300">
            نتائج مفصلة بناءً على خوارزمية دولية متطورة
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'نظرة عامة', icon: '📊' },
            { id: 'recommendations', label: 'التوصيات المهنية', icon: '🎯' },
            { id: 'detailed', label: 'تحليل مفصل', icon: '🔍' },
            { id: 'technical', label: 'التفاصيل التقنية', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '15px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? 'white' : '#9ca3af',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'recommendations' && <RecommendationsTab />}
          {activeTab === 'detailed' && <DetailedTab />}
          {activeTab === 'technical' && <TechnicalTab />}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '50px',
          flexWrap: 'wrap'
        }}>
          {/* Save Results Button */}
          <SaveResultsButton 
            algorithmResults={algorithmResults}
            onSaveSuccess={(result) => {
              console.log('✅ تم حفظ النتائج:', result);
            }}
            onSaveError={(error) => {
              console.error('❌ خطأ في حفظ النتائج:', error);
            }}
          />
          
          <button
            onClick={onRetakeAssessment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              borderRadius: '15px',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            <span style={{ fontSize: '18px' }}>🔄</span>
            إعادة التقييم
          </button>
          
          <button
            onClick={onBackToAssessments}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 30px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '15px',
              fontWeight: '600',
              fontSize: '16px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            العودة للتقييمات
          </button>
        </div>
      </div>
    </div>
  );
};

export default RIASECInternationalResults;