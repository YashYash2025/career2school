# 📋 قالب إنشاء تقييم جديد

## 🎯 نظرة عامة

هذا القالب يوضح الخطوات الكاملة لإنشاء تقييم جديد في منصة School2Career.

---

## 📝 الخطوات الأساسية:

### **1. تحديد المعلومات الأساسية:**

```javascript
const assessmentInfo = {
  // المعلومات الأساسية
  tool_code: 'ASSESSMENT_CODE',
  brand_name_ar: 'الاسم التجاري™',
  brand_name_en: 'Brand Name™',
  brand_name_fr: 'Nom de Marque™',
  
  slogan_ar: 'السلوجان بالعربي',
  slogan_en: 'English Slogan',
  slogan_fr: 'Slogan Français',
  
  // الأيقونة
  icon: '🎯',
  
  // النسخ المتاحة
  versions: [
    {
      id: 'version-1',
      name: 'النسخة الأولى',
      questions: 60,
      duration: '15-20 دقيقة',
      target_age: '13-18 سنة'
    }
  ]
};
```

---

## 🗄️ قاعدة البيانات:

### **1. إضافة الأداة في `assessment_tools`:**

```sql
INSERT INTO assessment_tools (
  tool_code,
  tool_name_ar,
  tool_name_en,
  tool_name_fr,
  description_ar,
  description_en,
  description_fr,
  category,
  duration_minutes,
  question_count,
  is_active
) VALUES (
  'ASSESSMENT_CODE',
  'اسم التقييم',
  'Assessment Name',
  'Nom d''évaluation',
  'وصف التقييم',
  'Assessment Description',
  'Description de l''évaluation',
  'personality', -- أو 'career' أو 'skills'
  20,
  60,
  true
);
```

### **2. إضافة العلامة التجارية في `assessment_tools_branding`:**

```sql
INSERT INTO assessment_tools_branding (
  tool_code,
  brand_name_ar,
  brand_name_en,
  brand_name_fr,
  slogan_ar,
  slogan_en,
  slogan_fr,
  description_ar,
  description_en,
  description_fr,
  icon,
  primary_color,
  secondary_color
) VALUES (
  'ASSESSMENT_CODE',
  'الاسم التجاري™',
  'Brand Name™',
  'Nom de Marque™',
  'السلوجان',
  'Slogan',
  'Slogan',
  'الوصف',
  'Description',
  'Description',
  '🎯',
  '#667eea',
  '#764ba2'
);
```

### **3. إضافة الأسئلة في `assessment_questions`:**

```sql
INSERT INTO assessment_questions (
  tool_id,
  question_ar,
  question_en,
  question_fr,
  question_type,
  dimension,
  subdimension,
  order_index,
  is_reverse_scored,
  options
) VALUES (
  (SELECT id FROM assessment_tools WHERE tool_code = 'ASSESSMENT_CODE'),
  'السؤال بالعربي',
  'Question in English',
  'Question en Français',
  'likert_5', -- أو 'yes_no' أو 'multiple_choice'
  'البُعد الرئيسي',
  'البُعد الفرعي',
  1,
  false,
  '{"ar": ["خيار 1", "خيار 2"], "en": ["Option 1", "Option 2"]}'::jsonb
);
```

---

## 💻 الكود:

### **1. إنشاء الخوارزمية (`app/lib/algorithms/YourAlgorithm.js`):**

