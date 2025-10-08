// اختبار اتصال Supabase
const https = require('https');

const supabaseUrl = 'https://imobhmzywvzbvyqpzcau.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb2JobXp5d3Z6YnZ5cXB6Y2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0OTM1MSwiZXhwIjoyMDcyNDI1MzUxfQ.zUNPjPVMD6lNaMZlZBWz0TWDl9PgVRRMpY_7A6N_-8Y';

console.log('🔍 اختبار الاتصال مع Supabase...');

// اختبار بسيط للاتصال
https.get(`${supabaseUrl}/rest/v1/assessment_tools?select=*`, {
    headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
    }
}, (res) => {
    console.log('✅ حالة الاستجابة:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('📡 البيانات المستلمة:', data);
        console.log('🎯 الاتصال يعمل بنجاح!');
    });
}).on('error', (err) => {
    console.error('❌ خطأ في الاتصال:', err.message);
});