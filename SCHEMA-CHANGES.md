# 🔧 تغييرات Schema - الإصدار 2.0

## 📅 التاريخ: 2025

---

## 🎯 الهدف من التحديث

إصلاح المشاكل الهيكلية في قاعدة البيانات وتحسين الأداء والصيانة.

---

## ✅ التغييرات الرئيسية

### 1️⃣ **دمج جداول المستخدمين**

#### ❌ القديم:
```
auth.users → public.users → public.user_profiles
```
- تكرار في البيانات
- تعقيد في العلاقات
- صعوبة في الصيانة

#### ✅ الجديد:
```
auth.users → public.user_profiles
```
- بنية أبسط
- لا تكرار
- سهولة في الاستعلامات

#### التغييرات:
- ✅ حذف جدول `users`
- ✅ تحسين جدول `user_profiles`
- ✅ إضافة Trigger لحساب `full_name` تلقائياً
- ✅ توحيد قيم `user_type`

---

### 2️⃣ **توحيد جداول التقييمات**

#### ❌ القديم:
```
assessment_sessions + user_assessments (تداخل)
```

#### ✅ الجديد:
```
assessment_sessions (شامل)
```
- دمج كل المميزات في جدول واحد
- إضافة حقل `responses` لحفظ الإجابات
- دعم Powerups (hints, skips, etc.)

#### التغييرات:
- ✅ حذف جدول `user_assessments`
- ✅ حذف جدول `assessment_progress`
- ✅ تحسين `assessment_sessions`

---

### 3️⃣ **إضافة نظام Credits**

#### ✨ جديد:
```sql
CREATE TABLE user_credits (
  user_id UUID UNIQUE,
  total_earned INTEGER,
  total_spent INTEGER,
  current_balance INTEGER,
  ...
)
```

#### الفوائد:
- ✅ تتبع دقيق للرصيد
- ✅ سجل كامل للمعاملات
- ✅ سهولة في الاستعلامات

---

### 4️⃣ **تحديث القيود (Constraints)**

#### قيم `user_type` الجديدة:
```sql
CHECK (user_type IN (
  'student',      -- طالب مدرسة/جامعة
  'graduate',     -- خريج حديث
  'professional', -- خريج ذو خبرة
  'teacher',      -- معلم
  'parent',       -- ولي أمر
  'counselor',    -- مستشار
  'admin'         -- مدير
))
```

#### قيم `question_type` الجديدة:
```sql
CHECK (question_type IN (
  'likert_5',
  'likert_7',
  'yes_no',
  'multiple_choice',
  'ranking',
  'text'
))
```

---

### 5️⃣ **إضافة Foreign Keys المفقودة**

#### الجداول المحسّنة:
- ✅ `career_recommendations.user_id` → `auth.users(id)`
- ✅ `payment_transactions.user_id` → `auth.users(id)`
- ✅ `subscriptions.user_id` → `auth.users(id)`
- ✅ `user_achievements.user_id` → `auth.users(id)`
- ✅ جميع العلاقات تشير لـ `auth.users` بشكل موحد

---

### 6️⃣ **إزالة الحقول المحسوبة (Generated)**

#### ❌ القديم:
```sql
full_name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED
```
- مشاكل في INSERT/UPDATE
- صعوبة في التعامل

#### ✅ الجديد:
```sql
full_name VARCHAR(200)
```
- حقل عادي
- Trigger لحسابه تلقائياً
- سهولة في التحديث

---

### 7️⃣ **إضافة Triggers**

#### Triggers الجديدة:
1. **`trigger_update_full_name`**
   - يحدث `full_name` تلقائياً عند تغيير الاسم

2. **`trigger_user_profiles_updated_at`**
   - يحدث `updated_at` تلقائياً

3. **`trigger_user_credits_updated_at`**
   - يحدث `updated_at` في جدول Credits

4. **`trigger_assessment_sessions_updated_at`**
   - يحدث `updated_at` في الجلسات

5. **`trigger_assessment_results_updated_at`**
   - يحدث `updated_at` في النتائج

6. **`trigger_payment_transactions_updated_at`**
   - يحدث `updated_at` في المعاملات

---

### 8️⃣ **إضافة Indexes للأداء**

