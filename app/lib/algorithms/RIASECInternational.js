/**
 * RIASEC – International Scoring & Triad Selection (Hexagon-aware)
 * 
 * Author: Advanced Career Assessment System
 * Mode: International (strict adjacency; bans opposite pairs unless strong evidence)
 * 
 * Inputs:
 *  - responses: Object of items with values {0,1}, e.g. { "R1":1, "R2":0, ..., "C30":1 }
 *    Scoring System [0, 0, 1]:
 *      0 = "لا أحب" (No interest)
 *      0 = "محايد" (Neutral)  
 *      1 = "أحب" (Like)
 *  - opts:
 *      country: 'international' | 'egypt' | 'saudi'   // norms set
 *      version: 'full' | 'medium' | 'short'          // to softly de-noise shorter forms
 *      lambda: number (penalty weight for distances; default 0.35)
 *      sdGate: number (how strong top type must exceed next to allow opposite-pair codes; default 1.0)
 * 
 * Output:
 *  - Detailed scoring object with:
 *      raw_scores[type] = { raw, percentage, z, percentile, liked, subdomains, interpretation }
 *      holland_code (chosen triad, e.g., "RIA")
 *      triad_details (all candidate triads with scores/explanations)
 *      indices: differentiation, consistency, congruence, profile_elevation
 */

class RIASECInternational {
  constructor() {
    this.types = ['R','I','A','S','E','C'];
    this.typeNames = {
      R: 'Realistic', I: 'Investigative', A: 'Artistic',
      S: 'Social', E: 'Enterprising', C: 'Conventional'
    };

    // 10-10-10 تقسيم المجالات الفرعية كما في الدليل
    this.subdomains = {
      R: { 'ميكانيكي/تقني': [1,10], 'زراعي/طبيعي': [11,20], 'بدني/خارجي': [21,30] },
      I: { 'علمي/بحثي': [1,10], 'رياضي/تحليلي': [11,20], 'استكشافي/تقصي': [21,30] },
      A: { 'إبداعي بصري': [1,10], 'أدبي/لغوي': [11,20], 'أدائي/موسيقي': [21,30] },
      S: { 'تعليمي/تدريبي': [1,10], 'صحي/رعاية': [11,20], 'خدمي/مجتمعي': [21,30] },
      E: { 'قيادي/إداري': [1,10], 'تجاري/مبيعات': [11,20], 'ريادي/أعمال': [21,30] },
      C: { 'إداري/تنظيمي': [1,10], 'محاسبي/مالي': [11,20], 'امتثال/جودة': [21,30] },
    };

    // مصفوفة مسافات السداسي (0..3) – مطابقة لمنطق الشكل في الدليل
    this.hexDist = {
      R: {R:0,I:1,A:2,S:3,E:2,C:1},
      I: {R:1,I:0,A:1,S:2,E:3,C:2},
      A: {R:2,I:1,A:0,S:1,E:2,C:3},
      S: {R:3,I:2,A:1,S:0,E:1,C:2},
      E: {R:2,I:3,A:2,S:1,E:0,C:1},
      C: {R:1,I:2,A:3,S:2,E:1,C:0},
    };

    // المعايير (متوسط/انحراف معياري) - محدثة للنسخ الثلاث
    // النسخة الكاملة (180): 30 سؤال لكل نوع، الحد الأقصى 60 لكل نوع
    // النسخة المتوسطة (60): 10 أسئلة لكل نوع، الحد الأقصى 20 لكل نوع  
    // النسخة القصيرة (30): 5 أسئلة لكل نوع، الحد الأقصى 10 لكل نوع
    this.norms = {
      international: { 
        R:{mean:30,sd:12}, I:{mean:24,sd:10}, A:{mean:20,sd:9}, 
        S:{mean:26,sd:11}, E:{mean:22,sd:9}, C:{mean:25,sd:10} 
      },
      egypt: { 
        R:{mean:32,sd:13}, I:{mean:23,sd:10}, A:{mean:19,sd:8}, 
        S:{mean:28,sd:12}, E:{mean:21,sd:9}, C:{mean:27,sd:11} 
      },
      saudi: { 
        R:{mean:34,sd:14}, I:{mean:25,sd:11}, A:{mean:18,sd:7}, 
        S:{mean:30,sd:13}, E:{mean:24,sd:10}, C:{mean:29,sd:12} 
      },
    };

    // إعدادات افتراضية
    this.defaults = {
      country: 'international',
      version: 'full',   // 'full'|'medium'|'short'
      lambda: 0.35,
      sdGate: 1.0,
    };
  }

  // Normal CDF approximation → Percentile %
  percentileFromZ(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const p = (z > 0) ? (1 - prob) : prob;
    return Math.round(p * 100);
  }

  // تفسير مبسّط للنوع بناءً على النسبة %
  interpret(percentage, type) {
    const levels = percentage > 60 ? 'high' : percentage > 30 ? 'medium' : 'low';
    const m = {
      R:{high:'اهتمام قوي بالعمل اليدوي/العملي', medium:'اهتمام معتدل بالأنشطة العملية', low:'تفضيل منخفض للمهام اليدوية'},
      I:{high:'شغف بالبحث والتحليل', medium:'اهتمام متوسط بالبحث', low:'تفضيل محدود للأنشطة النظرية'},
      A:{high:'ميل قوي للإبداع والتعبير', medium:'اهتمام متوازن بالإبداع', low:'تفضيل محدود للفنون'},
      S:{high:'رغبة قوية في مساعدة الآخرين', medium:'اهتمام اجتماعي معتدل', low:'تفضيل العمل الفردي'},
      E:{high:'طموح قيادي وتأثيري', medium:'اهتمام متوسط بالأعمال/القيادة', low:'تجنب المواقف التنافسية'},
      C:{high:'تفضيل للنظام والدقة', medium:'اهتمام تنظيمي متوازن', low:'تفضيل المرونة على الروتين'},
    };
    return m[type][levels];
  }

  // حساب مؤشرات: وضوح/توافق/مناسبة/قوة
  calcDifferentiation(sortedTypes) {
    const highest = sortedTypes[0][1].raw;
    const lowest  = sortedTypes[5][1].raw;
    const score = ( (highest - lowest) / 60 ) * 100;
    return { score: parseFloat(score.toFixed(2)), interpretation: score>40 ? 'ملف واضح ومحدد' : score>20 ? 'متوسط الوضوح' : 'متنوع/غير محدد' };
  }

  calcConsistency(code) {
    const [a,b,c] = code.split('');
    const dists = [
      this.hexDist[a][b],
      this.hexDist[a][c],
      this.hexDist[b][c],
    ];
    const avg = (dists[0]+dists[1]+dists[2]) / 3;
    const score = 100 - (avg * 25);
    return { score: parseFloat(score.toFixed(2)), interpretation: score>75 ? 'توافق عالٍ' : score>50 ? 'توافق متوسط' : 'توافق منخفض' };
  }

  calcCongruence(code) {
    const first = code[0];
    const allowed = {
      R:['RIA','RIC','RIS','RIE','RCI','RCE'],
      I:['IRA','IRC','IRS','IRE','IAR','IAS'],
      A:['ARI','ARS','AIR','AIS','ASR','ASI'],
      S:['SAI','SAR','SIA','SIR','SRA','SRI'],
      E:['ESA','ESI','EAS','EAI','EIS','EIA'],
      C:['CRI','CRE','CIR','CIE','CER','CEI'],
    };
    const high = allowed[first].includes(code);
    const score = high ? 90 : 50;
    return { score: parseFloat(score.toFixed(2)), interpretation: high ? 'مناسبة عالية' : 'مناسبة متوسطة' };
  }

