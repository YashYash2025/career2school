-- حذف الـ policies القديمة
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- تفعيل RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة: المستخدم يقدر يقرأ بياناته فقط
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy للتحديث: المستخدم يقدر يحدث بياناته فقط
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy للإضافة: المستخدم يقدر يضيف بياناته فقط
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy للحذف: المستخدم يقدر يحذف بياناته فقط (اختياري)
CREATE POLICY "Users can delete own profile"
ON user_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- تحقق من الـ policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles';
