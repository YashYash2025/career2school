# 🎨 نظام التصميم الموحد - School2Career

## 📋 نظرة عامة

هذا المستند يوثق نظام التصميم الموحد المستخدم في كل صفحات المنصة.

---

## 🎨 الألوان:

### **الألوان الأساسية:**
```css
--primary: #667eea
--secondary: #764ba2
--accent: #f093fb
--dark: #0f0f1e
--card-bg: rgba(255, 255, 255, 0.05)
```

### **ألوان النص:**
```css
--text-primary: #ffffff
--text-secondary: #a8a8b8
```

### **Gradients:**
```css
--primary-gradient: linear-gradient(135deg, #667eea, #764ba2)
--success-gradient: linear-gradient(135deg, #10b981, #059669)
--warning-gradient: linear-gradient(135deg, #f59e0b, #d97706)
```

---

## 📐 التباعد (Spacing):

```css
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 20px
--spacing-lg: 30px
--spacing-xl: 40px
--spacing-2xl: 60px
```

---

## 🔤 الخطوط (Typography):

### **العائلة:**
```css
font-family: 'Cairo', Arial, sans-serif
```

### **الأحجام:**
```css
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 32px
--text-4xl: 48px
```

---

## 🎯 المكونات الأساسية:

### **1. الأزرار (Buttons):**

#### **Primary Button:**
```jsx
<button style={{
  padding: '15px 30px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  border: 'none',
  borderRadius: '15px',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'Cairo, Arial, sans-serif'
}}>
  ابدأ التقييم
</button>
```

#### **Secondary Button:**
```jsx
<button style={{
  padding: '15px 30px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '15px',
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'Cairo, Arial, sans-serif'
}}>
  العودة
</button>
```

---

### **2. الكروت (Cards):**

#### **Standard Card:**
```jsx
<div style={{
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: '25px',
  padding: '35px',
  border: '2px solid rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease'
}}>
  {/* محتوى الكارت */}
</div>
```

---

### **3. Navigation Bar:**

```jsx
<nav style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '60px',
  background: 'rgba(15, 15, 30, 0.98)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
  zIndex: 1000
}}>
  {/* محتوى Navigation */}
</nav>
```

**ملاحظة:** استخدم `<UnifiedNavigation />` في كل الصفحات.

---

## 🎭 التأثيرات (Effects):

### **Hover Effect:**
```jsx
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-10px)';
  e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}
```

### **Blur Background:**
```jsx
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
  zIndex: -1
}}></div>
```

---

## 📱 Responsive Design:

### **Breakpoints:**
```css
--mobile: 320px
--tablet: 768px
--desktop: 1024px
--wide: 1440px
```

### **Grid System:**
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '30px'
}}>
  {/* محتوى */}
</div>
```

---

## ✅ قواعد الاستخدام:

1. ✅ **استخدم الألوان المحددة** فقط
2. ✅ **استخدم Cairo** كخط أساسي
3. ✅ **استخدم UnifiedNavigation** في كل الصفحات
4. ✅ **padding-top: 100px** للمحتوى الرئيسي
5. ✅ **direction: 'rtl'** للنصوص العربية

---

**آخر تحديث:** 10 أكتوبر 2025
