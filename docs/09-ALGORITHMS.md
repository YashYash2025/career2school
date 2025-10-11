# 🧮 Algorithms - الخوارزميات

## 📋 نظرة عامة

توثيق شامل للخوارزميات المستخدمة في حساب نتائج التقييمات.

---

## 🧠 Big5International Algorithm:

### **المدخلات:**
```javascript
{
  responses: {
    q1: 4,  // 1-5 (ليكرت 5 نقاط)
    q2: 2,
    q3: 5,
    // ... 60 سؤال
  },
  questions: [
    {
      id: 'uuid',
      dimension: 'O',  // O, C, E, A, N
      order_index: 1,
      is_reverse_scored: false
    },
    // ... 60 سؤال
  ]
}
```

### **الخطوات:**

#### **1. حساب الدرجة لكل سؤال:**
```javascript
scoreQuestion(answer, isReverse) {
  const numAnswer = parseInt(answer);
  
  if (isReverse) {
    return 6 - numAnswer;  // عكس: 1→5, 2→4, 3→3, 4→2, 5→1
  }
  return numAnswer;
}
```

#### **2. حساب الدرجة لكل بُعد:**
```javascript
for (const trait of ['O', 'C', 'E', 'A', 'N']) {
  const traitQuestions = questions.filter(q => q.dimension === trait);
  let totalScore = 0;
  let answeredCount = 0;

  traitQuestions.forEach(q => {
    const answer = responses[`q${q.order_index}`];
    const score = scoreQuestion(answer, q.is_reverse_scored);
    totalScore += score;
    answeredCount++;
  });

  // النسبة المئوية
  const maxScore = answeredCount * 5;  // كل سؤال من 1-5
  const percentage = (totalScore / maxScore) * 100;
}
```

#### **3. تحديد المستوى:**
```javascript
getLevel(percentage) {
  if (percentage >= 67) return 'high';     // مرتفع
  if (percentage >= 34) return 'moderate'; // متوسط
  return 'low';                            // منخفض
}
```

#### **4. بناء Profile Code:**
```javascript
// مثال: OCEAN-High-High-Moderate-High-Low
const levels = ['high', 'high', 'moderate', 'high', 'low'];
const levelLabels = levels.map(l => 
  l.charAt(0).toUpperCase() + l.slice(1)
);
profile_code = 'OCEAN-' + levelLabels.join('-');
```

#### **5. توليد Profile Name:**
```javascript
generateProfileName(results) {
  const top2 = results.ranking.slice(0, 2);
  
  const profileNames = {
    'O-high': { ar: 'المبدع', en: 'The Creative' },
    'C-high': { ar: 'المنظم', en: 'The Organized' },
    'E-high': { ar: 'الاجتماعي', en: 'The Social' },
    'A-high': { ar: 'المتعاون', en: 'The Cooperative' },
    'N-low': { ar: 'المستقر', en: 'The Stable' }
  };
  
  const names = [];
  top2.forEach(trait => {
    const key = `${trait.trait}-${trait.level}`;
    if (profileNames[key]) {
      names.push(profileNames[key]);
    }
  });
  
  if (names.length >= 2) {
    return {
      ar: `${names[0].ar} ${names[1].ar}`,
      en: `${names[0].en} ${names[1].en}`
    };
  }
  
  return {
    ar: 'الشخصية المتوازنة',
    en: 'The Balanced Personality'
  };
}
```

#### **6. حساب المؤشرات:**
```javascript
calculateIndices(scores) {
  const percentages = Object.values(scores).map(s => s.percentage);
  const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const max = Math.max(...percentages);
  const min = Math.min(...percentages);
  
  return {
    // قوة الاهتمامات
    profile_elevation: {
      score: avg,
      interpretation: avg > 60 ? 'اهتمامات واسعة' : 
                      avg > 40 ? 'اهتمامات متوسطة' : 
                      'اهتمامات مركزة'
    },
    
    // وضوح الملف
    differentiation: {
      score: max - min,
      interpretation: (max - min) > 40 ? 'ملف واضح ومحدد' : 
                      (max - min) > 20 ? 'متوسط الوضوح' : 
                      'متنوع'
    },
    
    // التوافق
    consistency: {
      score: 100 - (max - min) / max * 100,
      interpretation: 'مستوى التوافق بين الأبعاد'
    }
  };
}
```

### **المخرجات:**
```javascript
{
  raw_scores: {
    O: {
      raw: 45,
      max: 60,
      percentage: 75.0,
      level: 'high',
      level_ar: 'مرتفع',
      level_en: 'High',
      interpretation: 'منفتح على التجارب الجديدة...',
      questions_answered: 12
    },
    C: {...},
    E: {...},
    A: {...},
    N: {...}
  },
  profile_code: 'OCEAN-High-High-Moderate-High-Low',
  profile_name: {
    ar: 'المبدع الاجتماعي',
    en: 'The Creative Social',
    fr: 'Le Social Créatif'
  },
  profile_levels: {
    O: 'high',
    C: 'high',
    E: 'moderate',
    A: 'high',
    N: 'low'
  },
  ranking: [
    {
      trait: 'O',
      name_ar: 'الانفتاح على الخبرة',
      name_en: 'Openness',
      percentage: 75.0,
      level: 'high'
    },
    // ... باقي الأبعاد مرتبة
  ],
  summary: 'شخصيتك تتميز بارتفاع الانفتاح (75%) مما يعني...',
  indices: {
    profile_elevation: {
      score: 65.5,
      interpretation: 'اهتمامات واسعة'
    },
    differentiation: {
      score: 35.2,
      interpretation: 'متوسط الوضوح'
    },
    consistency: {
      score: 78.3,
      interpretation: 'مستوى التوافق بين الأبعاد'
    }
  }
}
```

---

## 🎯 RIASECInternational Algorithm:

### **المدخلات:**
```javascript
{
  responses: {
    R1: 1,  // 0 = لا أحب/محايد، 1 = أحب
    R2: 0,
    R3: 1,
    I1: 1,
    // ... 60 سؤال
  },
  opts: {
    country: 'international',  // 'international' | 'egypt' | 'saudi'
    version: 'medium',         // 'short' | 'medium' | 'full'
    lambda: 0.35,              // عقوبة المسافات
    sdGate: 1.0                // حد السماح بالأزواج المتقابلة
  }
}
```

### **الخطوات:**

#### **1. حساب الدرجة لكل نوع:**
```javascript
for (const type of ['R', 'I', 'A', 'S', 'E', 'C']) {
  let raw = 0;
  let liked = [];
  
  Object.keys(responses).forEach(key => {
    if (key.startsWith(type)) {
      const value = responses[key];
      // نظام [0, 0, 1]: فقط "أحب" = 1 يضيف للدرجة
      if (value === 1) {
        raw += 1;
        liked.push(key);
      }
    }
  });
  
  // النسبة المئوية
  const questionsPerType = 10;  // في نسخة 60 سؤال
  const maxScore = questionsPerType;
  const percentage = (raw / maxScore) * 100;
  
  // Z-Score (مقارنة بالمعايير)
  const z = ((raw - norms[type].mean) / norms[type].sd) * attenuation;
  
  // Percentile
  const percentile = percentileFromZ(z);
}
```

#### **2. حساب Z-Score:**
```javascript
// المعايير الدولية
norms = {
  international: {
    R: {mean: 30, sd: 12},
    I: {mean: 24, sd: 10},
    A: {mean: 20, sd: 9},
    S: {mean: 26, sd: 11},
    E: {mean: 22, sd: 9},
    C: {mean: 25, sd: 10}
  }
};

// حساب Z-Score
z = ((raw - norms[type].mean) / norms[type].sd) * attenuation;

// Attenuation للنسخ الأقصر
attenuation = version === 'short' ? 0.85 : 
              version === 'medium' ? 0.92 : 
              1.00;
```

#### **3. تحويل Z إلى Percentile:**
```javascript
percentileFromZ(z) {
  // Normal CDF approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const p = (z > 0) ? (1 - prob) : prob;
  return Math.round(p * 100);
}
```

#### **4. اختيار Holland Code (الكود الثلاثي):**
```javascript
// نظام مبسط: أعلى 3 أنواع مباشرة
chooseTriad(sortedByRaw, zMap, opts) {
  const top3 = sortedByRaw.slice(0, 3).map(([t]) => t);
  const hollandCode = top3.join('');  // مثال: "RIA"
  
  // حساب معلومات الكود
  const zSum = top3.reduce((sum, t) => sum + zMap[t], 0);
  const consistency = calcConsistency(hollandCode);
  
  return {
    code: hollandCode,
    types: top3,
    score: zSum,
    consistency: consistency.score,
    explanation: `الكود ${hollandCode} تم اختياره بناءً على أعلى 3 درجات`
  };
}
```

#### **5. حساب Consistency (التوافق):**
```javascript
calcConsistency(code) {
  const [a, b, c] = code.split('');
  
  // مصفوفة مسافات السداسي
  const hexDist = {
    R: {R:0, I:1, A:2, S:3, E:2, C:1},
    I: {R:1, I:0, A:1, S:2, E:3, C:2},
    A: {R:2, I:1, A:0, S:1, E:2, C:3},
    S: {R:3, I:2, A:1, S:0, E:1, C:2},
    E: {R:2, I:3, A:2, S:1, E:0, C:1},
    C: {R:1, I:2, A:3, S:2, E:1, C:0}
  };
  
  const dists = [
    hexDist[a][b],
    hexDist[a][c],
    hexDist[b][c]
  ];
  
  const avg = (dists[0] + dists[1] + dists[2]) / 3;
  const score = 100 - (avg * 25);
  
  return {
    score: score,
    interpretation: score > 75 ? 'توافق عالٍ' : 
                    score > 50 ? 'توافق متوسط' : 
                    'توافق منخفض'
  };
}
```

#### **6. حساب المؤشرات:**
```javascript
// 1. Differentiation (وضوح الملف)
calcDifferentiation(sortedTypes) {
  const highest = sortedTypes[0][1].raw;
  const lowest = sortedTypes[5][1].raw;
  const score = ((highest - lowest) / 60) * 100;
  
  return {
    score: score,
    interpretation: score > 40 ? 'ملف واضح ومحدد' : 
                    score > 20 ? 'متوسط الوضوح' : 
                    'متنوع/غير محدد'
  };
}

// 2. Congruence (المناسبة)
calcCongruence(code) {
  const first = code[0];
  const allowed = {
    R: ['RIA', 'RIC', 'RIS', 'RIE', 'RCI', 'RCE'],
    I: ['IRA', 'IRC', 'IRS', 'IRE', 'IAR', 'IAS'],
    A: ['ARI', 'ARS', 'AIR', 'AIS', 'ASR', 'ASI'],
    S: ['SAI', 'SAR', 'SIA', 'SIR', 'SRA', 'SRI'],
    E: ['ESA', 'ESI', 'EAS', 'EAI', 'EIS', 'EIA'],
    C: ['CRI', 'CRE', 'CIR', 'CIE', 'CER', 'CEI']
  };
  
  const high = allowed[first].includes(code);
  const score = high ? 90 : 50;
  
  return {
    score: score,
    interpretation: high ? 'مناسبة عالية' : 'مناسبة متوسطة'
  };
}

// 3. Profile Elevation (قوة الاهتمامات)
calcElevation(typeMap) {
  const total = Object.values(typeMap).reduce((s, t) => s + t.raw, 0);
  const avg = total / 6;
  const score = (avg / 30) * 100;
  
  return {
    score: score,
    interpretation: score > 60 ? 'اهتمامات واسعة' : 
                    score > 40 ? 'اهتمامات متوسطة' : 
                    'اهتمامات مركّزة'
  };
}
```

#### **7. حساب المجالات الفرعية:**
```javascript
subdomainScores(responses, type, questionsPerType) {
  const result = {};
  const questionsPerSubdomain = Math.ceil(questionsPerType / 3);
  const maxSubdomainScore = questionsPerSubdomain;
  
  const typeResponses = Object.keys(responses)
    .filter(key => key.startsWith(type))
    .sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));
  
  let subdomainIndex = 0;
  for (const [name] of Object.entries(subdomains[type])) {
    let score = 0;
    const startIndex = subdomainIndex * questionsPerSubdomain;
    const endIndex = Math.min(startIndex + questionsPerSubdomain, typeResponses.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      if (typeResponses[i]) {
        score += (responses[typeResponses[i]] || 0);
      }
    }
    
    const percentage = maxSubdomainScore > 0 ? 
      ((score / maxSubdomainScore) * 100) : 0;
    
    result[name] = { score, percentage };
    subdomainIndex++;
  }
  
  return result;
}
```

### **المخرجات:**
```javascript
{
  params: {
    country: 'international',
    version: 'medium',
    lambda: 0.35,
    sdGate: 1.0
  },
  norms_used: 'international',
  raw_scores: {
    R: {
      raw: 8,
      percentage: 80.0,
      z: 1.5,
      percentile: 93,
      liked: ['R1', 'R3', 'R5', 'R7', 'R9', 'R10', 'R12', 'R15'],
      subdomains: {
        'ميكانيكي/تقني': {score: 3, percentage: 75.0},
        'زراعي/طبيعي': {score: 2, percentage: 50.0},
        'بدني/خارجي': {score: 3, percentage: 75.0}
      },
      interpretation: 'اهتمام قوي بالعمل اليدوي/العملي'
    },
    I: {...},
    A: {...},
    S: {...},
    E: {...},
    C: {...}
  },
  ranking: [
    {type: 'R', name: 'Realistic', raw: 8, z: 1.5, pct: 93},
    {type: 'I', name: 'Investigative', raw: 7, z: 1.2, pct: 88},
    {type: 'A', name: 'Artistic', raw: 6, z: 0.9, pct: 82},
    {type: 'S', name: 'Social', raw: 5, z: 0.5, pct: 69},
    {type: 'E', name: 'Enterprising', raw: 4, z: 0.2, pct: 58},
    {type: 'C', name: 'Conventional', raw: 3, z: -0.1, pct: 46}
  ],
  holland_code: 'RIA',
  triad_details: {
    winner: {
      code: 'RIA',
      types: ['R', 'I', 'A'],
      score: 3.6,
      consistency: 75.0,
      explanation: 'الكود RIA تم اختياره بناءً على أعلى 3 درجات'
    },
    top5: [...],
    all_candidates: [...],
    rule_notes: {
      opposite_pairs_banned: 'Yes (مسافة=3) إلا عند strongLead≥sdGate',
      strongLead: '0.30',
      sdGate: 1.0
    }
  },
  indices: {
    differentiation: {
      score: 45.5,
      interpretation: 'ملف واضح ومحدد'
    },
    consistency: {
      score: 75.0,
      interpretation: 'توافق عالٍ'
    },
    congruence: {
      score: 90.0,
      interpretation: 'مناسبة عالية'
    },
    profile_elevation: {
      score: 62.3,
      interpretation: 'اهتمامات متوسطة'
    }
  }
}
```

---

## 📊 مقارنة الخوارزميات:

| الميزة | Big5International | RIASECInternational |
|--------|-------------------|---------------------|
| **نظام التقييم** | ليكرت 5 نقاط (1-5) | [0, 0, 1] (لا أحب، محايد، أحب) |
| **الأسئلة المعكوسة** | ✅ موجودة | ❌ غير موجودة |
| **عدد الأبعاد** | 5 (OCEAN) | 6 (RIASEC) |
| **الحد الأقصى للدرجة** | عدد الأسئلة × 5 | عدد الأسئلة × 1 |
| **Z-Score** | ❌ غير مستخدم | ✅ مستخدم |
| **Percentile** | ❌ غير مستخدم | ✅ مستخدم |
| **المعايير** | ❌ غير موجودة | ✅ 3 معايير (دولي، مصر، سعودية) |
| **المجالات الفرعية** | ❌ غير موجودة | ✅ 3 لكل نوع |
| **الكود النهائي** | Profile Code طويل | Holland Code (3 أحرف) |
| **Profile Name** | ✅ يتم توليده | ❌ غير موجود |

---

## 🔬 الصيغ الرياضية:

### **Big5:**
```
النسبة المئوية = (الدرجة الخام / الحد الأقصى) × 100

المستوى = {
  مرتفع    إذا النسبة ≥ 67%
  متوسط    إذا 34% ≤ النسبة < 67%
  منخفض    إذا النسبة < 34%
}

Profile Elevation = متوسط(جميع النسب المئوية)

Differentiation = أعلى نسبة - أقل نسبة

Consistency = 100 - (Differentiation / أعلى نسبة × 100)
```

### **RIASEC:**
```
Z-Score = ((الدرجة الخام - المتوسط) / الانحراف المعياري) × Attenuation

Attenuation = {
  0.85  للنسخة القصيرة (30 سؤال)
  0.92  للنسخة المتوسطة (60 سؤال)
  1.00  للنسخة الكاملة (180 سؤال)
}

Percentile = Normal_CDF(Z-Score) × 100

Differentiation = ((أعلى درجة - أقل درجة) / 60) × 100

Consistency = 100 - (متوسط المسافات × 25)

Profile Elevation = (متوسط الدرجات / 30) × 100
```

---

**آخر تحديث:** 10 أكتوبر 2025
