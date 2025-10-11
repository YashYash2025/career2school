/**
 * Big Five Personality Inventory - International Scoring Algorithm
 * 
 * Based on IPIP-NEO model
 * 
 * Inputs:
 *  - responses: Object with values {1,2,3,4,5}
 *    1 = لا أوافق بشدة (Strongly Disagree)
 *    2 = لا أوافق (Disagree)
 *    3 = محايد (Neutral)
 *    4 = أوافق (Agree)
 *    5 = أوافق بشدة (Strongly Agree)
 * 
 *  - questions: Array of question objects with is_reverse_scored flag
 * 
 * Output:
 *  - Detailed scoring object with:
 *      raw_scores[trait] = { raw, percentage, level, interpretation }
 *      profile_code (e.g., "OCEAN-High-Moderate-Low-High-Moderate")
 *      recommended_tracks (career recommendations)
 */

class Big5International {
  constructor() {
    this.traits = ['O', 'C', 'E', 'A', 'N'];
    
    this.traitNames = {
      O: { en: 'Openness', ar: 'الانفتاح على الخبرة' },
      C: { en: 'Conscientiousness', ar: 'يقظة الضمير' },
      E: { en: 'Extraversion', ar: 'الانبساطية' },
      A: { en: 'Agreeableness', ar: 'المقبولية' },
      N: { en: 'Neuroticism', ar: 'العصابية' }
    };

    // Bands (from Excel)
    this.bands = {
      high: { min: 67, max: 100, label_ar: 'مرتفع', label_en: 'High' },
      moderate: { min: 34, max: 66, label_ar: 'متوسط', label_en: 'Moderate' },
      low: { min: 0, max: 33, label_ar: 'منخفض', label_en: 'Low' }
    };
  }

  /**
   * حساب الدرجة لسؤال واحد
   */
  scoreQuestion(answer, isReverse) {
    const numAnswer = parseInt(answer);
    if (isNaN(numAnswer) || numAnswer < 1 || numAnswer > 5) {
      return 0; // قيمة افتراضية
    }
    
    if (isReverse) {
      return 6 - numAnswer; // عكس: 1→5, 2→4, 3→3, 4→2, 5→1
    }
    return numAnswer;
  }

  /**
   * تحديد المستوى من النسبة المئوية
   */
  getLevel(percentage) {
    if (percentage >= 67) return 'high';
    if (percentage >= 34) return 'moderate';
    return 'low';
  }

  /**
   * تفسير الدرجة
   */
  interpretScore(trait, level) {
    const interpretations = {
      O: {
        high: 'منفتح على التجارب الجديدة، مبدع، فضولي، يحب التجديد والابتكار',
        moderate: 'متوازن بين الانفتاح والتحفظ، مرن حسب الموقف',
        low: 'تقليدي، يفضل المألوف والروتين، عملي وواقعي'
      },
      C: {
        high: 'منظم، منضبط، مسؤول، يخطط جيداً وينجز المهام بدقة',
        moderate: 'منظم بشكل معتدل، يوازن بين المرونة والانضباط',
        low: 'عفوي، مرن، يفضل التكيف على التخطيط المسبق'
      },
      E: {
        high: 'اجتماعي، نشيط، متحمس، يستمتع بصحبة الآخرين',
        moderate: 'متوازن اجتماعياً، يتكيف مع المواقف المختلفة',
        low: 'هادئ، متحفظ، يفضل العزلة والتجمعات الصغيرة'
      },
      A: {
        high: 'متعاون، متعاطف، لطيف، يهتم بالآخرين ويساعدهم',
        moderate: 'متوازن بين التعاون والاستقلالية',
        low: 'مستقل، موضوعي، تنافسي، يضع الحقائق فوق المشاعر'
      },
      N: {
        high: 'حساس عاطفياً، عرضة للقلق والتوتر، يحتاج لإدارة الضغوط',
        moderate: 'استقرار عاطفي معتدل، بعض التقلبات الطبيعية',
        low: 'مستقر عاطفياً، هادئ، متزن، يتعامل مع الضغوط بفعالية'
      }
    };
    
    return interpretations[trait][level];
  }

