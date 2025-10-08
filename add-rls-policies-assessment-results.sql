-- ============================================================
-- إضافة Row Level Security Policies لجدول assessment_results
-- ============================================================

-- 1. تفعيل RLS على الجدول
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- 2. Policy: المستخدمون يمكنهم قراءة نتائجهم فقط
CREATE POLICY "Users can read own assessment results"
  ON assessment_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Policy: المستخدمون يمكنهم إضافة نتائجهم فقط
CREATE POLICY "Users can insert own assessment results"
  ON assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Policy: المستخدمون يمكنهم تحديث نتائجهم فقط
CREATE POLICY "Users can update own assessment results"
  ON assessment_results
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. التحقق من الـ Policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'assessment_results';

-- ============================================================
-- تم إضافة RLS Policies بنجاح
-- ============================================================
