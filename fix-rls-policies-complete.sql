-- حذف جميع الـ policies القديمة
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON user_profiles;

-- تفعيل RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ===================================
-- Policies للمستخدمين العاديين
-- ===================================

-- 1. القراءة: المستخدم يقدر يقرأ بياناته فقط
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. التحديث: المستخدم يقدر يحدث بياناته فقط
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. الحذف: المستخدم يقدر يحذف بياناته فقط
CREATE POLICY "Users can delete own profile"
ON user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ===================================
-- Policies للـ Service Role (API)
-- ===================================

-- 4. السماح للـ Service Role بإضافة بيانات جديدة (للتسجيل)
CREATE POLICY "Service role can insert profiles"
ON user_profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. السماح للـ Service Role بقراءة كل البيانات (للإدارة)
CREATE POLICY "Service role can read all profiles"
ON user_profiles
FOR SELECT
TO service_role
USING (true);

-- 6. السماح للـ Service Role بتحديث كل البيانات (للإدارة)
CREATE POLICY "Service role can update all profiles"
ON user_profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- ===================================
-- التحقق من الـ Policies
-- ===================================
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
WHERE tablename = 'user_profiles'
ORDER BY policyname;
