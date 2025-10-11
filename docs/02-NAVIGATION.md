# 🧭 Navigation Bar الموحد

## 📋 نظرة عامة

Navigation Bar موحد على كل صفحات المنصة مع دعم اللغات المتعددة ومعلومات المستخدم.

---

## 🎯 المواصفات:

### **الأبعاد:**
- **الارتفاع:** 60px
- **الموضع:** Fixed في أعلى الصفحة
- **Z-index:** 1000

### **التصميم:**
```jsx
{
  position: 'fixed',
  top: 0,
  height: '60px',
  background: 'rgba(15, 15, 30, 0.98)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
  zIndex: 1000
}
```

---

## 📦 المكونات:

### **1. الجانب الأيسر:**
- **Logo** (في الصفحات الرئيسية)
- **زر رجوع** (في صفحات التقييمات)

### **2. المنتصف:**
- الرئيسية
- التقييمات
- المهن
- لوحة التحكم (للمستخدمين المسجلين فقط)

### **3. الجانب الأيمن:**
- **اختيار اللغة** (🇸🇦 🇬🇧 🇫🇷)
- **معلومات المستخدم** (الاسم + القائمة المنسدلة)

---

## 💻 الاستخدام:

### **في الصفحات العادية:**
```jsx
import UnifiedNavigation from '@/app/components/UnifiedNavigation';

export default function MyPage() {
  return (
    <>
      <UnifiedNavigation />
      <main style={{ paddingTop: '100px' }}>
        {/* المحتوى */}
      </main>
    </>
  );
}
```

### **في صفحات التقييمات (مع زر رجوع):**
```jsx
import UnifiedNavigation from '@/app/components/UnifiedNavigation';

export default function AssessmentPage() {
  return (
    <>
      <UnifiedNavigation 
        showBackButton={true} 
        backUrl="/assessments" 
      />
      <main style={{ paddingTop: '100px' }}>
        {/* المحتوى */}
      </main>
    </>
  );
}
```

---

## 🌍 اللغات المدعومة:

```javascript
const languages = {
  ar: { name: 'العربية', flag: '🇸🇦' },
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' }
};
```

**التخزين:** يتم حفظ اللغة المختارة في `localStorage`

---

## 👤 قائمة المستخدم:

### **للمستخدمين المسجلين:**
- عرض الاسم أو البريد الإلكتروني
- قائمة منسدلة تحتوي على:
  - 📊 لوحة التحكم
  - 🚪 تسجيل الخروج

### **للزوار:**
- زر "تسجيل الدخول"

---

## ✅ قواعد الاستخدام:

1. ✅ **استخدم UnifiedNavigation** في كل صفحة جديدة
2. ✅ **padding-top: 100px** للمحتوى الرئيسي
3. ✅ **showBackButton={true}** في صفحات التقييمات فقط
4. ✅ **backUrl** يحدد وجهة زر الرجوع

---

## 📁 الملف:

```
app/components/UnifiedNavigation.js
```

---

## 🎨 التخصيص:

### **تغيير الارتفاع:**
إذا احتجت تغيير الارتفاع، تأكد من تحديث:
1. `height` في Navigation
2. `paddingTop` في كل الصفحات

### **إضافة رابط جديد:**
أضف في قسم المنتصف:
```jsx
<Link href="/new-page" style={{
  color: pathname === '/new-page' ? '#667eea' : '#a8a8b8',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  fontFamily: 'Cairo, Arial, sans-serif'
}}>
  الصفحة الجديدة
</Link>
```

---

**آخر تحديث:** 10 أكتوبر 2025
