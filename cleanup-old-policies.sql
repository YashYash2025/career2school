-- حذف الـ Policies القديمة المكررة (اللي roles = public)
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- التحقق من الـ Policies المتبقية (يجب أن تكون 6 فقط)
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;
