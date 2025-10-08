# 🎓 School2Career - توثيق المشروع الشامل



## 🔧 التقنيات المستخدمة

### Frontend
- **Next.js 15.5.2** - إطار عمل React مع App Router
- **React 18** - مكتبة واجهات المستخدم
- **CSS Modules** - تنسيق الصفحات
- **RTL Support** - دعم النصوص من اليمين لليسار

### Backend
- **Next.js API Routes** - واجهات برمجة التطبيقات
- **Supabase** - قاعدة البيانات والمصادقة
- **PostgreSQL** - قاعدة البيانات الرئيسية

### قاعدة البيانات
- **Supabase PostgreSQL** - قاعدة البيانات المستضافة
- **Auth System** - نظام مصادقة مدمج
- **Real-time** - تحديثات فورية

---


## 🛠️ إعداد المشروع

### متطلبات النظام
- Node.js 18+ أو أحدث
- npm أو yarn
- حساب Supabase

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone [repository-url]
cd school2career-15-9-2025
```

2. **تثبيت الحزم**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
أنشئ ملف `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **إعداد قاعدة البيانات**
```bash
# تشغيل سكريبتات إنشاء الجداول
node setup-database.js
```

5. **تشغيل المشروع**
```bash
npm run dev
```

المشروع سيكون متاح على: `http://localhost:3000`

---

## 🗄️ قاعدة البيانات

### الجداول الرئيسية

#### 1. user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(10),
  country_code VARCHAR(3),
  governorate_code VARCHAR(10),
  city VARCHAR(100),
  education_level_code VARCHAR(20),
  current_grade_code VARCHAR(10),
  school_name VARCHAR(200),
  specialization VARCHAR(200),
  preferred_language VARCHAR(5) DEFAULT 'ar',
  user_type VARCHAR(20) DEFAULT 'student',
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. countries (البلدان)
```sql
CREATE TABLE countries (
  code VARCHAR(3) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL
);
```

#### 3. governorates (المحافظات)
```sql
CREATE TABLE governorates (
  code VARCHAR(10) PRIMARY KEY,
  country_code VARCHAR(3) REFERENCES countries(code),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL
);
```

#### 4. education_levels (المراحل التعليمية)
```sql
CREATE TABLE education_levels (
  code VARCHAR(20) PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  sort_order INTEGER
);
```

#### 5. education_grades (الصفوف الدراسية)
```sql
CREATE TABLE education_grades (
  code VARCHAR(10) PRIMARY KEY,
  education_level_code VARCHAR(20) REFERENCES education_levels(code),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  sort_order INTEGER
);
```

### البيانات المرجعية المدعومة

#### البلدان المدعومة
- **مصر** (EG) - 27 محافظة
- **السعودية** (SA) - 13 منطقة
- **الإمارات** (AE) - 7 إمارات
- **70+ بلد إضافي** مع البيانات الأساسية


## 🔐 نظام المصادقة والتسجيل

### مراحل التسجيل

1. **إدخال البيانات الشخصية**
   - الاسم الأول والأخير
   - البريد الإلكتروني
   - كلمة المرور
   - رقم الهاتف
   - تاريخ الميلاد
   - الجنس

2. **البيانات الجغرافية**
   - البلد
   - المحافظة/الولاية
   - المدينة

3. **البيانات التعليمية**
   - المرحلة التعليمية
   - الصف/السنة الحالية
   - اسم المدرسة/الجامعة
   - التخصص

4. **إعدادات الحساب**
   - اللغة المفضلة
   - نوع المستخدم (طالب/خريج/معلم/ولي أمر)

### آلية تحديد نوع المستخدم

```javascript
const determineUserType = (educationLevel, currentGrade) => {
  if (educationLevel === 'graduate') {
    if (currentGrade === 'exp' || currentGrade === 'experienced') {
      return 'professional' // خريج ذو خبرة
    }
    return 'graduate' // خريج حديث
  } else if (educationLevel === 'university') {
    return 'student' // طالب جامعي
  } else {
    return 'student' // طالب مدرسة
  }
}
```

---

## 📊 نظام التقييمات

### 1. تقييم RIASEC (Holland Career Interest)

**الأنواع الستة:**
- **R (Realistic)** - الواقعي
- **I (Investigative)** - الاستقصائي
- **A (Artistic)** - الفني
- **S (Social)** - الاجتماعي
- **E (Enterprising)** - المغامر
- **C (Conventional)** - التقليدي

**ملفات التقييم:**
- `app/assessments/riasec/page.js` - النسخة الأساسية
- `app/assessments/riasec/enhanced/page.js` - النسخة المحسنة
- `app/lib/algorithms/RIASECInternational.js` - خوارزمية التقييم


