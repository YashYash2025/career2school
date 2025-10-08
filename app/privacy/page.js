export default function Privacy() {
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        سياسة الخصوصية - Privacy Policy
      </h1>
      
      <div style={{ direction: 'rtl', textAlign: 'right' }}>
        <h2>🇸🇦 النسخة العربية</h2>
        <p><strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
        
        <h3>1. جمع البيانات</h3>
        <p>نحن نجمع البيانات التالية:</p>
        <ul>
          <li>الاسم والبريد الإلكتروني</li>
          <li>معلومات التعليم والمهنة</li>
          <li>نتائج التقييمات المهنية</li>
        </ul>
        
        <h3>2. استخدام البيانات</h3>
        <p>نستخدم بياناتك لـ:</p>
        <ul>
          <li>تقديم توصيات مهنية مخصصة</li>
          <li>تحسين خدماتنا</li>
          <li>التواصل معك حول التحديثات</li>
        </ul>
        
        <h3>3. حماية البيانات</h3>
        <p>نحن ملتزمون بحماية بياناتك الشخصية وعدم مشاركتها مع أطراف ثالثة بدون موافقتك.</p>
        
        <h3>4. حقوقك</h3>
        <p>يمكنك طلب حذف أو تعديل بياناتك في أي وقت عبر التواصل معنا.</p>
      </div>
      
      <hr style={{ margin: '40px 0' }} />
      
      <div style={{ direction: 'ltr', textAlign: 'left' }}>
        <h2>🇺🇸 English Version</h2>
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}</p>
        
        <h3>1. Data Collection</h3>
        <p>We collect the following data:</p>
        <ul>
          <li>Name and email address</li>
          <li>Education and career information</li>
          <li>Career assessment results</li>
        </ul>
        
        <h3>2. Data Usage</h3>
        <p>We use your data to:</p>
        <ul>
          <li>Provide personalized career recommendations</li>
          <li>Improve our services</li>
          <li>Communicate updates with you</li>
        </ul>
        
        <h3>3. Data Protection</h3>
        <p>We are committed to protecting your personal data and will not share it with third parties without your consent.</p>
        
        <h3>4. Your Rights</h3>
        <p>You can request deletion or modification of your data at any time by contacting us.</p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p><strong>للتواصل | Contact:</strong> support@school2career.com</p>
      </div>
    </div>
  )
}