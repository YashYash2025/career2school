# Design Document - حفظ نتائج RIASEC في Dashboard

## Overview

هذا التصميم يوضح كيفية حفظ نتائج تقييم RIASEC في قاعدة بيانات Supabase وعرضها في لوحة التحكم (Dashboard). النظام سيسمح للمستخدمين بحفظ نتائجهم، مراجعتها في أي وقت، ومقارنة التقييمات المختلفة.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ Results Page     │         │ Dashboard Page   │         │
│  │ (RIASEC Results) │         │ (User Dashboard) │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                             │                    │
│           │ Save Results                │ Load Results       │
│           ▼                             ▼                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           API Routes (Next.js API)                    │  │
│  │  /api/assessments/riasec/save                        │  │
│  │  /api/assessments/riasec/user-results                │  │
│  └────────┬──────────────────────────────┬───────────────┘  │
│           │                               │                   │
└───────────┼───────────────────────────────┼──────────────────┘
            │                               │
            ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ user_assessments │         │ auth.users       │         │
│  │ Table            │◄────────│ Table            │         │
│  └──────────────────┘         └──────────────────┘         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Row Level Security (RLS) Policies                    │  │
│  │ - Users can only read their own assessments          │  │
│  │ - Users can only insert their own assessments        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. Save Assessment Flow
```
User completes RIASEC → Click "Save Results" → Check Auth Status
                                                        │
                                                        ├─ Not Logged In → Redirect to Login
                                                        │
                                                        └─ Logged In → POST /api/assessments/riasec/save
                                                                              │
                                                                              ├─ Validate Data
                                                                              │
                                                                              ├─ Insert to Supabase
                                                                              │
                                                                              ├─ Update User Stats
                                                                              │
                                                                              └─ Return Success/Error
```

#### 2. Load Assessments Flow
```
User opens Dashboard → GET /api/assessments/riasec/user-results?user_id=xxx
                                    │
                                    ├─ Query Supabase (with RLS)
                                    │
                                    ├─ Order by completed_date DESC
                                    │
                                    └─ Return Assessments Array
                                              │
                                              └─ Display in Dashboard
```

## Components and Interfaces

### 1. Database Schema

#### استخدام الجدول الموجود: `assessment_results`

الجدول موجود بالفعل في قاعدة البيانات مع البنية التالية:

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
  detailed_scores JSONB NOT NULL,  -- هنا هنحفظ holland_code و raw_scores و ranking
  
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

#### بنية الـ `detailed_scores` لـ RIASEC:

```json
{
  "assessment_type": "RIASEC",
  "holland_code": "RIS",
  "raw_scores": {
    "R": { "raw": 8, "percentage": 80 },
    "I": { "raw": 7, "percentage": 70 },
    "A": { "raw": 5, "percentage": 50 },
    "S": { "raw": 6, "percentage": 60 },
    "E": { "raw": 4, "percentage": 40 },
    "C": { "raw": 3, "percentage": 30 }
  },
  "ranking": [
    { "type": "R", "raw": 8, "percentage": 80 },
    { "type": "I", "raw": 7, "percentage": 70 },
    { "type": "S", "raw": 6, "percentage": 60 }
  ],
  "confidence_score": 85
}
```

#### RLS Policies (موجودة بالفعل):

الجدول محتاج RLS policies. هنضيفها:

