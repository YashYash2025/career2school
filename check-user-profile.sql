-- تحقق من بيانات المستخدم في user_profiles
SELECT 
  user_id,
  email,
  first_name,
  last_name,
  phone,
  city,
  gender,
  school_name,
  created_at
FROM user_profiles
WHERE user_id = 'b71b8fe8-18cb-436b-a60f-b739b0d243cf';

-- تحقق من المستخدم في auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE id = 'b71b8fe8-18cb-436b-a60f-b739b0d243cf';

-- إذا كان المستخدم موجود في auth.users بس مش في user_profiles
-- نقدر نضيف البيانات يدوياً:
/*
INSERT INTO user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  city,
  gender,
  school_name,
  preferred_language,
  user_type,
  is_active
)
VALUES (
  'b71b8fe8-18cb-436b-a60f-b739b0d243cf',
  'user@example.com', -- استبدل بالإيميل الصحيح
  'محمد',
  'ياسر',
  '01234567890',
  'القاهرة',
  'male',
  'مدرسة النيل',
  'ar',
  'student',
  true
);
*/