```javascript
/**
 * Your Assessment Algorithm
 * 
 * Inputs:
 *  - responses: Object with user answers
 *  - questions: Array of question objects
 * 
 * Output:
 *  - Detailed scoring object
 */

class YourAlgorithm {
  constructor() {
    // تعريف الأبعاد/الأنواع
    this.dimensions = ['D1', 'D2', 'D3'];
    
    // المعايير
    this.norms = {
      D1: { mean: 30, sd: 10 },
      D2: { mean: 25, sd: 8 },
      D3: { mean: 28, sd: 9 }
    };
  }

  /**
   * حساب النتائج
   */
  calculate(responses, questions) {
    const results = {
      raw_scores: {},
      ranking: [],
      summary: '',
      indices: {}
    };

    // حساب الدرجات لكل بُعد
    for (const dim of this.dimensions) {
      const dimQuestions = questions.filter(q => q.dimension === dim);
      let totalScore = 0;
      
      dimQuestions.forEach(q => {
        const answer = responses[`q${q.order_index}`];
        totalScore += this.scoreQuestion(answer, q.is_reverse_scored);
      });
      
      const maxScore = dimQuestions.length * 5;
      const percentage = (totalScore / maxScore) * 100;
      
      results.raw_scores[dim] = {
        raw: totalScore,
        percentage: parseFloat(percentage.toFixed(2)),
        interpretation: this.interpretScore(dim, percentage)
      };
    }

    // ترتيب الأبعاد
    results.ranking = this.dimensions
      .map(dim => ({
        dimension: dim,
        percentage: results.raw_scores[dim].percentage
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // توليد الملخص
    results.summary = this.generateSummary(results);

    return results;
  }

  scoreQuestion(answer, isReverse) {
    const numAnswer = parseInt(answer);
    if (isReverse) {
      return 6 - numAnswer;
    }
    return numAnswer;
  }

  interpretScore(dimension, percentage) {
    if (percentage >= 67) return 'مرتفع';
    if (percentage >= 34) return 'متوسط';
    return 'منخفض';
  }

  generateSummary(results) {
    const highest = results.ranking[0];
    return `أعلى بُعد لديك هو ${highest.dimension} بنسبة ${highest.percentage.toFixed(0)}%`;
  }
}

export default YourAlgorithm;
```

### **2. إنشاء صفحة اختيار النسخة (`app/assessments/your-assessment/page.js`):**

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import UnifiedNavigation from '@/app/components/UnifiedNavigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function YourAssessmentSelector() {
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
        .eq('tool_code', 'YOUR_ASSESSMENT_CODE')
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
      id: 'version-1',
      title: 'النسخة الأولى',
      description: 'وصف النسخة',
      icon: '🎯',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      features: [
        'ميزة 1',
        'ميزة 2',
        'ميزة 3'
      ]
    }
  ];

  const handleVersionSelect = (versionId) => {
    router.push(`/assessments/your-assessment/enhanced?version=${versionId}`);
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
      {/* Background */}
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
        
        {/* Header Section */}
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
            }}>🎯</span>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Cairo, Arial, sans-serif'
            }}>
              {branding?.brand_name_ar || 'اسم التقييم™'}
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
            {branding?.slogan_ar || 'السلوجان'}
          </p>
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
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleVersionSelect(version.id)}
              >
                <div style={{ fontSize: '64px', marginBottom: '20px', textAlign: 'center' }}>
                  {version.icon}
                </div>
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
                    fontFamily: 'Cairo, Arial, sans-serif',
                    direction: 'rtl'
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
```

### **3. إنشاء API للحفظ (`app/api/assessments/your-assessment/save/route.js`):**

```javascript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { tool_id, session_id, responses, results, duration } = body;

    console.log('💾 حفظ النتائج...');

    // حفظ النتائج
    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        tool_id: tool_id,
        session_id: session_id,
        detailed_scores: results,
        raw_score: results.raw_scores,
        percentage_score: results.ranking[0].percentage,
        profile_type: results.profile_code,
        profile_description: results.summary,
        is_public: false
      })
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في حفظ النتائج:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ تم حفظ النتائج بنجاح');

    return NextResponse.json({
      success: true,
      result_id: data.id,
      message: 'تم حفظ النتائج بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## ✅ Checklist:

- [ ] تحديد المعلومات الأساسية (الاسم، السلوجان، الأيقونة)
- [ ] إضافة الأداة في `assessment_tools`
- [ ] إضافة العلامة التجارية في `assessment_tools_branding`
- [ ] إضافة الأسئلة في `assessment_questions`
- [ ] إنشاء الخوارزمية في `app/lib/algorithms/`
- [ ] إنشاء صفحة اختيار النسخة
- [ ] إنشاء صفحة التقييم
- [ ] إنشاء component النتائج
- [ ] إنشاء API للحفظ
- [ ] إنشاء API للأسئلة
- [ ] اختبار التقييم كاملاً
- [ ] توثيق التقييم في `docs/`

---

**آخر تحديث:** 10 أكتوبر 2025
