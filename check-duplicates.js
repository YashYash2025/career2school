const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDuplicates() {
  console.log('🔍 فحص التكرار في جدول riasec_careers...\n');

  // جلب عينة من الوظائف لنمط R
  const { data } = await supabase
    .from('riasec_careers')
    .select('career_title_ar, holland_code, region, match_percentage')
    .eq('primary_type', 'R')
    .eq('region', 'Egypt')
    .order('match_percentage', { ascending: false })
    .limit(30);

  console.log('📊 أول 30 وظيفة لنمط R في مصر:\n');
  
  const titleCounts = {};
  data?.forEach((career, idx) => {
    console.log(`${idx + 1}. ${career.career_title_ar} (${career.holland_code}) - ${career.match_percentage}%`);
    
    const title = career.career_title_ar;
    titleCounts[title] = (titleCounts[title] || 0) + 1;
  });

  console.log('\n\n📈 إحصائيات التكرار:');
  console.log('='.repeat(60));
  
  Object.entries(titleCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .forEach(([title, count]) => {
      console.log(`${title}: ${count} مرة`);
    });

  // إحصائيات عامة
  const { count: totalCareers } = await supabase
    .from('riasec_careers')
    .select('*', { count: 'exact', head: true });

  const { data: uniqueTitles } = await supabase
    .from('riasec_careers')
    .select('career_title_ar');

  const uniqueCount = new Set(uniqueTitles?.map(c => c.career_title_ar)).size;

  console.log(`\n\n📊 إحصائيات عامة:`);
  console.log(`إجمالي الوظائف: ${totalCareers}`);
  console.log(`الوظائف الفريدة: ${uniqueCount}`);
  console.log(`نسبة التكرار: ${((1 - uniqueCount / totalCareers) * 100).toFixed(1)}%`);
}

checkDuplicates();
