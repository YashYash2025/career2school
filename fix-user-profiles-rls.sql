-- ============================================================
-- إصلاح RLS Policies لجدول user_profiles
-- ============================================================

-- حذف الـ policies القديمة
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- إضافة policies جديدة أكثر مرونة

-- Policy 1: السماح بالقراءة للمستخدم نفسه
CREATE POLICY "Enable read access for users based on user_id"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: السماح بالإضافة للمستخدم نفسه
CREATE POLICY "Enable insert for users based on user_id"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: السماح بالتحديث للمستخدم نفسه
CREATE POLICY "Enable update for users based on user_id"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: السماح بالحذف للمستخدم نفسه
CREATE POLICY "Enable delete for users based on user_id"
  ON user_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- التحقق من الـ Policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';

-- ============================================================
-- تم إصلاح RLS Policies
-- ============================================================
