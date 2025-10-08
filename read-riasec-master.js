const XLSX = require('xlsx');

console.log('📖 قراءة ملف RIASEC Master...\n');
console.log('='.repeat(80) + '\n');

try {
  // قراءة الملف
  const workbook = XLSX.readFile('New RIASEC/RIASEC_Master_Global_Bilingual (6).xlsx');
  
  console.log('📊 معلومات الملف:\n');
  console.log(`   عدد الأوراق (Sheets): ${workbook.SheetNames.length}\n`);
  
  // عرض أسماء الأوراق
  console.log('📋 أسماء الأوراق:\n');
  workbook.SheetNames.forEach((name, index) => {
    console.log(`   ${index + 1}. ${name}`);
  });
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // تحليل كل ورقة
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`📄 الورقة ${index + 1}: ${sheetName}\n`);
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`   عدد الصفوف: ${data.length}`);
    
    if (data.length > 0) {
      // عرض العناوين (أول صف)
      console.log(`   العناوين: ${data[0].join(' | ')}`);
      
      // عرض أول 3 صفوف كعينة
      console.log('\n   📝 عينة من البيانات:\n');
      for (let i = 1; i < Math.min(4, data.length); i++) {
        console.log(`      صف ${i}: ${data[i].slice(0, 5).join(' | ')}...`);
      }
    }
    
    console.log('\n' + '-'.repeat(80) + '\n');
  });
  
  // تحليل تفصيلي للورقة الأولى
  console.log('='.repeat(80));
  console.log('\n🔍 تحليل تفصيلي للورقة الأولى:\n');
  
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const firstData = XLSX.utils.sheet_to_json(firstSheet);
  
  if (firstData.length > 0) {
    console.log(`   عدد الأسئلة: ${firstData.length}`);
    console.log(`   الأعمدة الموجودة: ${Object.keys(firstData[0]).join(', ')}\n`);
    
    // عرض أول سؤال كامل
    console.log('   📋 مثال على سؤال كامل:\n');
    const firstQuestion = firstData[0];
    Object.entries(firstQuestion).forEach(([key, value]) => {
      console.log(`      ${key}: ${value}`);
    });
    
    // إحصائيات
    console.log('\n   📊 إحصائيات:\n');
    
    // عد الأنواع (Types)
    if (firstData[0].Type || firstData[0].type) {
      const types = {};
      firstData.forEach(row => {
        const type = row.Type || row.type;
        types[type] = (types[type] || 0) + 1;
      });
      
      console.log('      التوزيع حسب النوع:');
      Object.entries(types).sort().forEach(([type, count]) => {
        console.log(`         ${type}: ${count} سؤال`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(80));
  
} catch (error) {
  console.error('❌ خطأ في قراءة الملف:', error.message);
}
