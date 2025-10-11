const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔨 إنشاء جداول Big5...\n');
console.log('⚠️  يرجى تنفيذ الـ SQL التالي في Supabase Dashboard:\n');
console.log('📋 SQL Editor → New Query → الصق الكود من ملف create-big5-tables.sql\n');
console.log('أو افتح الرابط: https://supabase.com/dashboard/project/YOUR_PROJECT/sql\n');
console.log('=' * 60);
