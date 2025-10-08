const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('📊 استخراج توصيات RIASEC من Excel\n');
console.log('='.repeat(80) + '\n');

async function extractAndInsertRecommendations() {
  try {
    // 1. قراءة ملف Excel
    console.log('📖 قراءة ملف Excel...\n');
    const workbook = XLSX.readFile('New RIASEC/RIASEC_Master_Global_Bilingual.xlsx');
    
    // 2. الأوراق المطلوبة (المناطق)
    const regionSheets = [
      'Codes_Egypt',
      'Codes_USA',
      'Codes_GCC',
      'Codes_Africa',
      'Codes_North Africa',
      'Codes_Europe',
      'Codes_Asia'
    ];
    
    // 3. تحويل أسماء الأوراق لأسماء المناطق
    const regionMap = {
      'Codes_Egypt': 'Egypt',
      'Codes_USA': 'USA',
      'Codes_GCC': 'GCC',
      'Codes_Africa': 'Africa',
      'Codes_North Africa': 'North Africa',
      'Codes_Europe': 'Europe',
      'Codes_Asia': 'Asia'
    };
    
    // 4. المراحل التعليمية
    const educationLevels = {
      'Middle': ['Middle_EN', 'Middle_AR'],
      'High': ['High_EN', 'High_AR'],
      'College': ['College_EN', 'College_AR'],
      'Work': ['Work_EN', 'Work_AR']
    };
    
    let allRecommendations = [];
    let totalCount = 0;
    
    // 5. معالجة كل ورقة (منطقة)
    for (const sheetName of regionSheets) {
      if (!workbook.SheetNames.includes(sheetName)) {
        console.log(`⚠️  الورقة ${sheetName} غير موجودة، تخطي...`);
        continue;
      }
      
      const region = regionMap[sheetName];
      console.log(`\n📄 معالجة منطقة: ${region} (${sheetName})`);
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`   عدد الأكواد: ${data.length}`);
      
      // 6. معالجة كل صف (كود)
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const code = row.Code;
        
        if (!code || code.length !== 3) {
          continue; // تخطي الصفوف الفارغة أو غير الصحيحة
        }
        
        // 7. استخراج التوصيات لكل مرحلة
        for (const [level, [enCol, arCol]] of Object.entries(educationLevels)) {
          const recommendationsEN = row[enCol] || '';
          const recommendationsAR = row[arCol] || '';
          
          if (recommendationsEN || recommendationsAR) {
            allRecommendations.push({
              holland_code: code,
              code_rank: i + 1,
              region: region,
              education_level: level,
              recommendations_en: recommendationsEN,
              recommendations_ar: recommendationsAR,
              metadata: {
                source_sheet: sheetName,
                row_number: i + 1
              }
            });
            totalCount++;
          }
        }
      }
      
      console.log(`   ✅ تم استخراج ${data.length * 4} توصية`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 إجمالي التوصيات المستخرجة: ${totalCount}\n`);
    
    // 8. إدراج البيانات في قاعدة البيانات
    console.log('💾 إدراج البيانات في قاعدة البيانات...\n');
    
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < allRecommendations.length; i += batchSize) {
      const batch = allRecommendations.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('riasec_recommendations')
        .insert(batch)
        .select();
      
      if (error) {
        console.log(`❌ خطأ في الدفعة ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        errorCount += batch.length;
      } else {
        insertedCount += data.length;
        console.log(`✅ دفعة ${Math.floor(i / batchSize) + 1}: ${data.length} توصية`);
      }
      
      // تأخير صغير
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📈 النتائج النهائية:');
    console.log(`   ✅ تم الإدراج: ${insertedCount}`);
    console.log(`   ❌ فشل: ${errorCount}`);
    console.log(`   📊 المجموع: ${totalCount}`);
    
    // 9. التحقق من البيانات
    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 التحقق من البيانات...\n');
    
    const { count: totalInDB } = await supabase
      .from('riasec_recommendations')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ إجمالي التوصيات في قاعدة البيانات: ${totalInDB}`);
    
    // عرض عينة
    const { data: sample } = await supabase
      .from('riasec_recommendations')
      .select('holland_code, region, education_level')
      .limit(5);
    
    console.log('\n📋 عينة من البيانات:');
    sample.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.holland_code} - ${rec.region} - ${rec.education_level}`);
    });
    
    // إحصائيات
    console.log('\n📊 إحصائيات:');
    
    const regions = ['Egypt', 'USA', 'GCC', 'Africa', 'North Africa', 'Europe', 'Asia'];
    for (const region of regions) {
      const { count } = await supabase
        .from('riasec_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('region', region);
      
      console.log(`   ${region}: ${count} توصية`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 تم الانتهاء بنجاح!');
    
  } catch (error) {
    console.error('\n❌ خطأ:', error);
    throw error;
  }
}

extractAndInsertRecommendations()
  .then(() => {
    console.log('\n✅ انتهت العملية');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ فشلت العملية:', err);
    process.exit(1);
  });
