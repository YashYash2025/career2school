const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🔧 إصلاح أسئلة RIASEC_60_College\n');
  console.log('='.repeat(60) + '\n');
  
  // 1. الحصول على الأداة
  const { data: tool } = await supabase
    .from('assessment_tools')
    .select('*')
    .eq('code', 'RIASEC_60_COLLEGE')
    .single();
  
  if (!tool) {
    console.log('❌ الأداة غير موجودة');
    return;
  }
  
  console.log(`✅ الأداة: ${tool.name_ar}`);
  console.log(`   ID: ${tool.id}\n`);
  
  // 2. حذف الأسئلة الموجودة
  console.log('🗑️  حذف الأسئلة القديمة...\n');
  
  const { error: deleteError } = await supabase
    .from('assessment_questions')
    .delete()
    .eq('tool_id', tool.id);
  
  if (deleteError) {
    console.log('❌ خطأ في الحذف:', deleteError.message);
  } else {
    console.log('✅ تم حذف الأسئلة القديمة\n');
  }
  
  // 3. قراءة ملف CSV
  console.log('📖 قراءة ملف CSV...\n');
  
  const csvContent = fs.readFileSync('New RIASEC/01-RIASEC_60_College.csv', 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const dimensionMap = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional'
  };
  
  const dimensionArabicMap = {
    'R': 'الواقعي',
    'I': 'الاستقصائي',
    'A': 'الفني',
    'S': 'الاجتماعي',
    'E': 'المغامر',
    'C': 'التقليدي'
  };
  
  const questions = [];
  let orderCounter = 1;
  
  // تخطي السطر الأول (العناوين)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // تقسيم السطر مع مراعاة الفواصل داخل الاقتباسات
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(curre);
;
  }s.exit(1)   proces
 );❌ خطأ:', erre.error('\nsol
    con {rr =>tch(e  })
  .cat(0);
rocess.exi');
    pتهت العملية\n✅ ان('ogsole.lcon
    {(() => 
  .then

main();
  }
} 60`)ً منt} بدلا{counسئلة $ الأحذير: عدد⚠️  تe.log(`\n  consol
  lse { } eدة');
 60 موجوسئلة الـع الأمياء بنجاح! جنته\n🎉 تم الاnsole.log('co) {
    = 60ount ==
  if (c t(60));
 earepn' + '='.e.log('\
  consol  
});ال`);
  unt} سؤ: ${co{dim} $  le.log(`
    consocount]) => {(([dim, ).forEach.sort(bution)distrit.entries(
  Objec:');عدسب البع حلتوزيole.log('📊 ا 
  cons});
 
   1; +|| 0)sion] q.dimenution[ = (distrib.dimension][qstribution> {
    di =s.forEach(q allQuestion;
 n = {}iodistribut
  const حسب البعدتوزيع   
  // }\n`);
: ${countأسئلة✅ إجمالي ال(`og
  console.l  );
', tool.id'tool_id
    .eq(: 'exact' }){ countct('*', lese')
    .questionssment_('asses.frome
    abas = await supns, count }ioQuestallta: const { da');
  
  هائي...\n🔍 التحقق النole.log('\n cons;
 ))repeat(60g('='..lo consoleنهائي
 ال/ 5. التحقق  /);
  
 \n`احال بنجسؤount}  ${successCافة\n✅ تم إضe.log(`nsol
  co);
  }
  , 100)ut(resolveimeo=> setT(resolve  Promiseait new   awغير
   // تأخير ص }
    
       }
 ؤال`);
    1} سفة ${i + إضاتمg(`✅ console.lo{
        % 10 === 0)  + 1)   if ((int++;
    ssCou
      succe { } else
   ge}`);essaerror.m1}: ${i + ${g(`❌ سؤال e.lo     consol{
 error) 
    if ();
        .select(ion)
  sert(quest
      .instions')ssment_quefrom('asse    .pabase
  = await sua, error }  datnst {co
    ];
    ns[iestioion = qunst quest {
    coength; i++)ions.lquest i = 0; i <  (letbatch
  forكل الـ  لتجنب مشاعلى حدةل سؤال ضافة ك
  
  // إt = 0;uccessCoun
  let s n');
 لأسئلة...\ة ا💾 إضافlog('e.  consolسئلة
ضافة الأ. إ 4//`);
  
  \nngth}les.stionة: ${que  عدد الأسئلog(`   console.l
  }
  
 }
    }     });

        : falseoredsce_s_revers       iسلسل
   د متاستخدام عدا, // unter++ex: orderCoindr_de        or 1.0,
   weight:       ype],
  bicMap[timensionArasion: d    subdimen],
      onMap[typen: dimensiimensio   d           },
 4, 5]
     : [1, 2, 3, ues       val'],
     \'accord dout à faitccord', 'T, 'D\'a, 'Neutre'ord'\'acc'Pas d\'accord',  du tout d: ['Pasabels_fr         l
   ,ngly Agree']ee', 'Stro', 'Agral'Neutr', 'Disagreeree', isag['Strongly Dels_en: lab           بشدة'],
  افق', 'أوافق'أو 'محايد', أوافق', بشدة', 'لا فق أوا['لاar:    labels_   
      ,le: 5       sca
     ptions: {   o      
 rt_5',pe: 'likeestion_tyqu      
    nch,freon_fr:     questiish,
       engln_en:stio      que
     arabic,n_ar:uestio      qid,
    l_id: tool.   too{
       s.push(  questionh) {
       englis arabic &&ype && if (id && t 
     ';
     : ', '') /gce(/^"|"$].replas[4[4] ? part= partsnch st fre    con);
  "|"$/g, ''].replace(/^arts[3english = p    const );
  "$/g, ''lace(/^"|arts[2].repic = pnst arab    co[1];
  ts type = par      const];
= parts[0 id   const
     >= 4) {parts.lengthf (
    i);
    rrent.trim()sh(cu.pu parts
    }
   
      }ar;+= chrrent 
        cu   } else {t = '';
   en      curr
  nt.trim());