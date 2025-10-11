const Big5International = require('./app/lib/algorithms/Big5International.js').default;

// محاكاة أسئلة (12 سؤال لكل بُعد = 60 سؤال)
const mockQuestions = [];
let orderIndex = 1;

// O: 6 إيجابي + 6 عكسي
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'O', order_index: orderIndex++, is_reverse_scored: false });
}
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'O', order_index: orderIndex++, is_reverse_scored: true });
}

// C: 6 إيجابي + 6 عكسي
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'C', order_index: orderIndex++, is_reverse_scored: false });
}
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'C', order_index: orderIndex++, is_reverse_scored: true });
}

// E: 6 إيجابي + 6 عكسي
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'E', order_index: orderIndex++, is_reverse_scored: false });
}
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'E', order_index: orderIndex++, is_reverse_scored: true });
}

// A: 6 إيجابي + 6 عكسي
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'A', order_index: orderIndex++, is_reverse_scored: false });
}
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'A', order_index: orderIndex++, is_reverse_scored: true });
}

// N: 6 إيجابي + 6 عكسي
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'N', order_index: orderIndex++, is_reverse_scored: false });
}
for (let i = 0; i < 6; i++) {
  mockQuestions.push({ dimension: 'N', order_index: orderIndex++, is_reverse_scored: true });
}

// محاكاة إجابات
const responses = {};
for (let i = 1; i <= 60; i++) {
  // O: كلهم 5 (مرتفع)
  if (i <= 12) responses[`q${i}`] = 5;
  // C: كلهم 4 (متوسط-مرتفع)
  else if (i <= 24) responses[`q${i}`] = 4;
  // E: كلهم 2 (منخفض)
  else if (i <= 36) responses[`q${i}`] = 2;
  // A: كلهم 5 (مرتفع)
  else if (i <= 48) responses[`q${i}`] = 5;
  // N: كلهم 2 (منخفض - استقرار عاطفي)
  else responses[`q${i}`] = 2;
}

console.log('🧪 اختبار خوارزمية Big5');
console.log('='.repeat(60));

const algorithm = new Big5International();
const results = algorithm.calculate(responses, mockQuestions);

console.log('\n📊 النتائج:');
console.log('='.repeat(60));
console.log('Profile Code:', results.profile_code);
console.log('\nالدرجات:');
Object.entries(results.raw_scores).forEach(([trait, data]) => {
  console.log(`  ${trait}: ${data.percentage.toFixed(1)}% (${data.level_ar})`);
});

console.log('\n📝 الملخص:');
console.log(results.summary);

console.log('\n🎯 الترتيب:');
results.ranking.forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.name_ar}: ${r.percentage.toFixed(1)}%`);
});

console.log('\n✅ الاختبار نجح!');
