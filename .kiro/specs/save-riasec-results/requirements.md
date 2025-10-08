# Requirements Document - حفظ نتائج RIASEC في Dashboard

## Introduction

هذا المستند يحدد متطلبات حفظ نتائج تقييم RIASEC في قاعدة البيانات وعرضها في لوحة التحكم (Dashboard) الخاصة بالمستخدم. الهدف هو السماح للمستخدمين بحفظ نتائج التقييمات وعرضها في أي وقت من خلال الـ dashboard.

## Requirements

### Requirement 1: حفظ نتائج RIASEC في قاعدة البيانات

**User Story:** كمستخدم، أريد أن تُحفظ نتائج تقييم RIASEC الخاص بي تلقائياً في قاعدة البيانات، حتى أتمكن من الرجوع إليها لاحقاً.

#### Acceptance Criteria

1. WHEN المستخدم يكمل تقييم RIASEC THEN النظام SHALL يحفظ النتائج في جدول `user_assessments` في Supabase
2. WHEN يتم حفظ النتائج THEN النظام SHALL يحفظ البيانات التالية:
   - `user_id` (معرف المستخدم)
   - `assessment_type` (نوع التقييم = 'RIASEC')
   - `holland_code` (الكود المهني مثل RIS)
   - `raw_scores` (الدرجات الخام لكل نوع R,I,A,S,E,C)
   - `percentages` (النسب المئوية لكل نوع)
   - `ranking` (ترتيب الأنواع)
   - `completed_date` (تاريخ إكمال التقييم)
   - `confidence_score` (درجة الثقة)
3. WHEN يحاول المستخدم حفظ النتائج AND لم يسجل دخول THEN النظام SHALL يطلب منه تسجيل الدخول أولاً
4. WHEN يتم حفظ النتائج بنجاح THEN النظام SHALL يعرض رسالة تأكيد للمستخدم
5. WHEN يفشل حفظ النتائج THEN النظام SHALL يعرض رسالة خطأ واضحة

### Requirement 2: عرض نتائج RIASEC في Dashboard

**User Story:** كمستخدم، أريد أن أرى جميع نتائج تقييمات RIASEC التي أكملتها في لوحة التحكم، حتى أتمكن من مراجعتها ومقارنتها.

#### Acceptance Criteria

1. WHEN المستخدم يفتح صفحة Dashboard THEN النظام SHALL يعرض قائمة بجميع تقييمات RIASEC المكتملة
2. WHEN يتم عرض التقييمات THEN كل تقييم SHALL يعرض:
   - Holland Code (الكود المهني)
   - تاريخ الإكمال
   - درجة الثقة
   - النمط الأساسي (Primary Type)
3. WHEN المستخدم ينقر على تقييم معين THEN النظام SHALL يفتح صفحة النتائج الكاملة لهذا التقييم
4. WHEN لا توجد تقييمات مكتملة THEN النظام SHALL يعرض رسالة تشجيعية مع زر "ابدأ تقييم جديد"
5. WHEN يتم تحميل التقييمات THEN النظام SHALL يرتبها من الأحدث إلى الأقدم

### Requirement 3: إنشاء جدول قاعدة البيانات

**User Story:** كمطور، أريد جدول قاعدة بيانات منظم لحفظ نتائج RIASEC، حتى يمكن استرجاعها بسهولة.

#### Acceptance Criteria

1. WHEN يتم إنشاء الجدول THEN النظام SHALL ينشئ جدول `user_assessments` بالحقول التالية:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `assessment_type` (TEXT, مثل 'RIASEC')
   - `holland_code` (TEXT, مثل 'RIS')
   - `raw_scores` (JSONB, يحتوي على {R: {raw, percentage}, I: {...}, ...})
   - `ranking` (JSONB, يحتوي على ترتيب الأنواع)
   - `completed_date` (TIMESTAMP WITH TIME ZONE)
   - `confidence_score` (INTEGER)
   - `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
   - `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
2. WHEN يتم إنشاء الجدول THEN النظام SHALL يضيف index على `user_id` لتسريع الاستعلامات
3. WHEN يتم إنشاء الجدول THEN النظام SHALL يضيف index على `completed_date` للترتيب
4. WHEN يتم إنشاء الجدول THEN النظام SHALL يضيف Row Level Security (RLS) policy للسماح للمستخدمين بقراءة بياناتهم فقط