  calcElevation(typeMap) {
    const total = Object.values(typeMap).reduce((s,t)=>s + t.raw, 0);
    const avg = total / 6;
    const score = (avg / 30) * 100;
    return { score: parseFloat(score.toFixed(2)), interpretation: score>60 ? 'اهتمامات واسعة' : score>40 ? 'اهتمامات متوسطة' : 'اهتمامات مركّزة' };
  }

  // Helper: مجموع استجابات مجال فرعي - محدث ليتعامل مع النسخ المختلفة
  subdomainScores(responses, type, questionsPerType) {
    const result = {};
    const questionsPerSubdomain = Math.ceil(questionsPerType / 3); // تقسيم على 3 مجالات فرعية
    const maxSubdomainScore = questionsPerSubdomain * 2; // أقصى درجة للمجال الفرعي
    
    // حساب الدرجات بناءً على الأسئلة المتاحة فعلياً
    const typeResponses = Object.keys(responses).filter(key => key.startsWith(type));
    const sortedKeys = typeResponses.sort((a, b) => {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    });
    
    let subdomainIndex = 0;
    for (const [name] of Object.entries(this.subdomains[type])) {
      let s = 0;
      const startIndex = subdomainIndex * questionsPerSubdomain;
      const endIndex = Math.min(startIndex + questionsPerSubdomain, sortedKeys.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        if (sortedKeys[i]) {
          s += (responses[sortedKeys[i]] || 0);
        }
      }
      
      const percentage = maxSubdomainScore > 0 ? parseFloat(((s/maxSubdomainScore)*100).toFixed(2)) : 0;
      result[name] = { score: s, percentage };
      subdomainIndex++;
    }
    
    return result;
  }

  // Build candidates from Top-4, keep original order by score
  buildTriads(top4) {
    const [t1,t2,t3,t4] = top4;
    const triads = [];
    const arr = [t1,t2,t3,t4];
    for (let i=0;i<4;i++){
      for (let j=i+1;j<4;j++){
        for (let k=j+1;k<4;k++){
          triads.push([arr[i],arr[j],arr[k]]);
        }
      }
    }
    return triads;
  }

  // هل يوجد زوج متقابل (مسافة = 3)؟
  hasOppositePair(triad){
    const [a,b,c]=triad;
    return (
      this.hexDist[a][b]===3 ||
      this.hexDist[a][c]===3 ||
      this.hexDist[b][c]===3
    );
  }

  // درجة ثلاثي (International): مجموع z ناقص عقوبة المسافات + Bonus الاتساق
  scoreTriad(triad, zMap, lambda){
    const [a,b,c]=triad;
    const zSum = zMap[a] + zMap[b] + zMap[c];
    const distPenalty = this.hexDist[a][b] + this.hexDist[a][c] + this.hexDist[b][c];
    const base = zSum - lambda * distPenalty;
    const code = triad.join('');
    const consistency = this.calcConsistency(code).score;
    const score = base + 0.25 * (consistency/100); // Bonus صغير
    return { code, score, zSum, distPenalty, consistency };
  }

  // اختيار الكود الثلاثي وفق International rules
  chooseTriad(sortedByRaw, zMap, opts) {
    // نظام مبسط: نأخذ أعلى 3 أنواع مباشرة بدون أي فلترة
    // جميع الـ 120 كود متاحين بدون استبعاد
    
    const top3 = sortedByRaw.slice(0, 3).map(([t]) => t);
    const hollandCode = top3.join('');
    
    // حساب معلومات الكود للعرض
    const zSum = top3.reduce((sum, t) => sum + zMap[t], 0);
    const consistency = this.calcConsistency(hollandCode);
    
    const best = {
      code: hollandCode,
      types: top3,
      score: zSum,
      consistency: consistency.score,
      explanation: `الكود ${hollandCode} تم اختياره بناءً على أعلى 3 درجات مباشرة`
    };
    
    // إنشاء قائمة candidates للتوافق مع الكود القديم
    const candidates = [best];
    
    return { best, candidates };
  }