  /**
   * الدالة الرئيسية للحساب
   */
  calculate(responses, questions) {
    console.log('🧮 بدء حساب Big5...');
    console.log('📊 عدد الإجابات:', Object.keys(responses).length);
    console.log('📋 عدد الأسئلة:', questions.length);

    const results = {
      raw_scores: {},
      profile_code: '',
      profile_levels: {},
      summary: '',
      recommended_tracks: [],
      indices: {}
    };

    // تجميع الأسئلة حسب البُعد
    const questionsByTrait = {};
    questions.forEach(q => {
      const trait = q.dimension;
      if (!questionsByTrait[trait]) {
        questionsByTrait[trait] = [];
      }
      questionsByTrait[trait].push(q);
    });

    // حساب درجة كل بُعد
    const levels = [];
    
    for (const trait of this.traits) {
      const traitQuestions = questionsByTrait[trait] || [];
      let totalScore = 0;
      let answeredCount = 0;

      traitQuestions.forEach(q => {
        const questionKey = `q${q.order_index}`;
        const answer = responses[questionKey];
        
        if (answer !== undefined && answer !== null) {
          const score = this.scoreQuestion(answer, q.is_reverse_scored);
          totalScore += score;
          answeredCount++;
        }
      });

      // حساب النسبة المئوية
      const maxScore = answeredCount * 5; // كل سؤال من 1-5
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const level = this.getLevel(percentage);
      
      results.raw_scores[trait] = {
        raw: totalScore,
        max: maxScore,
        percentage: parseFloat(percentage.toFixed(2)),
        level: level,
        level_ar: this.bands[level].label_ar,
        level_en: this.bands[level].label_en,
        interpretation: this.interpretScore(trait, level),
        questions_answered: answeredCount
      };

      results.profile_levels[trait] = level;
      levels.push(level);

      console.log(`✅ ${trait}: ${totalScore}/${maxScore} = ${percentage.toFixed(1)}% (${level})`);
    }

    // بناء Profile Code
    const levelLabels = levels.map(l => 
      l.charAt(0).toUpperCase() + l.slice(1)
    );
    results.profile_code = 'OCEAN-' + levelLabels.join('-');

    // ترتيب الأبعاد حسب الدرجة
    results.ranking = this.traits
      .map(trait => ({
        trait,
        name_ar: this.traitNames[trait].ar,
        name_en: this.traitNames[trait].en,
        percentage: results.raw_scores[trait].percentage,
        level: results.raw_scores[trait].level
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // حساب المؤشرات
    results.indices = this.calculateIndices(results.raw_scores);

    // توليد الملخص
    results.summary = this.generateSummary(results);

    // توليد اسم الملف الشخصي
    results.profile_name = this.generateProfileName(results);

    console.log('🎉 تم الحساب بنجاح!');
    console.log('📊 Profile Code:', results.profile_code);
    console.log('👤 Profile Name:', results.profile_name.ar);

    return results;
  }

  /**
   * حساب المؤشرات الإضافية
   */
  calculateIndices(scores) {
    const percentages = Object.values(scores).map(s => s.percentage);
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const max = Math.max(...percentages);
    const min = Math.min(...percentages);
    
    return {
      profile_elevation: {
        score: parseFloat(avg.toFixed(2)),
        interpretation: avg > 60 ? 'اهتمامات واسعة' : avg > 40 ? 'اهتمامات متوسطة' : 'اهتمامات مركزة'
      },
      differentiation: {
        score: parseFloat((max - min).toFixed(2)),
        interpretation: (max - min) > 40 ? 'ملف واضح ومحدد' : (max - min) > 20 ? 'متوسط الوضوح' : 'متنوع'
      },
      consistency: {
        score: parseFloat((100 - (max - min) / max * 100).toFixed(2)),
        interpretation: 'مستوى التوافق بين الأبعاد'
      }
    };
  }

  /**
   * توليد ملخص النتائج
   */
  generateSummary(results) {
    const highest = results.ranking[0];
    const lowest = results.ranking[results.ranking.length - 1];
    
    return `شخصيتك تتميز بارتفاع ${highest.name_ar} (${highest.percentage.toFixed(0)}%) ` +
           `مما يعني ${results.raw_scores[highest.trait].interpretation}. ` +
           `بينما تظهر درجة ${lowest.level === 'low' ? 'منخفضة' : 'معتدلة'} في ${lowest.name_ar}.`;
  }

  /**
   * توليد اسم الملف الشخصي من الأبعاد
   */
  generateProfileName(results) {
    // بناء اسم وصفي من أعلى بُعدين
    const top2 = results.ranking.slice(0, 2);
    
    const profileNames = {
      'O-high': { ar: 'المبدع', en: 'The Creative', fr: 'Le Créatif' },
      'C-high': { ar: 'المنظم', en: 'The Organized', fr: 'L\'Organisé' },
      'E-high': { ar: 'الاجتماعي', en: 'The Social', fr: 'Le Social' },
      'A-high': { ar: 'المتعاون', en: 'The Cooperative', fr: 'Le Coopératif' },
      'N-low': { ar: 'المستقر', en: 'The Stable', fr: 'Le Stable' }
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
        en: `${names[0].en} ${names[1].en}`,
        fr: `${names[0].fr} ${names[1].fr}`
      };
    } else if (names.length === 1) {
      return names[0];
    }
    
    // افتراضي
    return {
      ar: 'الشخصية المتوازنة',
      en: 'The Balanced Personality',
      fr: 'La Personnalité Équilibrée'
    };
  }

  /**
   * تحديد نقاط القوة
   */
  identifyStrengths(scores) {
    const strengths = [];
    
    if (scores.O.percentage > 60) {
      strengths.push('الإبداع والابتكار', 'القدرة على التكيف مع التغيير');
    }
    if (scores.C.percentage > 60) {
      strengths.push('التنظيم والانضباط', 'الموثوقية والالتزام');
    }
    if (scores.E.percentage > 60) {
      strengths.push('مهارات التواصل الاجتماعي', 'القيادة والتأثير');
    }
    if (scores.A.percentage > 60) {
      strengths.push('العمل الجماعي', 'التعاطف ومساعدة الآخرين');
    }
    if (scores.N.percentage < 40) {
      strengths.push('الاستقرار العاطفي', 'التعامل مع الضغوط');
    }
    
    return strengths;
  }

  /**
   * تحديد مجالات التطوير
   */
  identifyDevelopmentAreas(scores) {
    const areas = [];
    
    if (scores.O.percentage < 40) {
      areas.push('قد تحتاج لتطوير الانفتاح على التجارب الجديدة');
    }
    if (scores.C.percentage < 40) {
      areas.push('قد تحتاج لتطوير مهارات التنظيم والتخطيط');
    }
    if (scores.E.percentage < 40) {
      areas.push('قد تفضل العمل الفردي على الجماعي');
    }
    if (scores.A.percentage < 40) {
      areas.push('قد تحتاج لتطوير مهارات التعاون والتعاطف');
    }
    if (scores.N.percentage > 60) {
      areas.push('قد تحتاج لتطوير استراتيجيات إدارة التوتر');
    }
    
    return areas;
  }
}

// Export for use in Next.js
export default Big5International;

// For Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { default: Big5International };
}
