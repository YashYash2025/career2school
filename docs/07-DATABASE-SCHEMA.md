# 🗄️ Database Schema - قاعدة البيانات

## 📋 نظرة عامة

توثيق شامل لجداول قاعدة البيانات الخاصة بنظام التقييمات في منصة School2Career.

---

## 📊 الجداول الرئيسية:

### **1. assessment_tools**
جدول الأدوات/التقييمات المتاحة في المنصة.

```sql
CREATE TABLE assessment_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- الكود الفريد
  tool_code VARCHAR(100) UNIQUE NOT NULL,
  
  -- الأسماء بثلاث لغات
  tool_name_ar VARCHAR(255) NOT NULL,
  tool_name_en VARCHAR(255) NOT NULL,
  tool_name_fr VARCHAR(255) NOT NULL,
  
  -- الأوصاف
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  
  -- التصنيف
  category VARCHAR(50) CHECK (category IN (
    'personality',  -- تقييمات الشخصية
    'career',       -- تقييمات مهنية
    'skills',       -- تقييمات المهارات
    'aptitude'      -- تقييمات القدرات
  )),
  
  -- المعلومات
  duration_minutes INTEGER,
  question_count INTEGER,
  
  -- الحالة
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**أمثلة:**
- `BIG5_60_MIDDLE` - Big5 للمدارس الإعدادية
- `BIG5_60_HIGH` - Big5 للمدارس الثانوية
- `BIG5_60_COLLEGE` - Big5 للجامعات
- `RIASEC_60_SCHOOL` - RIASEC للمدارس
- `RIASEC_60_COLLEGE` - RIASEC للجامعات

---

### **2. assessment_tools_branding**
جدول العلامات التجارية للتقييمات.

```sql
CREATE TABLE assessment_tools_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- الكود المرتبط
  tool_code VARCHAR(100) UNIQUE NOT NULL,
  
  -- الأسماء التجارية
  brand_name_ar VARCHAR(255),
  brand_name_en VARCHAR(255),
  brand_name_fr VARCHAR(255),
  
  -- السلوجان
  slogan_ar TEXT,
  slogan_en TEXT,
  slogan_fr TEXT,
  
  -- الأوصاف
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  
  -- التصميم
  icon VARCHAR(50),
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**أمثلة:**
- Big5: `مرآة الشخصية™` - `افهم نفسك لتختار مستقبلك`
- RIASEC: `بوصلة المهن™` - `اكتشف مسارك المهني بدقة علمية`

---

### **3. assessment_questions**
جدول أسئلة التقييمات.

```sql
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES assessment_tools(id) ON DELETE CASCADE,
  
  -- السؤال بثلاث لغات
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_fr TEXT NOT NULL,
  
  -- نوع السؤال
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN (
    'likert_5',         -- مقياس ليكرت 5 نقاط (1-5)
    'likert_7',         -- مقياس ليكرت 7 نقاط (1-7)
    'yes_no',           -- نعم/لا
    'multiple_choice',  -- اختيار متعدد
    'ranking',          -- ترتيب
    'text'              -- نص حر
  )),
  
  -- الخيارات (JSON)
  options JSONB,
  
  -- التصنيف
  dimension VARCHAR(100),      -- البُعد الرئيسي (مثل: O, C, E, A, N)
  subdimension VARCHAR(100),   -- البُعد الفرعي
  
  -- الوزن والترتيب
  weight NUMERIC DEFAULT 1.0,
  order_index INTEGER NOT NULL,
  is_reverse_scored BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**أمثلة:**

**Big5:**
```sql
-- سؤال عادي
{
  question_ar: 'أنا شخص منظم',
  question_type: 'likert_5',
  dimension: 'C',
  is_reverse_scored: false
}