#### Indexes الجديدة:
```sql
-- user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_country ON user_profiles(country_code);
CREATE INDEX idx_user_profiles_education_level ON user_profiles(education_level_code);

-- assessment_sessions
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_package_id ON assessment_sessions(package_id);
CREATE INDEX idx_assessment_sessions_tool_id ON assessment_sessions(tool_id);
CREATE INDEX idx_assessment_sessions_completed ON assessment_sessions(is_completed);
CREATE INDEX idx_assessment_sessions_started_at ON assessment_sessions(started_at);

-- assessment_results
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX idx_assessment_results_created_at ON assessment_results(created_at);

-- وغيرها...
```

---

### 9️⃣ **إضافة Views**

#### View: `user_summary`
```sql
CREATE VIEW user_summary AS
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.full_name,
  up.user_type,
  uc.current_balance as credits_balance,
  COUNT(DISTINCT ases.id) as total_assessments,
  COUNT(DISTINCT ares.id) as completed_assessments,
  up.created_at
FROM user_profiles up
LEFT JOIN user_credits uc ON up.user_id = uc.user_id
LEFT JOIN assessment_sessions ases ON up.user_id = ases.user_id
LEFT JOIN assessment_results ares ON up.user_id = ares.user_id
GROUP BY ...
```

---

## 📊 مقارنة قبل وبعد

| الجانب | القديم | الجديد | التحسين |
|--------|--------|--------|---------|
| عدد الجداول | 24 | 19 | -5 جداول |
| التكرار | موجود | معدوم | ✅ |
| Foreign Keys | ناقصة | كاملة | ✅ |
| Indexes | قليلة | شاملة | ✅ |
| Triggers | لا يوجد | 6 triggers | ✅ |
| Views | لا يوجد | 1 view | ✅ |
| الأداء | متوسط | محسّن | ✅ |
| الصيانة | صعبة | سهلة | ✅ |

---

## 🚀 خطوات التنفيذ

### 1. التحضير
```bash
node check-database-data.js
node clear-database-tables.js
```

### 2. التنفيذ
1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. انسخ محتوى `rebuild-schema.sql`
4. نفذه

### 3. التحقق
```bash
node verify-schema.js
```

---

## ⚠️ ملاحظات مهمة

### البيانات المحفوظة:
- ✅ `countries` - 79 صف
- ✅ `governorates` - 55 صف
- ✅ `education_levels` - 4 صف
- ✅ `education_grades` - 12 صف

### البيانات المحذوفة:
- ❌ `user_profiles` - 1 مستخدم تجريبي
- ❌ `assessment_tools` - 1 أداة تجريبية
- ❌ باقي الجداول كانت فارغة

---

## 📝 التحديثات المطلوبة في الكود

### 1. تحديث API التسجيل
```javascript
// القديم
await supabase.from('users').insert(...)
await supabase.from('user_profiles').insert(...)

// الجديد
await supabase.from('user_profiles').insert(...)
```

### 2. تحديث الاستعلامات
```javascript
// القديم
const { data } = await supabase
  .from('users')
  .select('*, user_profiles(*)')

// الجديد
const { data } = await supabase
  .from('user_profiles')
  .select('*')
```

### 3. إضافة نظام Credits
```javascript
// إنشاء رصيد للمستخدم الجديد
await supabase.from('user_credits').insert({
  user_id: userId,
  total_earned: 0,
  total_spent: 0,
  current_balance: 0
})
```

---

## 🎯 الخطوات التالية

### المرحلة 1: ملء البيانات
1. ✅ ملء `assessment_tools` بالأدوات الـ14
2. ✅ ملء `assessment_packages` بالحزم الـ6
3. ✅ ملء `assessment_questions` بالأسئلة (1200+)
4. ✅ ملء `pricing_packages` بباقات الأسعار
5. ✅ ملء `achievements` بالإنجازات

### المرحلة 2: تحديث الكود
1. ✅ تحديث API التسجيل
2. ✅ تحديث API التقييمات
3. ✅ إضافة نظام Credits
4. ✅ تحديث Dashboard

### المرحلة 3: الاختبار
1. ✅ اختبار التسجيل
2. ✅ اختبار التقييمات
3. ✅ اختبار نظام Credits
4. ✅ اختبار الأداء

---

## 📞 الدعم

في حالة وجود مشاكل:
1. راجع ملف `rebuild-schema.sql`
2. تحقق من Supabase Logs
3. شغّل `verify-schema.js`
4. راجع التوثيق

---

**آخر تحديث:** 2025  
**الإصدار:** 2.0  
**الحالة:** ✅ جاهز للتنفيذ
