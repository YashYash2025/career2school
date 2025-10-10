// التحقق من الـ schema الحالي
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('🔍 جاري فحص قاعدة البيانات...\n');
  
  // 1. فحص user_profiles
  console.log('1️⃣ فحص جدول user_profiles:');
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
  
  if (profileError) {
    console.log('   ❌ خطأ:', profileError.message);
  } else {
    console.log('   ✅ الجدول موجود');
    console.log('   📊 عدد السجلات:', profiles?.length || 0);
    if (profiles && profiles.length > 0) {
      console.log('   📝 أول سجل:', profiles[0]);
    }
  }
  console.log('');
  
  // 2. فحص assessment_tools
  console.log('2️⃣ فحص جدول assessment_tools:');
  const { data: tools, error: toolError } = await supabase
    .from('assessment_tools')
    .select('*')
    .limit(1);
  
  if (toolError) {
    console.log('   ❌ خطأ:', toolError.message);
  } else {
    console.log('   ✅ الجدول موجود');
    console.log('   📊 عدد السجلات:', tools?.length || 0);
    if (tools && tools.length > 0) {
      console.log('   📝 أول سجل:', tools[0]);
    }
  }
  console.log('');
  
  // 3. فحص assessment_sessions
  console.log('3️⃣ فحص جدول assessment_sessions:');
  const { data: sessions, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .limit(1);
  
  if (sessionError) {
    console.log('   ❌ خطأ:', sessionError.message);
  } else {
    console.log('   ✅ الجدول موجود');
    console.log('   📊 عدد السجلات:', sessions?.length || 0);
  }
  console.log('');
  
  // 4. فحص assessment_results
  console.log('4️⃣ فحص جدول assessment_results:');
  const { data: results, error: resultError } = await supabase
    .from('assessment_results')
    .select('*')
    .limit(1);
  
  if (resultError) {
    console.log('   ❌ خطأ:', resultError.message);
  } else {
    console.log('   ✅ الجدول موجود');
    console.log('   📊 عدد السجلات:', results?.length || 0);
  }
  console.log('');
  
  // 5. فحص auth.users
  console.log('5️⃣ فحص المستخدمين المسجلين:');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.log('   ❌ خطأ:', usersError.message);
  } else {
    console.log('   ✅ عدد المستخدمين:', users?.length || 0);
    if (users && users.length > 0) {
      console.log('   📝 أول مستخدم:');
      console.log('      ID:', users[0].id);
      console.log('      Email:', users[0].email);
      console.log('      Created:', users[0].created_at);
    }
  }
}

checkSchema();