-- سؤال معكوس
{
  question_ar: 'أترك أغراضي في كل مكان',
  question_type: 'likert_5',
  dimension: 'C',
  is_reverse_scored: true
}
```

**RIASEC:**
```sql
{
  question_ar: 'إصلاح الأجهزة الإلكترونية',
  question_type: 'yes_no',
  dimension: 'R',
  subdimension: 'ميكانيكي/تقني',
  is_reverse_scored: false
}
```

---

### **4. assessment_sessions**
جدول جلسات التقييم.

```sql
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES assessment_packages(id),
  tool_id UUID REFERENCES assessment_tools(id),
  
  -- نوع التقرير والدفع
  report_type VARCHAR(20) CHECK (report_type IN ('basic', 'advanced', 'premium')),
  credits_paid INTEGER NOT NULL DEFAULT 0,
  
  -- التوقيت
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- التقدم
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  
  -- الإجابات المحفوظة
  responses JSONB DEFAULT '{}'::jsonb,
  
  -- المساعدات (Powerups)
  hints_used INTEGER DEFAULT 0,
  skips_used INTEGER DEFAULT 0,
  fifty_fifty_used INTEGER DEFAULT 0,
  extra_time_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**مثال responses:**
```json
{
  "q1": 4,
  "q2": 2,
  "q3": 5,
  "q4": 1
}
```

---

### **5. user_answers**
جدول إجابات المستخدمين التفصيلية.

```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES assessment_questions(id),
  
  -- الإجابة
  answer_value TEXT,
  answer_json JSONB,
  
  -- التقييم
  points_earned NUMERIC DEFAULT 0,
  is_correct BOOLEAN,
  
  -- الوقت
  time_spent_seconds INTEGER,
  
  -- العلامات
  is_flagged BOOLEAN DEFAULT false,
  
  answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

### **6. assessment_results**
جدول نتائج التقييمات (الجدول الأهم).

```sql
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES assessment_packages(id),
  tool_id UUID REFERENCES assessment_tools(id),
  
  -- الدرجات
  raw_score NUMERIC,
  percentage_score NUMERIC,
  percentile_rank INTEGER,
  detailed_scores JSONB NOT NULL,
  
  -- التقارير
  basic_report JSONB,
  advanced_report JSONB,
  premium_report JSONB,
  
  -- التوصيات
  career_recommendations TEXT[],
  study_recommendations TEXT[],
  skill_recommendations TEXT[],
  
  -- الملف الشخصي
  profile_type VARCHAR(100),
  profile_description TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  
  -- المشاركة
  share_token VARCHAR(100) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**مثال detailed_scores لـ Big5:**
```json
{
  "raw_scores": {
    "O": {
      "raw": 45,
      "max": 60,
      "percentage": 75.0,
      "level": "high",
      "level_ar": "مرتفع",
      "interpretation": "منفتح على التجارب الجديدة..."
    },
    "C": {...},
    "E": {...},
    "A": {...},
    "N": {...}
  },
  "profile_code": "OCEAN-High-High-Moderate-High-Low",
  "profile_name": {
    "ar": "المبدع الاجتماعي",
    "en": "The Creative Social",
    "fr": "Le Social Créatif"
  },
  "ranking": [
    {"trait": "O", "percentage": 75.0},
    {"trait": "E", "percentage": 70.0},
    ...
  ],
  "summary": "شخصيتك تتميز بارتفاع الانفتاح...",
  "indices": {
    "profile_elevation": {"score": 65.5, "interpretation": "..."},
    "differentiation": {"score": 35.2, "interpretation": "..."},
    "consistency": {"score": 78.3, "interpretation": "..."}
  }
}
```

**مثال detailed_scores لـ RIASEC:**
```json
{
  "assessment_type": "RIASEC",
  "holland_code": "RIA",
  "raw_scores": {
    "R": {
      "raw": 8,
      "percentage": 80.0,
      "z": 1.5,
      "percentile": 93,
      "liked": ["R1", "R3", "R5", ...],
      "subdomains": {
        "ميكانيكي/تقني": {"score": 3, "percentage": 75.0},
        "زراعي/طبيعي": {"score": 2, "percentage": 50.0},
        "بدني/خارجي": {"score": 3, "percentage": 75.0}
      },
      "interpretation": "اهتمام قوي بالعمل اليدوي/العملي"
    },
    "I": {...},
    "A": {...},
    "S": {...},
    "E": {...},
    "C": {...}
  },
  "ranking": [
    {"type": "R", "raw": 8, "z": 1.5, "pct": 93},
    {"type": "I", "raw": 7, "z": 1.2, "pct": 88},
    {"type": "A", "raw": 6, "z": 0.9, "pct": 82}
  ],
  "indices": {
    "differentiation": {"score": 45.5, "interpretation": "ملف واضح ومحدد"},
    "consistency": {"score": 85.2, "interpretation": "توافق عالٍ"},
    "congruence": {"score": 90.0, "interpretation": "مناسبة عالية"},
    "profile_elevation": {"score": 62.3, "interpretation": "اهتمامات متوسطة"}
  }
}
```

