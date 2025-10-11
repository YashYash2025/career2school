# 🏷️ العلامات التجارية والسلوجانات

## 📋 نظرة عامة

كل أداة تقييم لها علامة تجارية خاصة وسلوجان بثلاث لغات.

---

## 🎯 العلامات التجارية:

### **1️⃣ RIASEC - بوصلة المهن™**

| اللغة | الاسم | السلوجان |
|-------|-------|----------|
| 🇸🇦 عربي | **بوصلة المهن™** | اكتشف مسارك المهني بدقة علمية |
| 🇬🇧 إنجليزي | **Career Compass™** | Discover Your Professional Path with Scientific Precision |
| 🇫🇷 فرنسي | **Boussole des Carrières™** | Découvrez Votre Parcours Professionnel avec Précision Scientifique |

**الوصف:**
```
4 تقييمات متطورة من بوصلة School2Career الذكية:
• للمدارس (60 سؤال - سريع)
• للجامعات والخريجين (60 سؤال - سريع)
• للمدارس (180 سؤال - شامل)
• للجامعات والخريجين (180 سؤال - شامل)
```

---

### **2️⃣ Big5 - مرآة الشخصية™**

| اللغة | الاسم | السلوجان |
|-------|-------|----------|
| 🇸🇦 عربي | **مرآة الشخصية™** | افهم نفسك لتختار مستقبلك |
| 🇬🇧 إنجليزي | **Personality Mirror™** | Understand Yourself to Choose Your Future |
| 🇫🇷 فرنسي | **Miroir de Personnalité™** | Comprenez-vous pour Choisir Votre Avenir |

**الوصف:**
```
3 تقييمات متطورة من مرآة School2Career:
• للمدارس الإعدادية (Middle School)
• للمدارس الثانوية (High School)
• للجامعات والخريجين (College/FreshGrad)
```

---

## 💾 قاعدة البيانات:

### **الجدول:**
```sql
CREATE TABLE assessment_tools_branding (
  id SERIAL PRIMARY KEY,
  tool_code VARCHAR(50) UNIQUE NOT NULL,
  brand_name_ar VARCHAR(200) NOT NULL,
  brand_name_en VARCHAR(200) NOT NULL,
  brand_name_fr VARCHAR(200) NOT NULL,
  slogan_ar TEXT NOT NULL,
  slogan_en TEXT NOT NULL,
  slogan_fr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **الملف:**
```
supabase-sql/create-assessment-tools-branding.sql
```

---

## 💻 الاستخدام:

### **جلب العلامة التجارية:**
```javascript
const { data: branding } = await supabase
  .from('assessment_tools_branding')
  .select('*')
  .eq('tool_code', 'BIG5')
  .single();

// استخدام
<h1>{branding.brand_name_ar}</h1>
<p>{branding.slogan_ar}</p>
```

### **في صفحة التقييم:**
```jsx
<div style={{ textAlign: 'center' }}>
  <div style={{ fontSize: '80px' }}>🧠</div>
  <h1>{branding?.brand_name_ar || 'مرآة الشخصية™'}</h1>
  <p>{branding?.slogan_ar || 'افهم نفسك لتختار مستقبلك'}</p>
</div>
```

---

## ✅ قواعد الاستخدام:

### **عند إضافة أداة جديدة:**

1. **أضف العلامة التجارية في قاعدة البيانات:**
```sql
INSERT INTO assessment_tools_branding (
  tool_code,
  brand_name_ar,
  brand_name_en,
  brand_name_fr,
  slogan_ar,
  slogan_en,
  slogan_fr
) VALUES (
  'NEW_TOOL',
  'الاسم بالعربي™',
  'Name in English™',
  'Nom en Français™',
  'السلوجان بالعربي',
  'Slogan in English',
  'Slogan en Français'
);
```

2. **استخدم العلامة في الصفحات:**
   - صفحة اختيار النسخة
   - صفحة الإنترو
   - صفحة النتائج

3. **حدّث صفحة التقييمات الرئيسية:**
```jsx
{
  icon: '🎯',
  title: 'الاسم التجاري™',
  subtitle: 'السلوجان',
  description: 'الوصف',
  path: '/assessments/new-tool',
  active: true,
  badge: 'متاح الآن'
}
```

---

## 🎨 التصميم:

### **في الكارتات:**
```jsx
<div style={{
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
  padding: '40px',
  borderRadius: '25px',
  textAlign: 'center'
}}>
  <span style={{ fontSize: '24px' }}>🎯</span>
  <h1 style={{
    fontSize: '36px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>
    {brandName}
  </h1>
  <p>{slogan}</p>
</div>
```

---

## 📝 ملاحظات:

- ✅ **استخدم ™** بعد الاسم التجاري
- ✅ **السلوجان قصير** (10-15 كلمة)
- ✅ **الوصف واضح** يشرح النسخ المتاحة
- ✅ **ثلاث لغات** دائماً

---

**آخر تحديث:** 10 أكتوبر 2025
