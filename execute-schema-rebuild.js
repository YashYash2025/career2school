const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    // إذا كانت الدالة غير موجودة، نستخدم طريقة بديلة
    console.log('⚠️  استخدام الطريقة البديلة...');
    return { error };
  }
  
  return { data, error };
}

async function rebuildSchema() {
  console.log('🚀 بدء إعادة بناء Schema...\n');
  console.log('=' .repeat(60));
  
  try {
    // قراءة ملف SQL
    console.log('\n📖 قراءة ملف SQL...');
    const sqlContent = fs.readFileSync('rebuild-schema.sql', 'utf8');
    
    // تقسيم الأوامر
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`✅ تم العثور على ${statements.length} أمر SQL\n`);
    
    console.log('=' .repeat(60));
    console.log('\n⚙️  تنفيذ الأوامر...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // استخراج نوع الأمر
      const commandType = statement.split(/\s+/)[0].toUpperCase();
      const tableName = extractTableName(statement);
      
      process.stdout.write(`[${i + 1}/${statements.length}] ${commandType} ${tableName}... `);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // محاولة تنفيذ مباشر
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
              },
              body: JSON.stringify({ sql_query: statement + ';' })
            }
          );
          
          if (!response.ok) {
            console.log('❌');
            console.log(`   خطأ: ${error.message}`);
            errorCount++;
          } else {
            console.log('✅');
            successCount++;
          }
        } else {
          console.log('✅');
          successCount++;
        }
      } catch (err) {
        console.log('❌');
        console.log(`   خطأ: ${err.message}`);
        errorCount++;
      }
      
      // تأخير صغير لتجنب Rate Limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 النتائج:');
    console.log(`   ✅ نجح: ${successCount}`);
    console.log(`   ❌ فشل: ${errorCount}`);
    console.log(`   📈 المجموع: ${statements.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 تم إعادة بناء Schema بنجاح!');
    } else {
      console.log('\n⚠️  تم الانتهاء مع بعض الأخطاء');
      console.log('💡 يمكنك تنفيذ الملف rebuild-schema.sql يدوياً في Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('\n❌ خطأ عام:', error.message);
    console.log('\n💡 حل بديل:');
    console.log('   1. افتح Supabase Dashboard');
    console.log('   2. اذهب إلى SQL Editor');
    console.log('   3. انسخ محتوى ملف rebuild-schema.sql');
    console.log('   4. نفذه مباشرة');
  }
  
  console.log('\n' + '='.repeat(60));
}

function extractTableName(statement) {
  const match = statement.match(/(?:TABLE|VIEW|INDEX|TRIGGER)\s+(?:IF\s+(?:NOT\s+)?EXISTS\s+)?(\w+)/i);
  return match ? match[1] : '';
}

rebuildSchema()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });
