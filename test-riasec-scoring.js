const RIASECInternational = require('./app/lib/algorithms/RIASECInternational.js').default;

// محاكاة إجاباتك:
// R = 10/10 = 100%
// I = 10/10 = 100%
// A = 6/10 = 60%
// S = 9/10 = 90%
// E = 8/10 = 80%
// C = 3/10 = 30%

const responses = {
  // R: 10 أسئلة - كلهم "أحب" (1)
  R1: 1, R2: 1, R3: 1, R4: 1, R5: 1,
  R6: 1, R7: 1, R8: 1, R9: 1, R10: 1,
  
  // I: 10 أسئلة - كلهم "أحب" (1)
  I1: 1, I2: 1, I3: 1, I4: 1, I5: 1,
  I6: 1, I7: 1, I8: 1, I9: 1, I10: 1,
  
  // A: 10 أسئلة - 6 "أحب" (1) و 4 "لا أحب" (0)
  A1: 1, A2: 1, A3: 1, A4: 1, A5: 1,
  A6: 1, A7: 0, A8: 0, A9: 0, A10: 0,
  
  // S: 10 أسئلة - 9 "أحب" (1) و 1 "لا أحب" (0)
  S1: 1, S2: 1, S3: 1, S4: 1, S5: 1,
  S6: 1, S7: 1, S8: 1, S9: 1, S10: 0,
  
  // E: 10 أسئلة - 8 "أحب" (1) و 2 "لا أحب" (0)
  E1: 1, E2: 1, E3: 1, E4: 1, E5: 1,
  E6: 1, E7: 1, E8: 1, E9: 0, E10: 0,
  
  // C: 10 أسئلة - 3 "أحب" (1) و 7 "لا أحب" (0)
  C1: 1, C2: 1, C3: 1, C4: 0, C5: 0,
  C6: 0, C7: 0, C8: 0, C9: 0, C10: 0
};

console.log('🧪 اختبار نظام RIASEC');
console.log('='.repeat(60));
console.log('\n📊 الإجابات المتوقعة:');
console.log('  R = 10/10 = 100%');
console.log('  I = 10/10 = 100%');
console.log('  S = 9/10 = 90%');
console.log('  E = 8/10 = 80%');
console.log('  A = 6/10 = 60%');
console.log('  C = 3/10 = 30%');
console.log('\n🎯 الكود المتوقع: RIS');
console.log('='.repeat(60));

try {
  const algorithm = new RIASECInternational();
  const results = algorithm.calculate(responses, {
    country: 'international',
    version: 'medium' // 60 سؤال
  });
  
  console.log('\n✅ النتائج الفعلية:');
  console.log('\n📊 النسب المئوية:');
  Object.entries(results.raw_scores).forEach(([type, data]) => {
    const icon = data.percentage >= 90 ? '🟢' : data.percentage >= 60 ? '🟡' : '🔴';
    console.log(`  ${icon} ${type} = ${data.raw}/${10} = ${data.percentage}%`);
  });
  
  console.log('\n🎯 الكود المهني:', results.holland_code);
  console.log('\n📈 الترتيب:');
  results.ranking.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.type} - ${item.percentage}%`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  // التحقق
  const isCorrect = results.holland_code === 'RIS';
  if (isCorrect) {
    console.log('\n✅ النتيجة صحيحة! الكود = RIS');
  } else {
    console.log(`\n❌ النتيجة خاطئة! الكود = ${results.holland_code} (المتوقع: RIS)`);
  }
  
  // عرض النسب
  const R_correct = results.raw_scores.R.percentage === 100;
  const I_correct = results.raw_scores.I.percentage === 100;
  const S_correct = results.raw_scores.S.percentage === 90;
  
  console.log('\n🔍 التحقق من النسب:');
  console.log(`  R = ${results.raw_scores.R.percentage}% ${R_correct ? '✅' : '❌'}`);
  console.log(`  I = ${results.raw_scores.I.percentage}% ${I_correct ? '✅' : '❌'}`);
  console.log(`  S = ${results.raw_scores.S.percentage}% ${S_correct ? '✅' : '❌'}`);
  
} catch (error) {
  console.error('\n❌ خطأ في التنفيذ:', error.message);
  console.error(error.stack);
}