## 🌐 نظام الترجمة المتعدد

### اللغات المدعومة
- **العربية** (ar) - اللغة الافتراضية
- **الإنجليزية** (en)
- **الفرنسية** (fr)

### ملفات الترجمة
```
public/locales/
├── ar/common.json
├── en/common.json
└── fr/common.json
```

### استخدام نظام الترجمة
```javascript
import { useTranslation } from '../lib/translation'

function Component() {
  const { t, currentLanguage, changeLanguage, direction } = useTranslation()
  
  return (
    <div dir={direction}>
      <h1>{t('nav.home')}</h1>
    </div>
  )
}
```

### خصائص RTL/LTR
- دعم تلقائي للنصوص من اليمين لليسار للعربية
- تخطيط مرن يتكيف مع اتجاه النص
- تبديل سلس بين اللغات

---

## 🎨 نظام التصميم

### الألوان الرئيسية
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-neon: #00f5ff;
  --accent-purple: #9333ea;
  --accent-pink: #ec4899;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --dark-bg: #0a0a0a;
  --card-bg: rgba(255, 255, 255, 0.05);
}
```

### مكونات UI المخصصة
- `SCButton` - أزرار متدرجة الألوان
- `SCCard` - بطاقات زجاجية
- `SCHeader` - رأس الصفحة المتجاوب
- `AnimatedBackground` - خلفيات متحركة

### خصائص التصميم
- **Dark Theme** - السمة المظلمة الافتراضية
- **Glass Morphism** - تأثيرات زجاجية
- **Gradient Animations** - تدرجات متحركة
- **Responsive Design** - تصميم متجاوب

---

## 🚀 الواجهات البرمجية (APIs)

### 1. API التسجيل
**المسار:** `/api/auth/register`
**الطريقة:** POST

**البيانات المطلوبة:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "محمد",
  "last_name": "يشار",
  "phone": "+201234567890",
  "birth_date": "1990-01-15",
  "gender": "male",
  "country_code": "EG",
  "governorate_code": "CAI",
  "city": "القاهرة",
  "education_level_code": "graduate",
  "current_grade_code": "exp",
  "school_name": "جامعة القاهرة",
  "specialization": "هندسة حاسوب",
  "preferred_language": "ar"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "full_name": "محمد يشار",
      "user_type": "student",
      "education_level_code": "graduate",
      "bio": "خريج ذو خبرة (أكثر من سنتين)"
    }
  }
}
```

### 2. API البيانات المرجعية
**المسار:** `/api/reference`
**الطريقة:** GET

**المعاملات:**
- `type` - نوع البيانات (countries, governorates, education_levels, education_grades)
- `country` - رمز البلد (للمحافظات)
- `education_level` - رمز المرحلة التعليمية (للصفوف)

### 3. API تقييم RIASEC
**المسار:** `/api/assessments/riasec/calculate`
**الطريقة:** POST

**البيانات:**
```json
{
  "answers": {
    "q1": 5,
    "q2": 3,
    // ... باقي الإجابات
  },
  "session_id": "unique_session_id"
}
```

---

## 📱 الصفحات الرئيسية

### 1. الصفحة الرئيسية (`/`)
- عرض مميزات المنصة
- أزرار التسجيل والدخول
- معاينة التقييمات المتاحة

### 2. صفحة التسجيل (`/signup`)
- نموذج تسجيل متعدد المراحل
- التحقق من صحة البيانات
- تكامل مع قاعدة البيانات

### 3. صفحة تسجيل الدخول (`/login`)
- نموذج بسيط لتسجيل الدخول
- دعم أولي للمصادقة

### 4. لوحة التحكم (`/dashboard`)
- عرض بيانات المستخدم
- ملخص التقييمات المكتملة
- التوصيات المهنية
- روابط سريعة للتقييمات

### 5. صفحات التقييمات (`/assessments`)
- تقييم RIASEC
- تقييم Big Five
- عرض النتائج
- حفظ التقدم

---

## 🔧 سكريبتات المساعدة

### سكريبتات قاعدة البيانات
- `setup-database.js` - إعداد قاعدة البيانات
- `create-and-seed-tables.js` - إنشاء الجداول وإدراج البيانات
- `database-seed-data.sql` - بيانات أولية
- `check-current-database.js` - فحص حالة قاعدة البيانات

### سكريبتات الاختبار
- `test-registration-graduate.js` - اختبار تسجيل الخريجين
- `test-final-flow.js` - اختبار التدفق الكامل
- `test-apis.js` - اختبار الواجهات البرمجية

