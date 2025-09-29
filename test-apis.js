// Test API endpoints
const testAPIs = async () => {
  console.log('🔍 Testing API endpoints...');
  
  try {
    // Test reference data API
    console.log('\n1. Testing reference data API:');
    const refResponse = await fetch('http://localhost:3002/api/reference?type=all');
    const refResult = await refResponse.json();
    console.log('Reference API Status:', refResponse.status);
    console.log('Reference API Response:', JSON.stringify(refResult, null, 2));
    
    // Test registration API with dummy data
    console.log('\n2. Testing registration API:');
    const testUser = {
      email: `test${Date.now()}@school2career.com`, // Use timestamp to avoid duplicates
      password: 'test123456',
      firstName: 'أحمد',
      lastName: 'محمد',
      birthDate: '2000-01-01',
      phone: '+201234567890',
      gender: 'male',
      country: { code: 'EG', name: 'مصر' },
      governorate: { code: 'CAI', name: 'القاهرة' },
      city: 'القاهرة',
      educationLevel: { code: 'high', name: 'ثانوي' },
      currentGrade: { code: '12', name: 'الصف الثالث الثانوي' },
      schoolName: 'مدرسة النيل الثانوية',
      specialization: 'علوم',
      preferredLanguage: 'ar'
    };
    
    const regResponse = await fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const regResult = await regResponse.json();
    console.log('Registration API Status:', regResponse.status);
    console.log('Registration API Response:', JSON.stringify(regResult, null, 2));
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Run tests
testAPIs();