```sql
-- Enable RLS
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own results
CREATE POLICY "Users can read own results"
  ON assessment_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own results
CREATE POLICY "Users can insert own results"
  ON assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 2. API Endpoints

#### POST `/api/assessments/riasec/save`

**Request Body:**
```typescript
{
  user_id: string;          // UUID of the user
  holland_code: string;     // e.g., "RIS"
  raw_scores: {
    R: { raw: number; percentage: number };
    I: { raw: number; percentage: number };
    A: { raw: number; percentage: number };
    S: { raw: number; percentage: number };
    E: { raw: number; percentage: number };
    C: { raw: number; percentage: number };
  };
  ranking: Array<{
    type: string;
    raw: number;
    percentage: number;
  }>;
  confidence_score: number; // 0-100
}
```

**Response (Success):**
```typescript
{
  success: true;
  assessment_id: string;    // UUID of saved assessment
  message: string;          // "تم حفظ النتائج بنجاح"
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;            // Error message
  details?: string;         // Additional error details
}
```

#### GET `/api/assessments/riasec/user-results`

**Query Parameters:**
```typescript
{
  user_id: string;          // UUID of the user
  limit?: number;           // Optional: limit results (default: 10)
  offset?: number;          // Optional: for pagination (default: 0)
}
```

**Response (Success):**
```typescript
{
  success: true;
  assessments: Array<{
    id: string;
    holland_code: string;
    raw_scores: object;
    ranking: array;
    completed_date: string;
    confidence_score: number;
    primary_type: string;   // Extracted from ranking[0]
  }>;
  total: number;            // Total count of assessments
}
```

### 3. Frontend Components

#### Component: `SaveResultsButton`

**Location:** `app/components/assessments/SaveResultsButton.js`

**Props:**
```typescript
{
  algorithmResults: {
    holland_code: string;
    raw_scores: object;
    ranking: array;
  };
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
}
```

**State:**
```typescript
{
  isSaving: boolean;
  isSaved: boolean;
  error: string | null;
}
```

**Behavior:**
- Check if user is logged in (from localStorage or Supabase session)
- If not logged in, show "تسجيل الدخول لحفظ النتائج"
- If logged in, show "حفظ النتائج في حسابي"
- On click, call API to save results
- Show loading state while saving
- Show success message on save
- Update button to "✅ النتائج محفوظة" after save

#### Component: `AssessmentsList` (in Dashboard)

**Location:** `app/dashboard/components/AssessmentsList.js`

**Props:**
```typescript
{
  userId: string;
}
```

**State:**
```typescript
{
  assessments: array;
  loading: boolean;
  error: string | null;
}
```

**Behavior:**
- Fetch assessments on mount using `/api/assessments/riasec/user-results`
- Display loading state while fetching
- Display assessments in cards with:
  - Holland Code (large, prominent)
  - Primary Type icon and name
  - Completion date
  - Confidence score
  - "عرض التفاصيل" button
- On click "عرض التفاصيل", navigate to results page with assessment data
- If no assessments, show empty state with "ابدأ تقييم جديد" button

## Data Models

### Assessment Data Model

```typescript
interface RIASECAssessment {
  id: string;                    // UUID
  user_id: string;               // UUID
  assessment_type: 'RIASEC';
  holland_code: string;          // e.g., "RIS"
  raw_scores: {
    R: { raw: number; percentage: number };
    I: { raw: number; percentage: number };
    A: { raw: number; percentage: number };
    S: { raw: number; percentage: number };
    E: { raw: number; percentage: number };
    C: { raw: number; percentage: number };
  };
  ranking: Array<{
    type: string;                // 'R', 'I', 'A', 'S', 'E', 'C'
    raw: number;
    percentage: number;
  }>;
  completed_date: string;        // ISO 8601 timestamp
  confidence_score: number;      // 0-100
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

### User Stats Model

```typescript
interface UserStats {
  completed_assessments: number;
  average_score: number;         // Average of confidence_scores
  total_recommendations: number;
  active_days: number;
  join_date: string;
  last_activity_date: string;
}
```

## Error Handling

### Frontend Error Handling

1. **Network Errors:**
   - Show toast notification: "خطأ في الاتصال، يرجى المحاولة مرة أخرى"
   - Retry button available

2. **Authentication Errors:**
   - Redirect to login page
   - Show message: "يرجى تسجيل الدخول لحفظ النتائج"

3. **Validation Errors:**
   - Show specific error message
   - Highlight invalid fields

4. **Server Errors:**
   - Show generic error message
   - Log error details to console
   - Provide "تواصل مع الدعم" option

### Backend Error Handling

1. **Missing Required Fields:**
   - Return 400 Bad Request
   - Message: "البيانات المطلوبة غير مكتملة"

2. **Invalid User ID:**
   - Return 401 Unauthorized
   - Message: "معرف المستخدم غير صحيح"

3. **Database Errors:**
   - Return 500 Internal Server Error
   - Log error to server logs
   - Message: "حدث خطأ أثناء حفظ البيانات"

4. **RLS Policy Violations:**
   - Return 403 Forbidden
   - Message: "ليس لديك صلاحية لتنفيذ هذا الإجراء"

## Testing Strategy

### Unit Tests

1. **API Endpoints:**
   - Test save endpoint with valid data
   - Test save endpoint with invalid data
   - Test save endpoint without authentication
   - Test user-results endpoint with valid user_id
   - Test user-results endpoint with invalid user_id

2. **Components:**
   - Test SaveResultsButton renders correctly
   - Test SaveResultsButton handles click events
   - Test SaveResultsButton shows loading state
   - Test AssessmentsList fetches and displays data
   - Test AssessmentsList handles empty state

### Integration Tests

1. **End-to-End Flow:**
   - Complete RIASEC assessment
   - Click "Save Results"
   - Verify data saved in database
   - Navigate to Dashboard
   - Verify assessment appears in list
   - Click "View Details"
   - Verify correct results displayed

2. **Authentication Flow:**
   - Try to save results without login
   - Verify redirect to login page
   - Login successfully
   - Verify can now save results

### Manual Testing Checklist

- [ ] Complete RIASEC assessment and save results
- [ ] Verify results appear in Dashboard
- [ ] Verify results are sorted by date (newest first)
- [ ] Click on assessment to view full results
- [ ] Try to save results without login
- [ ] Verify error handling for network failures
- [ ] Verify RLS policies work correctly
- [ ] Test with multiple users to ensure data isolation

## Security Considerations

1. **Row Level Security (RLS):**
   - Users can only access their own assessments
   - Enforced at database level
   - Cannot be bypassed from frontend

2. **Authentication:**
   - All API endpoints require valid Supabase session
   - User ID extracted from session, not from request body
   - Prevents impersonation attacks

3. **Data Validation:**
   - Validate all input data on backend
   - Sanitize user inputs
   - Prevent SQL injection (using Supabase client)

4. **Rate Limiting:**
   - Consider implementing rate limiting on save endpoint
   - Prevent abuse and spam

## Performance Considerations

1. **Database Indexes:**
   - Index on `user_id` for fast user queries
   - Index on `completed_date` for sorting
   - Index on `assessment_type` for filtering

2. **Pagination:**
   - Implement pagination for assessments list
   - Default limit: 10 assessments per page
   - Load more on scroll or button click

3. **Caching:**
   - Cache user stats in localStorage
   - Invalidate cache on new assessment save
   - Reduce API calls to Supabase

4. **Lazy Loading:**
   - Load assessment details only when clicked
   - Don't load all data upfront in Dashboard

## Future Enhancements

1. **Assessment Comparison:**
   - Allow users to compare multiple assessments
   - Show progress over time
   - Visualize changes in Holland Code

2. **Export Results:**
   - Export assessment results as PDF
   - Share results via link
   - Print-friendly format

3. **Assessment History Chart:**
   - Line chart showing confidence scores over time
   - Radar chart comparing different assessments
   - Trend analysis

4. **Notifications:**
   - Email notification when assessment is saved
   - Reminder to retake assessment after 6 months
   - New career recommendations based on saved results

5. **Social Features:**
   - Share results with friends (with privacy controls)
   - Compare results with peers (anonymized)
   - Career path recommendations based on similar users
