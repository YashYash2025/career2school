// Script to save a test RIASEC assessment
// Run this in browser console while logged in

const testAssessment = {
    holland_code: 'RIS',
    raw_scores: {
        R: 45,
        I: 38,
        S: 32,
        A: 25,
        E: 20,
        C: 18
    },
    ranking: [
        { type: 'R', raw: 45, percentage: 75 },
        { type: 'I', raw: 38, percentage: 63 },
        { type: 'S', raw: 32, percentage: 53 },
        { type: 'A', raw: 25, percentage: 42 },
        { type: 'E', raw: 20, percentage: 33 },
        { type: 'C', raw: 18, percentage: 30 }
    ],
    confidence_score: 85
};

// Get session token
const userData = JSON.parse(localStorage.getItem('userData'));
const token = userData?.token;

if (!token) {
    console.error('❌ No token found. Please login first.');
} else {
    console.log('🔑 Token found:', token.substring(0, 20) + '...');
    console.log('📤 Sending assessment data...');

    fetch('/api/assessments/riasec/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testAssessment)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log('✅ Assessment saved successfully!');
                console.log('📊 Data:', data);
                alert('✅ تم حفظ التقييم التجريبي بنجاح!\n\nروح Dashboard عشان تشوفه.');
            } else {
                console.error('❌ Error:', data);
                alert('❌ فشل حفظ التقييم: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error('💥 Request failed:', err);
            alert('❌ حدث خطأ في الطلب');
        });
}