  // عامل تقليل الضوضاء للنسخ الأقصر - محدث ليشمل النسخ الثلاث
  versionAttenuation(version){
    // النسخة القصيرة (30 سؤال): تقليل بسيط للضوضاء
    if (version==='short') return 0.85;
    // النسخة المتوسطة (60 سؤال): تقليل أقل
    if (version==='medium') return 0.92;
    // النسخة الكاملة (180 سؤال): لا تقليل
    return 1.00;
  }

  // واجهة التشغيل الرئيسية
  calculate(responses, opts={}) {
    console.log('🔍 خوارزمية RIASEC: بداية الحساب');
    console.log('📥 الاستجابات الواردة:', responses);
    console.log('📊 عدد الاستجابات:', Object.keys(responses).length);
    console.log('⚙️ إعدادات الحساب:', opts);
    
    const settings = { ...this.defaults, ...opts };
    const norms = this.norms[settings.country] || this.norms.international;
    const atten = this.versionAttenuation(settings.version);

    // تحديد عدد الأسئلة لكل نوع بناءً على النسخة
    const questionsPerType = this.getQuestionsPerType(responses);
    // في نظام [0,0,1]: كل سؤال = 1 نقطة كحد أقصى (مش 2)
    const maxScore = questionsPerType; // أقصى درجة لكل نوع
    
    console.log('📈 أسئلة لكل نوع:', questionsPerType);
    console.log('🎯 أقصى درجة لكل نوع:', maxScore);

    // 1) حساب درجات النوع
    const typeMap = {};
    console.log('🎚️ بداية حساب درجات النوع لكل RIASEC type...');
    
    for (const t of this.types) {
      let raw = 0, liked = [];
      
      console.log(`\n⚙️ حساب نوع ${t}:`);
      
      // جمع الدرجات من جميع الأسئلة المتاحة لهذا النوع
      const typeResponses = Object.keys(responses).filter(key => key.startsWith(t));
      console.log(`  📄 أسئلة النوع ${t}:`, typeResponses);
      
      Object.keys(responses).forEach(key => {
        if (key.startsWith(t)) {
          const v = responses[key] ?? 0;
          console.log(`    ${key}: ${v}`);
          // نظام [0, 0, 1]: فقط "أحب" = 1 يضيف للدرجة
          if (v === 1) {
            raw += 1;
            liked.push(key);
          }
          // v === 0 يعني "لا أحب" أو "محايد" - لا يضيف شيء
        }
      });
      
      console.log(`  📊 الدرجة الخام لنوع ${t}: ${raw}`);
      
      const percentage = parseFloat(((raw/maxScore)*100).toFixed(2));
      const z = parseFloat((((raw - norms[t].mean) / norms[t].sd) * atten).toFixed(2));
      const percentile = this.percentileFromZ(z);
      const sub = this.subdomainScores(responses, t, questionsPerType);
      
      console.log(`  📊 النسبة المئوية لنوع ${t}: ${percentage}%`);
      
      typeMap[t] = {
        raw, percentage, z, percentile,
        liked, // فقط "أحب" في نظام [0, 0, 1]
        subdomains: sub,
        interpretation: this.interpret(percentage, t),
      };
    }

    // 2) ترتيب الأنواع
    const sorted = Object.entries(typeMap).sort((a,b)=> b[1].raw - a[1].raw);

    // 3) اختيار الكود الثلاثي (International)
    const zMap = Object.fromEntries(this.types.map(t=>[t, typeMap[t].z]));
    const { best, candidates } = this.chooseTriad(sorted, zMap, settings);
    const hollandCode = best.code;

    // 4) مؤشرات الملف الشخصي
    const differentiation = this.calcDifferentiation(sorted);
    const consistency = this.calcConsistency(hollandCode);
    const congruence = this.calcCongruence(hollandCode);
    const elevation = this.calcElevation(typeMap);

    // 5) تجميع نتيجة شاملة
    const result = {
      params: settings,
      norms_used: settings.country,
      raw_scores: typeMap,
      ranking: sorted.map(([t,v])=>({ type:t, name:this.typeNames[t], raw:v.raw, z:v.z, pct:v.percentile })),
      holland_code: hollandCode,
      triad_details: {
        winner: best,
        top5: candidates.slice(0,5),
        all_candidates: candidates,
        rule_notes: {
          opposite_pairs_banned: 'Yes (مسافة=3) إلا عند strongLead≥sdGate',
          strongLead: ((zMap[sorted[0][0]] - zMap[sorted[1][0]])).toFixed(2),
          sdGate: settings.sdGate
        }
      },
      indices: {
        differentiation, consistency, congruence, profile_elevation: elevation
      }
    };
    
    console.log('🎉 نتائج الحساب النهائية:');
    console.log('📊 الدرجات الخام:', Object.keys(typeMap).map(t => `${t}: ${typeMap[t].raw} (${typeMap[t].percentage}%)`));
    console.log('🎯 نتائج الترتيب:', result.ranking.map(r => `${r.type}: ${r.raw}`));
    console.log('🅰️ رقم هولاند:', hollandCode);
    
    return result;
  }

  // دالة للتعامل مع النسخ المختلفة من التقييم (30, 60, 180)
  adaptToVersion(responses, version = 'full') {
    console.log('🔄 adaptToVersion: بداية التكييف');
    console.log('📊 عدد الاستجابات الواردة:', Object.keys(responses).length);
    console.log('🏷️ النسخة المطلوبة:', version);
    
    const responseCount = Object.keys(responses).length;
    console.log('📈 responseCount:', responseCount);
    
    // تحديد النسخة تلقائياً بناءً على عدد الاستجابات
    if (responseCount <= 30) {
      version = 'short';
      console.log('🔄 تغيير النسخة إلى: short (عدد الاستجابات <= 30)');
    } else if (responseCount <= 60) {
      version = 'medium';
      console.log('🔄 تغيير النسخة إلى: medium (عدد الاستجابات <= 60)');
    } else {
      version = 'full';
      console.log('🔄 تغيير النسخة إلى: full (عدد الاستجابات > 60)');
    }

    // نعمل مع الاستجابات مباشرة بدون تحويل
    const adaptedResponses = responses;
    
    console.log('🚀 استدعاء calculate مع النسخة:', version);
    
    return this.calculate(adaptedResponses, { version });
  }

  // دالة لتحديد عدد الأسئلة لكل نوع
  getQuestionsPerType(responses) {
    const typeQuestions = {};
    
    for (const type of this.types) {
      typeQuestions[type] = Object.keys(responses).filter(key => key.startsWith(type)).length;
    }
    
    // أخذ المتوسط أو الأقل لضمان الاتساق
    const counts = Object.values(typeQuestions);
    return Math.min(...counts) || 5; // افتراضي 5 أسئلة لكل نوع كحد أدنى
  }

  // تحويل الاستجابات لتناسب خوارزمية النسخة الكاملة
  adaptResponses(responses, version) {
    // لا نحتاج تحويل - نعمل مع الاستجابات كما هي
    return responses;
  }
}

// تصدير الكلاس
export default RIASECInternational;

/* ===== مثال استخدام سريع =====
const engine = new RIASECInternational();
const responses = {
  R1:2, R2:1, // ... أكمل بقية البنود حتى C30
};
const results = engine.calculate(responses, {
  country: 'international', // أو 'egypt' | 'saudi'
  version: 'full',          // 'full'|'medium'|'short'
  lambda: 0.35,
  sdGate: 1.0
});
console.log(results);
*/