// اختبار API حفظ نتائج RIASEC
require('dotenv').config({ path: '.env.local' });

const testData = {
  user_id: 'demo_user_123', // استخدم user_id حقيقي من auth.users
  holland_code: 'RIS',
  raw_scores: {
    R: { raw: 8, percentage: 80 },
    I: { raw: 7, percentage: 70 },
    A: { raw: 5, percentage: 50 },
    S: { raw: 6, percentage: 60 },
    E: { raw: 4, percentage: 40 },
    C: { raw: 3, percentage: 30 }
  },
  ranking: [
    { type: 'R', raw: 8, percentage: 80 },
    { type: 'I', raw: 7, percentage: 70 },
    { type: 'S', raw: 6, percentage: 60 }
  ],
  confidence_score: 85
};

async function testSaveAPI() {
  try {
    console.log('🧪 اختبار API حفظ النتائج...');
    console.log('📊 البيانات:', testData);

    const response = await fetch('http://localhost:3000/api/assessments/riasec/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    console.log('\n📊 النتيجة:');
    console.log('  Status:', response.status);
    console.log('  Success:', result.success);
    console.log('  Message:', result.message);
    console.log('  Assessment ID:', result.assessment_id);

    if (!result.success) {
      console.error('  Error:', result.error);
      console.error('  Details:', result.details);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testSaveAPI();
