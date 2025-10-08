export default function Terms() {
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        شروط الخدمة - Terms of Service
      </h1>
      
      <div style={{ direction: 'rtl', textAlign: 'right' }}>
        <h2>🇸🇦 النسخة العربية</h2>
        <p><strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
        
        <h3>1. الموافقة على الشروط</h3>
        <p>باستخدام منصة School2Career، فإنك توافق على الالتزام بهذه الشروط.</p>
        
        <h3>2. الخدمات المقدمة</h3>
        <p>نحن نقدم:</p>
        <ul>
          <li>تقييمات مهنية وشخصية</li>
          <li>توصيات مهنية مخصصة</li>
          <li>معلومات حول فرص التعليم والعمل</li>
        </ul>
        
        <h3>3. مسؤوليات المستخدم</h3>
        <p>يتعهد المستخدم بـ:</p>
        <ul>
          <li>تقديم معلومات صحيحة ودقيقة</li>
          <li>عدم استخدام المنصة لأغراض غير قانونية</li>
          <li>احترام حقوق المستخدمين الآخرين</li>
        </ul>
        
        <h3>4. إخلاء المسؤولية</h3>
        <p>التوصيات المقدمة هي لأغراض إرشادية فقط ولا تضمن نتائج معينة.</p>
        
        <h3>5. تعديل الشروط</h3>
        <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت.</p>
      </div>
      
      <hr style={{ margin: '40px 0' }} />
      
      <div style={{ direction: 'ltr', textAlign: 'left' }}>
        <h2>🇺🇸 English Version</h2>
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}</p>
        
        <h3>1. Agreement to Terms</h3>
        <p>By using the School2Career platform, you agree to be bound by these terms.</p>
        
        <h3>2. Services Provided</h3>
        <p>We provide:</p>
        <ul>
          <li>Career and personality assessments</li>
          <li>Personalized career recommendations</li>
          <li>Information about education and job opportunities</li>
        </ul>
        
        <h3>3. User Responsibilities</h3>
        <p>Users agree to:</p>
        <ul>
          <li>Provide accurate and truthful information</li>
          <li>Not use the platform for illegal purposes</li>
          <li>Respect the rights of other users</li>
        </ul>
        
        <h3>4. Disclaimer</h3>
        <p>Recommendations provided are for guidance purposes only and do not guarantee specific outcomes.</p>
        
        <h3>5. Terms Modification</h3>
        <p>We reserve the right to modify these terms at any time.</p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p><strong>للتواصل | Contact:</strong> support@school2career.com</p>
      </div>
    </div>
  )
}