---

### **7. career_recommendations**
جدول التوصيات المهنية.

```sql
CREATE TABLE career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_result_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  
  -- معلومات المهنة
  career_title_ar VARCHAR(255),
  career_title_en VARCHAR(255),
  career_title_fr VARCHAR(255),
  
  career_description_ar TEXT,
  career_description_en TEXT,
  career_description_fr TEXT,
  
  -- التطابق
  match_percentage NUMERIC,
  match_reason TEXT,
  
  -- المعلومات الإضافية
  required_education TEXT[],
  required_skills TEXT[],
  salary_range VARCHAR(100),
  job_outlook VARCHAR(100),
  
  -- الترتيب
  rank INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 العلاقات بين الجداول:

```
assessment_tools
    ↓ (1:N)
assessment_questions
    ↓ (N:1)
user_answers
    ↓ (N:1)
assessment_sessions
    ↓ (1:1)
assessment_results
    ↓ (1:N)
career_recommendations
```

---

## 📊 Indexes المهمة:

```sql
-- Indexes لجدول assessment_results
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX idx_assessment_results_created_at ON assessment_results(created_at);
CREATE INDEX idx_assessment_results_tool_id ON assessment_results(tool_id);

-- Indexes لجدول assessment_sessions
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_tool_id ON assessment_sessions(tool_id);
CREATE INDEX idx_assessment_sessions_started_at ON assessment_sessions(started_at);

-- Indexes لجدول user_answers
CREATE INDEX idx_user_answers_session_id ON user_answers(session_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- Indexes لجدول assessment_questions
CREATE INDEX idx_assessment_questions_tool_id ON assessment_questions(tool_id);
CREATE INDEX idx_assessment_questions_dimension ON assessment_questions(dimension);
```

---

## 🔒 Row Level Security (RLS):

```sql
-- تفعيل RLS على جدول assessment_results
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Policy: المستخدمون يمكنهم قراءة نتائجهم فقط
CREATE POLICY "Users can read own assessment results"
  ON assessment_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: المستخدمون يمكنهم إضافة نتائجهم فقط
CREATE POLICY "Users can insert own assessment results"
  ON assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: المستخدمون يمكنهم تحديث نتائجهم فقط
CREATE POLICY "Users can update own assessment results"
  ON assessment_results
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 📝 أمثلة Queries:

### **1. جلب جميع تقييمات مستخدم:**
```sql
SELECT 
  ar.id,
  ar.created_at,
  at.tool_name_ar,
  ar.percentage_score,
  ar.profile_type
FROM assessment_results ar
JOIN assessment_tools at ON ar.tool_id = at.id
WHERE ar.user_id = 'user-uuid'
ORDER BY ar.created_at DESC;
```

### **2. جلب أسئلة تقييم معين:**
```sql
SELECT 
  aq.id,
  aq.question_ar,
  aq.question_type,
  aq.dimension,
  aq.order_index,
  aq.is_reverse_scored
FROM assessment_questions aq
JOIN assessment_tools at ON aq.tool_id = at.id
WHERE at.tool_code = 'BIG5_60_COLLEGE'
ORDER BY aq.order_index;
```

### **3. جلب نتائج تقييم مع التوصيات:**
```sql
SELECT 
  ar.*,
  array_agg(cr.career_title_ar) as careers
FROM assessment_results ar
LEFT JOIN career_recommendations cr ON ar.id = cr.assessment_result_id
WHERE ar.id = 'result-uuid'
GROUP BY ar.id;
```

---

**آخر تحديث:** 10 أكتوبر 2025
