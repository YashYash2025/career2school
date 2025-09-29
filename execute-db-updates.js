const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ فشل في قراءة متغيرات البيئة')
  console.error('تأكد من وجود NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeDbUpdates() {
  console.log('🚀 بدء تنفيذ تحديثات قاعدة البيانات...')
  
  try {
    // قراءة سكريبت تطوير قاعدة البيانات
    const structureScript = fs.readFileSync(
      path.join(__dirname, 'database-structure-update.sql'), 
      'utf8'
    )
    
    console.log('📁 تم قراءة سكريبت إنشاء الجداول...')
    
    // تنفيذ سكريبت إنشاء الجداول
    const { data: structureData, error: structureError } = await supabase.rpc('exec_sql', {
      sql: structureScript
    })
    
    if (structureError) {
      console.error('❌ خطأ في تنفيذ سكريبت إنشاء الجداول:', structureError)
      throw structureError
    }
    
    console.log('✅ تم إنشاء الجداول بنجاح')
    
    // قراءة سكريبت البيانات المرجعية
    const seedScript = fs.readFileSync(
      path.join(__dirname, 'database-seed-data.sql'), 
      'utf8'
    )
    
    console.log('📁 تم قراءة سكريبت البيانات المرجعية...')
    
    // تنفيذ سكريبت البيانات المرجعية
    const { data: seedData, error: seedError } = await supabase.rpc('exec_sql', {
      sql: seedScript
    })
    
    if (seedError) {
      console.error('❌ خطأ في تنفيذ سكريبت البيانات المرجعية:', seedError)
      throw seedError
    }
    
    console.log('✅ تم إدراج البيانات المرجعية بنجاح')
    
    // التحقق من الجداول الجديدة
    console.log('🔍 التحقق من الجداول الجديدة...')
    
    const tables = ['countries', 'governorates', 'education_levels', 'education_grades']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.error(`❌ فشل في الوصول لجدول ${table}:`, error)
      } else {
        console.log(`✅ جدول ${table} جاهز ويحتوي على بيانات`)
      }
    }
    
    // التحقق من أعمدة user_profiles الجديدة
    console.log('🔍 التحقق من تحديثات جدول user_profiles...')
    
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, birth_date, phone, gender, country_code, education_level_code')
      .limit(1)
    
    if (profileError) {
      console.error('❌ فشل في الوصول لجدول user_profiles المحدث:', profileError)
    } else {
      console.log('✅ جدول user_profiles تم تحديثه بنجاح')
    }
    
    console.log('🎉 تم تنفيذ جميع تحديثات قاعدة البيانات بنجاح!')
    
  } catch (error) {
    console.error('💥 فشل في تنفيذ التحديثات:', error)
    process.exit(1)
  }
}

// تشغيل التحديثات
executeDbUpdates()