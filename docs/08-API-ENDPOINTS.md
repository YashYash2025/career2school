# 🌐 API Endpoints - نقاط النهاية

## 📋 نظرة عامة

توثيق شامل لجميع API endpoints الخاصة بنظام التقييمات في منصة School2Career.

---

## 🎯 Big5 Assessment APIs:

### **1. GET `/api/assessments/big5/questions`**
جلب أسئلة تقييم Big5.

**Parameters:**
```javascript
{
  version: 'middle-school' | 'high-school' | 'college',
  language: 'ar' | 'en' | 'fr',
  randomize: 'true' | 'false'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "uuid",
        "question_ar": "أنا شخص منظم",
        "question_en": "I am an organized person",
        "question_fr": "Je suis une personne organisée",
        "question_type": "likert_5",
        "dimension": "C",
        "order_index": 1,
        "is_reverse_scored": false
      }
    ],
    "metadata": {
      "version": "college",
      "language": "ar",
      "total_questions": 60,
      "tool_code": "BIG5_60_COLLEGE"
    }
  }
}
```

---

### **2. POST `/api/assessments/big5/save`**
حفظ نتائج تقييم Big5.

**Request Body:**
```json
{
  "tool_id": "uuid",
  "session_id": "uuid",
  "responses": {
    "q1": 4,
    "q2": 2,
    "q3": 5
  },
  "results": {
    "raw_scores": {
      "O": {
        "raw": 45,
        "percentage": 75.0,
        "level": "high",
        "interpretation": "..."
      }
    },
    "profile_code": "OCEAN-High-High-Moderate-High-Low",
    "profile_name": {
      "ar": "المبدع الاجتماعي"
    },
    "ranking": [...],
    "summary": "...",
    "indices": {...}
  },
  "duration": 1200
}
```

**Response:**
```json
{
  "success": true,
  "result_id": "uuid",
  "message": "تم حفظ النتائج بنجاح"
}
```

---

### **3. GET `/api/assessments/big5/recommendations`**
جلب التوصيات المهنية بناءً على Profile Code.

**Parameters:**
```javascript
{
  profile: 'OCEAN-High-High-Moderate-High-Low'
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": "نص التوصيات المهنية..."
}
```

---

## 🎯 RIASEC Assessment APIs:

### **1. GET `/api/assessments/riasec/questions`**
جلب أسئلة تقييم RIASEC.

**Parameters:**
```javascript
{
  version: '30' | '60' | '180' | 'school' | 'college',
  language: 'ar' | 'en' | 'fr',
  randomize: 'true' | 'false',
  stratified: 'true' | 'false'  // Stratified sampling
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "uuid",
        "question_ar": "إصلاح الأجهزة الإلكترونية",
        "question_en": "Repair electronic devices",
        "question_fr": "Réparer des appareils électroniques",
        "question_type": "yes_no",
        "dimension": "R",
        "subdimension": "ميكانيكي/تقني",
        "order_index": 1,
        "question_number": 1,
        "total_questions": 60
      }
    ],
    "metadata": {
      "version": "60",
      "language": "ar",
      "total_questions": 60,
      "tool_code": "RIASEC_60",
      "randomized": true,
      "stratified_sampling": true,
      "fetched_at": "2025-10-10T12:00:00Z"
    }
  }
}
```

---

### **2. POST `/api/assessments/riasec/save`**
حفظ نتائج تقييم RIASEC.

**Request Body:**
```json
{
  "holland_code": "RIA",
  "raw_scores": {
    "R": {
      "raw": 8,
      "percentage": 80.0,
      "z": 1.5,
      "percentile": 93,
      "liked": ["R1", "R3", "R5"],
      "subdomains": {...},
      "interpretation": "..."
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
  "confidence_score": 85
}
```

**Response:**
```json
{
  "success": true,
  "assessment_id": "uuid",
  "message": "تم حفظ النتائج بنجاح"
}
```

---

### **3. POST `/api/assessments/riasec/calculate`**
حساب نتائج RIASEC (بدون حفظ).

**Request Body:**
```json
{
  "responses": {
    "R1": 1,
    "R2": 0,
    "R3": 1,
    "I1": 1,
    "I2": 0
  },
  "options": {
    "country": "international",
    "version": "medium",
    "lambda": 0.35,
    "sdGate": 1.0
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "params": {...},
    "norms_used": "international",
    "raw_scores": {...},
    "ranking": [...],
    "holland_code": "RIA",
    "triad_details": {...},
    "indices": {...}
  }
}
```

