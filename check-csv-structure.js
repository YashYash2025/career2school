// فحص بنية ملف CSV
const fs = require('fs');
const csv = require('csv-parser');

function checkCSV(filePath) {
  console.log(`\n📄 فحص: ${filePath}\n`);
  
  let firstRow = null;
  let rowCount = 0;
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      rowCount++;
      if (rowCount === 1) {
        firstRow = row;
        console.log('📋 أسماء الأعمدة:');
        Object.keys(row).forEach((key, index) => {
          console.log(`   ${index + 1}. "${key}"`);
        });
        console.log('\n📝 أول صف:');
        Object.entries(row).forEach(([key, value]) => {
          console.log(`   ${key}: "${value}"`);
        });
      }
    })
    .on('end', () => {
      console.log(`\n📊 إجمالي الصفوف: ${rowCount}`);
      console.log('═══════════════════════════════════════════════════\n');
    })
    .on('error', (error) => {
      console.error('❌ خطأ:', error);
    });
}

// فحص الملفين
checkCSV('New RIASEC/01-RIASEC_60_College.csv');

setTimeout(() => {
  checkCSV('New RIASEC/02-RIASEC_60_School.csv');
}, 2000);
