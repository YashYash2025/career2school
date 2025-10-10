// التحقق من التقييم للمستخدم المسجل
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const USER_ID = 'b71b8fe8-18cb-436b-a60f-b739b0d243cf';

async function verify() {
  console.log('🔍 التحقق من بيانات المستخدم...\n');
  
  // 1. Profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', USER_ID)
    .single();
  
  console.log('👤 Profile:', profile ? '✅ موجود' : '❌ مش موجود');
  if (profile) {
    console.log('   الاسم:', profile.full_name);
    console.log('   Email:', profile.email);
  }
  console.log('');
  
  // 2. Assessment Results
  const { data: results } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('user_id', USER_ID);
  
  console.log('📊 التقييمات:', results?.length || 0);
  if (results && results.length > 0) {
    results.forEach((r, i) => {
      console.log(`\n   تقييم ${i + 1}:`);
      console.log('   Holland Code:', r.detailed_scores.holland_code);
      console.log('   Confidence:', r.detailed_scores.confidence_score + '%');
      console.log('   التاريخ:', new Date(r.created_at).toLocaleString('ar-EG'));
    });
  }
  console.log('');
  
  console.log('═══════════════════════════════════════════════════');
  if (profile && results && results.length > 0) {
    console.log('✅ كل البيانات موجودة في الـ database!');
    console.log('🔄 رفرش الصفحة عشان تشوف التقييم');
  } else {
    console.log('❌ في بيانات ناقصة');
  }
  console.log('═══════════════════════════════════════════════════');
}

verify();
