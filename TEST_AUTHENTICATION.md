# 🧪 دليل اختبار Authentication

## الخطوات للاختبار:

### 1️⃣ اختبار المستخدم المسجل دخول

```bash
# 1. شغل السيرفر
npm run dev

# 2. افتح المتصفح على
http://localhost:3000
```

**الخطوات:**
1. اذهب لـ `/login`
2. سجل دخول بحساب موجود
3. اذهب لـ `/assessments`
4. اضغط على "Big5 Assessment"
5. اختر أي نسخة (Middle/High/College)

**النتيجة المتوقعة:**
- ✅ يجب أن يبدأ التقييم مباشرة
- ✅ لا يطلب منك تسجيل دخول مرة أخرى
- ✅ في Console يظهر: `✅ User authenticated: [email]`

---

### 2️⃣ اختبار المستخدم غير المسجل

**الخطوات:**
1. افتح نافذة Incognito/Private
2. اذهب مباشرة لـ `/assessments/big-five/enhanced?version=college`

**النتيجة المتوقعة:**
- ✅ يتم توجيهك لـ `/login?redirect=/assessments/big-five/enhanced?version=college`
- ✅ بعد تسجيل الدخول، ترجع لصفحة التقييم تلقائياً

---

### 3️⃣ اختبار Session منتهية

**الخطوات:**
1. سجل دخول
2. افتح Developer Tools (F12)
3. اذهب لـ Application → Local Storage
4. امسح `sb-[project-id]-auth-token`
5. حاول بدء تقييم Big5

**النتيجة المتوقعة:**
- ✅ يطلب منك تسجيل الدخول
- ✅ في Console يظهر: `⚠️ No active session - redirecting to login`

---

### 4️⃣ اختبار Navigation Bar

**الخطوات:**
1. افتح الصفحة الرئيسية
2. لاحظ Navigation Bar في الأعلى

**قبل تسجيل الدخول:**
- ✅ يظهر زر "تسجيل الدخول"
- ✅ لا يظهر "لوحة التحكم"

**بعد تسجيل الدخول:**
- ✅ يظهر اسم المستخدم
- ✅ يظهر "لوحة التحكم" في القائمة
- ✅ عند الضغط على الاسم، تظهر قائمة منسدلة
- ✅ في القائمة: "📊 لوحة التحكم" و "🚪 تسجيل الخروج"

---

### 5️⃣ اختبار Logout

**الخطوات:**
1. سجل دخول
2. اضغط على اسمك في Navigation
3. اختر "تسجيل الخروج"

**النتيجة المتوقعة:**
- ✅ يتم توجيهك لـ `/login`
- ✅ في Console يظهر: `✅ Signed out from Supabase`
- ✅ localStorage تم مسحها
- ✅ Navigation يظهر "تسجيل الدخول" بدل الاسم

---

## 🔍 Console Messages المتوقعة:

### عند تحميل الصفحة (مسجل دخول):
```
🔐 Session check: { hasSession: true, user: "user@example.com" }
✅ User authenticated: user@example.com
✅ User authenticated via Supabase: user@example.com
🔍 جلب أسئلة Big5 لـ: BIG5_60_COLLEGE
✅ تم جلب 60 سؤال
```

### عند تحميل الصفحة (غير مسجل):
```
🔐 Session check: { hasSession: false }
⚠️ No active session - redirecting to login
🔗 Redirect URL detected: /assessments/big-five/enhanced?version=college
```

### عند حفظ النتائج:
```
🔐 Session status: Authenticated
💾 حفظ نتائج Big5...
✅ User authenticated: [user-id]
📝 Data to insert: { user_id: "...", tool_id: "...", ... }
✅ تم حفظ النتائج بنجاح، ID: [result-id]
💾 Save response status: 200
✅ Results saved successfully with ID: [result-id]
```

---

## ❌ مشاكل محتملة وحلولها:

### المشكلة: "يجب تسجيل الدخول أولاً" رغم أنك مسجل
**الحل:**
1. افتح Developer Tools → Console
2. شوف الـ error message
3. تأكد من وجود `sb-[project-id]-auth-token` في Local Storage
4. جرب Logout ثم Login مرة أخرى

### المشكلة: Redirect لا يعمل بعد Login
**الحل:**
1. تأكد من وجود `?redirect=` في URL
2. شوف Console للـ redirect URL
3. تأكد من `redirectUrl` state في Login page

### المشكلة: Navigation لا يظهر المستخدم
**الحل:**
1. افتح Console وشوف `✅ User authenticated via Supabase`
2. تأكد من وجود `userData` في Local Storage
3. جرب Refresh الصفحة

---

## 📊 Checklist النهائي:

- [ ] المستخدم المسجل يمكنه بدء التقييم مباشرة
- [ ] المستخدم غير المسجل يتم توجيهه للـ Login
- [ ] Redirect يعمل بعد Login
- [ ] Navigation يظهر بيانات المستخدم
- [ ] Logout يعمل بشكل صحيح
- [ ] Session منتهية يتم اكتشافها
- [ ] النتائج تُحفظ بنجاح
- [ ] Console messages واضحة ومفيدة

---

**ملاحظة:** إذا واجهت أي مشكلة، شوف Console في Developer Tools للتفاصيل.
