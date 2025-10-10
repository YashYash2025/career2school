// تعيين كلمة سر للمستخدم
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setPassword() {
  try {
    console.log('🔐 جاري تعيين كلمة السر...\n');
    
    // البحث عن المستخدم
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError || !users || users.length === 0) {
      console.error('❌ لا يوجد مستخدمين');
      return;
    }
    
    const user = users[0];
    console.log('👤 المستخدم:', user.id);
    console.log('📧 البريد الحالي:', user.email || 'لا يوجد');
    console.log('');
    
    // تحديث البريد وكلمة السر
    const newEmail = 'test@school2career.com';
    const newPassword = 'Test123456';
    
    console.log('📝 جاري تحديث البيانات...');
    
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        email: newEmail,
        password: newPassword,
        email_confirm: true
      }
    );
    
    if (updateError) {
      console.error('❌ خطأ في التحديث:', updateError);
      return;
    }
    
    console.log('✅ تم تحديث البيانات بنجاح!\n');
    
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 بيانات تسجيل الدخول');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('📧 البريد الإلكتروني: test@school2career.com');
    console.log('🔑 كلمة السر: Test123456');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ يمكنك الآن تسجيل الدخول!');
    console.log('═══════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('💥 خطأ:', error);
  }
}

setPassword();
