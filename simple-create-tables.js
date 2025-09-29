const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متغيرات البيئة غير موجودة')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeDbUpdates() {
  console.log('🚀 بدء إنشاء الجداول...')
  
  try {
    // 1. إنشاء جدول البلدان
    console.log('📋 إنشاء جدول countries...')
    const { error: countriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS countries (
          code VARCHAR(3) PRIMARY KEY,
          name_ar VARCHAR(100) NOT NULL,
          name_en VARCHAR(100) NOT NULL,
          name_fr VARCHAR(100) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (countriesError) {
      console.error('❌ خطأ في إنشاء جدول countries:', countriesError)
      return
    }
    
    // 2. إنشاء جدول المحافظات
    console.log('📋 إنشاء جدول governorates...')
    const { error: governoratesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS governorates (
          code VARCHAR(10) PRIMARY KEY,
          country_code VARCHAR(3) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
          name_ar VARCHAR(100) NOT NULL,
          name_en VARCHAR(100) NOT NULL, 
          name_fr VARCHAR(100) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (governoratesError) {
      console.error('❌ خطأ في إنشاء جدول governorates:', governoratesError)
      return
    }
    
    // 3. إنشاء جدول المراحل التعليمية
    console.log('📋 إنشاء جدول education_levels...')
    const { error: educationLevelsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS education_levels (
          code VARCHAR(20) PRIMARY KEY,
          name_ar VARCHAR(100) NOT NULL,
          name_en VARCHAR(100) NOT NULL,
          name_fr VARCHAR(100) NOT NULL,
          min_age INTEGER,
          max_age INTEGER,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (educationLevelsError) {
      console.error('❌ خطأ في إنشاء جدول education_levels:', educationLevelsError)
      return
    }
    
    // 4. إنشاء جدول الصفوف الدراسية
    console.log('📋 إنشاء جدول education_grades...')
    const { error: gradesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS education_grades (
          code VARCHAR(10) PRIMARY KEY,
          education_level_code VARCHAR(20) NOT NULL REFERENCES education_levels(code) ON DELETE CASCADE,
          name_ar VARCHAR(100) NOT NULL,
          name_en VARCHAR(100) NOT NULL,
          name_fr VARCHAR(100) NOT NULL,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (gradesError) {
      console.error('❌ خطأ في إنشاء جدول education_grades:', gradesError)
      return
    }
    
    console.log('✅ تم إنشاء جميع الجداول بنجاح!')
    
  } catch (error) {
    console.error('💥 خطأ عام:', error)
  }
}

executeDbUpdates()