### Requirement 4: API Endpoint لحفظ النتائج

**User Story:** كمطور، أريد API endpoint لحفظ نتائج RIASEC، حتى يمكن استدعاؤه من الـ frontend.

#### Acceptance Criteria

1. WHEN يتم إنشاء الـ API THEN النظام SHALL ينشئ endpoint في `/api/assessments/riasec/save`
2. WHEN يتم استدعاء الـ API THEN النظام SHALL يقبل POST request مع البيانات التالية:
   - `user_id`
   - `holland_code`
   - `raw_scores`
   - `ranking`
   - `confidence_score`
3. WHEN يتم استدعاء الـ API AND البيانات صحيحة THEN النظام SHALL يحفظ النتائج في قاعدة البيانات
4. WHEN يتم الحفظ بنجاح THEN النظام SHALL يرجع status 200 مع `{ success: true, assessment_id: "..." }`
5. WHEN تفشل عملية الحفظ THEN النظام SHALL يرجع status 500 مع رسالة خطأ واضحة

### Requirement 5: API Endpoint لجلب النتائج

**User Story:** كمطور، أريد API endpoint لجلب نتائج RIASEC الخاصة بمستخدم معين، حتى يمكن عرضها في الـ dashboard.

#### Acceptance Criteria

1. WHEN يتم إنشاء الـ API THEN النظام SHALL ينشئ endpoint في `/api/assessments/riasec/user-results`
2. WHEN يتم استدعاء الـ API THEN النظام SHALL يقبل GET request مع `user_id` كـ query parameter
3. WHEN يتم استدعاء الـ API THEN النظام SHALL يجلب جميع تقييمات RIASEC للمستخدم مرتبة من الأحدث للأقدم
4. WHEN يتم الجلب بنجاح THEN النظام SHALL يرجع status 200 مع `{ success: true, assessments: [...] }`
5. WHEN لا توجد تقييمات THEN النظام SHALL يرجع status 200 مع `{ success: true, assessments: [] }`

### Requirement 6: زر حفظ النتائج في صفحة النتائج

**User Story:** كمستخدم، أريد زر واضح لحفظ نتائج التقييم في صفحة النتائج، حتى أتمكن من حفظها بسهولة.

#### Acceptance Criteria

1. WHEN المستخدم يكمل التقييم THEN النظام SHALL يعرض زر "حفظ النتائج في حسابي" في صفحة النتائج
2. WHEN المستخدم ينقر على الزر AND مسجل دخول THEN النظام SHALL يحفظ النتائج تلقائياً
3. WHEN المستخدم ينقر على الزر AND غير مسجل دخول THEN النظام SHALL يوجهه لصفحة تسجيل الدخول
4. WHEN يتم الحفظ بنجاح THEN النظام SHALL يعرض رسالة "✅ تم حفظ النتائج بنجاح!"
5. WHEN النتائج محفوظة مسبقاً THEN النظام SHALL يعرض "✅ النتائج محفوظة" بدلاً من الزر

### Requirement 7: تحديث إحصائيات المستخدم

**User Story:** كمستخدم، أريد أن تتحدث إحصائياتي في الـ dashboard تلقائياً عند إكمال تقييم جديد، حتى أرى تقدمي.

#### Acceptance Criteria

1. WHEN يتم حفظ تقييم جديد THEN النظام SHALL يزيد عدد `completed_assessments` بمقدار 1
2. WHEN يتم حفظ تقييم جديد THEN النظام SHALL يحدث `average_score` بناءً على `confidence_score`
3. WHEN يتم حفظ تقييم جديد THEN النظام SHALL يحدث `total_recommendations` بناءً على عدد الوظائف المناسبة
4. WHEN يتم حفظ تقييم جديد THEN النظام SHALL يحدث `last_activity_date` إلى التاريخ الحالي
5. WHEN يتم تحديث الإحصائيات THEN النظام SHALL يعرض القيم المحدثة فوراً في الـ dashboard