### سكريبتات التنظيف
- `delete-all-users.js` - حذف جميع المستخدمين
- `cleanup-and-setup.js` - تنظيف وإعادة تهيئة

---

## 🐛 استكشاف الأخطاء وإصلاحها

### مشاكل شائعة وحلولها

#### 1. خطأ الاتصال بقاعدة البيانات
```
Error: Could not connect to database
```
**الحل:**
- تحقق من متغيرات البيئة في `.env.local`
- تأكد من صحة مفاتيح Supabase
- تحقق من حالة خدمة Supabase

#### 2. خطأ في إنشاء الجداول
```
Error: relation "user_profiles" does not exist
```
**الحل:**
```bash
node setup-database.js
```

#### 3. خطأ في القيود (Constraints)
```
Error: violates check constraint "user_profiles_user_type_check"
```
**الحل:**
- تحديث قيود الجدول لتشمل القيم الجديدة
- تشغيل `update-user-type-constraint.js`

#### 4. خطأ في تحميل البيانات المرجعية
```
Error: Countries data not loaded
```
**الحل:**
- تشغيل `create-and-seed-tables.js`
- التحقق من وجود البيانات في جداول البيانات المرجعية

### أدوات التشخيص

#### فحص حالة قاعدة البيانات
```bash
node check-current-database.js
```

#### فحص الجداول
```bash
node check-table-structure.js
```

#### اختبار الواجهات البرمجية
```bash
node test-apis.js
```

---

## 🚀 النشر والإنتاج

### متطلبات النشر
- خدمة استضافة Node.js (Vercel، Netlify، Heroku)
- قاعدة بيانات Supabase
- نطاق مخصص (اختياري)

### خطوات النشر على Vercel

1. **ربط المشروع بـ Vercel**
```bash
vercel init
```

2. **إعداد متغيرات البيئة في Vercel**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

3. **النشر**
```bash
vercel --prod
```

### إعدادات الإنتاج

#### تحسين الأداء
- ضغط الصور
- تحسين CSS
- تجميع JavaScript
- إعداد CDN

#### الأمان
- تشفير الاتصالات (HTTPS)
- حماية متغيرات البيئة
- تحديد صلاحيات قاعدة البيانات
- تفعيل CORS

---

## 📈 مراقبة الأداء

### مؤشرات الأداء المدمجة
- أوقات تحميل الصفحات
- تفاعلات المستخدمين
- معدلات إكمال التقييمات
- أخطاء النظام

### أدوات المراقبة
- `usePerformanceMonitor` - هوك لمراقبة الأداء
- Context API للحالة العامة
- localStorage لحفظ البيانات المحلية

---

## 🔮 التطوير المستقبلي

### ميزات مخططة
- [ ] تقييمات إضافية (Multiple Intelligences، EQ)
- [ ] نظام التوصيات المحسن بالذكاء الاصطناعي
- [ ] تقارير مفصلة للمستخدمين
- [ ] نظام النقاط والإنجازات
- [ ] منصة للمستشارين المهنيين
- [ ] تطبيق الجوال (React Native)
- [ ] تكامل مع منصات التوظيف

### تحسينات تقنية
- [ ] تحسين خوارزميات التقييم
- [ ] إضافة المزيد من اللغات
- [ ] تحسين نظام التخزين المؤقت
- [ ] إضافة نظام الإشعارات
- [ ] تحسين تجربة المستخدم على الجوال

---

## 👥 الفريق والمساهمة

### الفريق الأساسي
- **د. محمد يشار** - المؤسس والمطور الرئيسي
- **فريق التطوير** - مطورون إضافيون

### كيفية المساهمة

1. **Fork المشروع**
2. **إنشاء فرع جديد**
```bash
git checkout -b feature/new-feature
```
3. **تطبيق التغييرات**
4. **Commit التغييرات**
```bash
git commit -m "Add new feature"
```
5. **Push للفرع**
```bash
git push origin feature/new-feature
```
6. **إنشاء Pull Request**

### معايير البرمجة
- استخدام ESLint للتحقق من الكود
- كتابة تعليقات باللغة العربية
- اتباع نمط التسمية المعتمد
- كتابة اختبارات للميزات الجديدة

---

## 📚 مراجع ومصادر

### المراجع العلمية
- **نظرية هولاند للميول المهنية** - RIASEC Model
- **نموذج العوامل الخمسة الكبرى للشخصية** - Big Five Model
- **نظرية الذكاءات المتعددة** - Howard Gardner

### مصادر تقنية
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)