---

### **4. GET `/api/assessments/riasec/recommendations`**
جلب التوصيات المهنية بناءً على Holland Code.

**Parameters:**
```javascript
{
  code: 'RIA'
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "career_title_ar": "مهندس ميكانيكي",
      "career_title_en": "Mechanical Engineer",
      "match_percentage": 95,
      "description": "...",
      "required_education": ["بكالوريوس هندسة"],
      "salary_range": "35,000 - 55,000 ريال/سنة"
    }
  ]
}
```

---

## 🔧 General Assessment APIs:

### **1. GET `/api/assessments/questions`**
جلب أسئلة أي تقييم (Generic).

**Parameters:**
```javascript
{
  tool_code: 'BIG5_60_COLLEGE' | 'RIASEC_60_SCHOOL',
  language: 'ar' | 'en' | 'fr'
}
```

**Response:**
```json
{
  "success": true,
  "questions": [...],
  "tool_info": {
    "tool_code": "BIG5_60_COLLEGE",
    "tool_name_ar": "تقييم Big Five للجامعات",
    "category": "personality",
    "duration_minutes": 20,
    "question_count": 60
  }
}
```

---

### **2. GET `/api/assessments/results/:id`**
جلب نتائج تقييم معين.

**Parameters:**
```javascript
{
  id: 'result-uuid'
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "id": "uuid",
    "user_id": "uuid",
    "tool_id": "uuid",
    "created_at": "2025-10-10T12:00:00Z",
    "raw_score": 45,
    "percentage_score": 75.0,
    "detailed_scores": {...},
    "profile_type": "OCEAN-High-High-Moderate-High-Low",
    "profile_description": "...",
    "strengths": ["الانفتاح", "الانبساطية"],
    "weaknesses": ["العصابية"],
    "career_recommendations": [...]
  }
}
```

---

### **3. GET `/api/assessments/user-results`**
جلب جميع نتائج المستخدم.

**Parameters:**
```javascript
{
  user_id: 'user-uuid',
  limit: 10,
  offset: 0
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "tool_name_ar": "تقييم Big Five",
      "created_at": "2025-10-10T12:00:00Z",
      "percentage_score": 75.0,
      "profile_type": "المبدع الاجتماعي"
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

---

## 🔐 Authentication:

جميع APIs تتطلب Authentication عبر Supabase:

**Headers:**
```javascript
{
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json'
}
```

**للحصول على Access Token:**
```javascript
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;
```

---

## ❌ Error Responses:

### **400 Bad Request:**
```json
{
  "success": false,
  "error": "البيانات المطلوبة غير مكتملة",
  "code": "MISSING_PARAMS",
  "details": "version and language are required"
}
```

### **401 Unauthorized:**
```json
{
  "success": false,
  "error": "يرجى تسجيل الدخول",
  "code": "UNAUTHORIZED",
  "details": "User not authenticated"
}
```

### **404 Not Found:**
```json
{
  "success": false,
  "error": "لا توجد أسئلة متاحة",
  "code": "NO_QUESTIONS_FOUND",
  "details": "No questions found for version 60"
}
```

### **500 Internal Server Error:**
```json
{
  "success": false,
  "error": "حدث خطأ في الخادم",
  "code": "SERVER_ERROR",
  "details": "Database connection failed"
}
```

---

## 📊 Rate Limiting:

- **الحد الأقصى:** 100 طلب/دقيقة لكل مستخدم
- **عند التجاوز:** HTTP 429 Too Many Requests

```json
{
  "success": false,
  "error": "تجاوزت الحد الأقصى للطلبات",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

---

## 🧪 Testing:

### **استخدام cURL:**
```bash
# جلب أسئلة Big5
curl -X GET "http://localhost:3000/api/assessments/big5/questions?version=college&language=ar" \
  -H "Authorization: Bearer <token>"

# حفظ نتائج
curl -X POST "http://localhost:3000/api/assessments/big5/save" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"tool_id":"uuid","results":{...}}'
```

### **استخدام JavaScript:**
```javascript
// جلب أسئلة
const response = await fetch('/api/assessments/big5/questions?version=college&language=ar', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const data = await response.json();

// حفظ نتائج
const saveResponse = await fetch('/api/assessments/big5/save', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tool_id: 'uuid',
    results: {...}
  })
});
```

---

**آخر تحديث:** 10 أكتوبر 2025