### أدوات التطوير
- [VS Code](https://code.visualstudio.com/) - محرر الكود المفضل
- [Postman](https://www.postman.com/) - اختبار APIs
- [Figma](https://www.figma.com/) - تصميم الواجهات

---

## 🔒 الأمان والخصوصية

### حماية البيانات
- تشفير كلمات المرور باستخدام bcrypt
- حماية متغيرات البيئة
- تطبيق مبادئ GDPR
- نظام صلاحيات متدرج

### سياسة الخصوصية
- عدم مشاركة البيانات الشخصية مع أطراف ثالثة
- حق المستخدم في حذف بياناته
- شفافية في جمع واستخدام البيانات
- إمكانية تصدير البيانات الشخصية

### الامتثال القانوني
- امتثال لقوانين حماية البيانات
- شروط استخدام واضحة
- سياسة خصوصية مفصلة
- إقرارات موافقة المستخدمين

---

## 📊 تحليلات الاستخدام

### المؤشرات المتتبعة
- عدد المستخدمين النشطين
- معدل إتمام التقييمات
- أكثر التقييمات استخداماً
- توزيع المستخدمين جغرافياً
- معدل العائدين للمنصة

### أدوات التحليل
- Google Analytics (مخطط)
- تحليلات Supabase المدمجة
- نظام تتبع مخصص في الكود

---

## 🆘 الدعم الفني

### قنوات التواصل
- **البريد الإلكتروني:** support@school2career.com
- **الهاتف:** +20 XXX XXX XXXX
- **الدردشة المباشرة:** متاحة في المنصة

### ساعات الدعم
- **الأحد - الخميس:** 9:00 ص - 6:00 م (توقيت القاهرة)
- **الجمعة - السبت:** 10:00 ص - 4:00 م

### الأسئلة الشائعة

#### س: كيف يمكنني إعادة تعيين كلمة المرور؟
ج: اذهب إلى صفحة تسجيل الدخول واضغط على "نسيت كلمة المرور"

#### س: هل يمكنني تغيير لغة المنصة؟
ج: نعم، يمكنك تغيير اللغة من القائمة العلوية في أي صفحة

#### س: كم من الوقت يستغرق إكمال التقييم؟
ج: تقييم RIASEC: 15-20 دقيقة، تقييم Big Five: 10-15 دقيقة

#### س: هل بياناتي الشخصية آمنة؟
ج: نعم، نحن نلتزم بأعلى معايير الأمان وحماية البيانات

---

## 📝 سجل التغييرات

### الإصدار 1.0.0 (ديسمبر 2024)
- إطلاق النسخة الأولى من المنصة
- نظام تسجيل متكامل
- تقييم RIASEC الأساسي
- دعم اللغة العربية

### الإصدار 1.1.0 (يناير 2025)
- إضافة تقييم Big Five
- تحسين واجهة المستخدم
- إضافة المزيد من البلدان
- تحسين نظام الترجمة

### الإصدار 1.2.0 (فبراير 2025)
- تحسين خوارزميات التقييم
- إضافة لوحة التحكم
- نظام التوصيات المهنية
- تحسينات في الأداء

### الإصدار الحالي 1.3.0 (سبتمبر 2025)
- إصلاح شامل لنظام قاعدة البيانات
- تحسين تجربة التسجيل
- إضافة دعم الخريجين ذوي الخبرة
- تحسين عرض البيانات في لوحة التحكم
- إصلاح مشاكل عرض الأسماء
- تحسين نظام تحديد نوع المستخدم

---

## 🎯 خاتمة

**School2Career** هي منصة طموحة تهدف إلى مساعدة الشباب العربي في اتخاذ قرارات مهنية مدروسة ومناسبة لقدراتهم وميولهم. المنصة مبنية بأحدث التقنيات وتتبع أفضل الممارسات في التطوير والأمان.

### نقاط القوة
- ✅ **تقييمات علمية دقيقة** مبنية على نظريات معتمدة
- ✅ **دعم متعدد اللغات** مع تركيز على اللغة العربية
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **قاعدة بيانات شاملة** تغطي معظم البلدان العربية
- ✅ **نظام أمان متقدم** لحماية بيانات المستخدمين
- ✅ **كود مفتوح المصدر** قابل للتطوير والتحسين

### الرؤية المستقبلية
نسعى لجعل **School2Career** المرجع الأول للإرشاد المهني في المنطقة العربية، مع التوسع لتشمل المزيد من التقييمات والخدمات المهنية.

---

**آخر تحديث:** سبتمبر 2025  
**الإصدار:** 1.3.0  
**المطور:** د. محمد يشار  
**الترخيص:** MIT License

> **ملاحظة:** هذا التوثيق يتم تحديثه بانتظام. للحصول على آخر المعلومات، يرجى مراجعة المستودع الرسمي للمشروع.