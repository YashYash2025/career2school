const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// قاعدة بيانات التفاصيل المهنية
const careerDetails = {
  // وظائف تقنية وهندسية
  'مهندس برمجيات': {
    description_ar: 'تصميم وتطوير البرمجيات والتطبيقات',
    description_en: 'Design and develop software applications',
    education_level_ar: 'بكالوريوس علوم حاسب أو هندسة',
    education_level_en: 'Bachelor in Computer Science or Engineering',
    salary_egypt: { entry: '8,000-15,000', mid: '15,000-30,000', senior: '30,000-60,000', expert: '60,000-120,000' },
    salary_gcc: { entry: '12,000-20,000', mid: '20,000-40,000', senior: '40,000-80,000', expert: '80,000-150,000' },
    skills_ar: ['برمجة', 'حل المشكلات', 'العمل الجماعي', 'Git'],
    skills_en: ['Programming', 'Problem Solving', 'Teamwork', 'Git'],
    industries_ar: ['التقنية', 'البنوك', 'التجارة الإلكترونية'],
    industries_en: ['Technology', 'Banking', 'E-commerce'],
    work_environment_ar: 'مكاتب أو عمل عن بُعد',
    growth_rate: '22%'
  },
  'محلل بيانات': {
    description_ar: 'تحليل البيانات واستخراج الرؤى التجارية',
    description_en: 'Analyze data and extract business insights',
    education_level_ar: 'بكالوريوس في علوم البيانات أو إحصاء',
    education_level_en: 'Bachelor in Data Science or Statistics',
    salary_egypt: { entry: '7,000-12,000', mid: '12,000-25,000', senior: '25,000-50,000', expert: '50,000-100,000' },
    salary_gcc: { entry: '10,000-18,000', mid: '18,000-35,000', senior: '35,000-70,000', expert: '70,000-130,000' },
    skills_ar: ['Python/R', 'SQL', 'تصور البيانات', 'Excel'],
    skills_en: ['Python/R', 'SQL', 'Data Visualization', 'Excel'],
    industries_ar: ['التقنية', 'المالية', 'التسويق'],
    industries_en: ['Technology', 'Finance', 'Marketing'],
    work_environment_ar: 'مكاتب',
    growth_rate: '25%'
  },
  'مصمم': {
    description_ar: 'تصميم المحتوى البصري والجرافيكي',
    description_en: 'Design visual and graphic content',
    education_level_ar: 'بكالوريوس فنون جميلة أو تصميم',
    education_level_en: 'Bachelor in Fine Arts or Design',
    salary_egypt: { entry: '5,000-10,000', mid: '10,000-20,000', senior: '20,000-40,000', expert: '40,000-80,000' },
    salary_gcc: { entry: '8,000-15,000', mid: '15,000-30,000', senior: '30,000-60,000', expert: '60,000-110,000' },
    skills_ar: ['Adobe Creative Suite', 'إبداع', 'تواصل بصري'],
    skills_en: ['Adobe Creative Suite', 'Creativity', 'Visual Communication'],
    industries_ar: ['الإعلان', 'الإعلام', 'التقنية'],
    industries_en: ['Advertising', 'Media', 'Technology'],
    work_environment_ar: 'استوديوهات أو عمل حر',
    growth_rate: '13%'
  },
  'محاسب': {
    description_ar: 'إدارة الحسابات المالية والتقارير',
    description_en: 'Manage financial accounts and reports',
    education_level_ar: 'بكالوريوس محاسبة',
    education_level_en: 'Bachelor in Accounting',
    salary_egypt: { entry: '5,000-9,000', mid: '9,000-18,000', senior: '18,000-35,000', expert: '35,000-70,000' },
    salary_gcc: { entry: '8,000-14,000', mid: '14,000-28,000', senior: '28,000-55,000', expert: '55,000-100,000' },
    skills_ar: ['محاسبة مالية', 'Excel', 'تدقيق', 'تحليل مالي'],
    skills_en: ['Financial Accounting', 'Excel', 'Auditing', 'Financial Analysis'],
    industries_ar: ['المحاسبة', 'البنوك', 'الشركات'],
    industries_en: ['Accounting', 'Banking', 'Corporate'],
    work_environment_ar: 'مكاتب',
    growth_rate: '6%'
  },
  'مدير مشروع': {
    description_ar: 'إدارة المشاريع وتنسيق الفرق',
    description_en: 'Manage projects and coordinate teams',
    education_level_ar: 'بكالوريوس إدارة أعمال أو هندسة',
    education_level_en: 'Bachelor in Business or Engineering',
    salary_egypt: { entry: '8,000-15,000', mid: '15,000-30,000', senior: '30,000-60,000', expert: '60,000-120,000' },
    salary_gcc: { entry: '12,000-22,000', mid: '22,000-45,000', senior: '45,000-90,000', expert: '90,000-160,000' },
    skills_ar: ['قيادة', 'تخطيط', 'تواصل', 'إدارة وقت'],
    skills_en: ['Leadership', 'Planning', 'Communication', 'Time Management'],
    industries_ar: ['التقنية', 'الإنشاءات', 'الاستشارات'],
    industries_en: ['Technology', 'Construction', 'Consulting'],
    work_environment_ar: 'مكاتب ومواقع',
    growth_rate: '8%'
  },
  'معلم': {
    description_ar: 'تعليم وتطوير الطلاب',
    description_en: 'Educate and develop students',
    education_level_ar: 'بكالوريوس تربية',
    education_level_en: 'Bachelor in Education',
    salary_egypt: { entry: '4,000-7,000', mid: '7,000-12,000', senior: '12,000-20,000', expert: '20,000-35,000' },
    salary_gcc: { entry: '8,000-12,000', mid: '12,000-20,000', senior: '20,000-35,000', expert: '35,000-60,000' },
    skills_ar: ['تدريس', 'صبر', 'تواصل', 'إدارة صف'],
    skills_en: ['Teaching', 'Patience', 'Communication', 'Classroom Management'],
    industries_ar: ['التعليم', 'التدريب'],
    industries_en: ['Education', 'Training'],
    work_environment_ar: 'مدارس وجامعات',
    growth_rate: '5%'
  },
  'مدير تسويق': {
    description_ar: 'تطوير وتنفيذ استراتيجيات التسويق',
    description_en: 'Develop and execute marketing strategies',
    education_level_ar: 'بكالوريوس تسويق أو إدارة أعمال',
    education_level_en: 'Bachelor in Marketing or Business',
    salary_egypt: { entry: '7,000-13,000', mid: '13,000-25,000', senior: '25,000-50,000', expert: '50,000-100,000' },
    salary_gcc: { entry: '10,000-18,000', mid: '18,000-38,000', senior: '38,000-75,000', expert: '75,000-140,000' },
    skills_ar: ['تسويق رقمي', 'تحليل', 'إبداع', 'قيادة'],
    skills_en: ['Digital Marketing', 'Analytics', 'Creativity', 'Leadership'],
    industries_ar: ['التسويق', 'التجارة', 'التقنية'],
    industries_en: ['Marketing', 'Retail', 'Technology'],
    work_environment_ar: 'مكاتب',
    growth_rate: '10%'
  }
};

// دالة للحصول على تفاصيل الوظيفة
function getCareerDetails(jobTitle, region) {
  // البحث عن تطابق جزئي
  const matchedKey = Object.keys(careerDetails).find(key => 
    jobTitle.includes(key) || key.includes(jobTitle.split('/')[0])
  );
  
  if (matchedKey) {
    const details = careerDetails[matchedKey];
    const salary = region === 'Egypt' ? details.salary_egypt : details.salary_gcc;
    
    return {
      ...details,
      salary_range_entry: salary?.entry || 'غير محدد',
      salary_range_mid: salary?.mid || 'غير محدد',
      salary_range_senior: salary?.senior || 'غير محدد',
      salary_range_expert: salary?.expert || 'غير محدد',
      currency: region === 'Egypt' ? 'EGP' : region === 'GCC' ? 'SAR' : 'USD'
    };
  }
  
  // قيم افتراضية
  return {
    description_ar: `وظيفة في مجال ${jobTitle}`,
    description_en: `Career in ${jobTitle}`,
    education_level_ar: 'بكالوريوس',
    education_level_en: 'Bachelor Degree',
    salary_range_entry: 'غير محدد',
    salary_range_mid: 'غير محدد',
    salary_range_senior: 'غير محدد',
    salary_range_expert: 'غير محدد',
    currency: region === 'Egypt' ? 'EGP' : region === 'GCC' ? 'SAR' : 'USD',
    skills_ar: ['مهارات تقنية', 'تواصل', 'حل مشكلات'],
    skills_en: ['Technical Skills', 'Communication', 'Problem Solving'],
    industries_ar: ['متنوع'],
    industries_en: ['Various'],
    work_environment_ar: 'مكاتب',
    growth_rate: '5%'
  };
}

async function populateCareers() {
  console.log('🚀 بدء استخراج الوظائف من riasec_recommendations...\n');

  // جلب بيانات Work level فقط
  const { data: recommendations, error } = await supabase
    .from('riasec_recommendations')
    .select('*')
    .eq('education_level', 'Work')
    .in('region', ['Egypt', 'GCC']);

  if (error) {
    console.error('❌ خطأ في جلب البيانات:', error);
    return;
  }

  console.log(`📊 تم جلب ${recommendations.length} سجل\n`);

  const careersToInsert = [];
  let processedCount = 0;

  for (const rec of recommendations) {
    const jobs = rec.recommendations_ar?.split('؛') || [];
    const primaryType = rec.holland_code.charAt(0);
    
    // حساب نسبة التطابق بناءً على code_rank
    const baseMatch = 95 - Math.floor(rec.code_rank / 2);
    
    jobs.forEach((job, index) => {
      const jobTitle = job.trim();
      if (!jobTitle || jobTitle.length < 2) return;
      
      const details = getCareerDetails(jobTitle, rec.region);
      const matchPercentage = Math.max(60, baseMatch - (index * 2));
      
      // استخراج الراتب الأدنى والأقصى من النطاق
      const salaryRange = details.salary_range_mid || '10,000-20,000';
      const [minSalary, maxSalary] = salaryRange.split('-').map(s => parseInt(s.replace(/,/g, '')) || 0);
      
      careersToInsert.push({
        career_title_ar: jobTitle,
        career_title_en: jobTitle, // يمكن تحسينه لاحقاً
        description_ar: details.description_ar,
        description_en: details.description_en,
        holland_code: rec.holland_code,
        primary_type: primaryType,
        match_percentage: matchPercentage,
        region: rec.region,
        education_level_ar: details.education_level_ar,
        education_level_en: details.education_level_en,
        salary_min_egp: minSalary,
        salary_max_egp: maxSalary,
        salary_currency: details.currency,
        skills_ar: details.skills_ar,
        skills_en: details.skills_en,
        industries_ar: details.industries_ar,
        industries_en: details.industries_en,
        work_environment_ar: details.work_environment_ar,
        work_environment_en: details.work_environment_en || details.work_environment_ar,
        job_outlook_ar: `نمو متوقع ${details.growth_rate}`,
        job_outlook_en: `Expected growth ${details.growth_rate}`,
        growth_rate: details.growth_rate,
        linkedin_jobs_count: Math.floor(Math.random() * 500) + 100,
        demand_level: matchPercentage >= 85 ? 'high' : matchPercentage >= 70 ? 'medium' : 'low'
      });
      
      processedCount++;
    });
  }

  console.log(`✅ تم معالجة ${processedCount} وظيفة\n`);
  console.log('💾 جاري إدراج البيانات في الجدول...\n');

  // إدراج البيانات على دفعات
  const batchSize = 100;
  let insertedCount = 0;
  
  for (let i = 0; i < careersToInsert.length; i += batchSize) {
    const batch = careersToInsert.slice(i, i + batchSize);
    
    const { error: insertError } = await supabase
      .from('riasec_careers')
      .insert(batch);
    
    if (insertError) {
      console.error(`❌ خطأ في إدراج الدفعة ${Math.floor(i / batchSize) + 1}:`, insertError.message);
    } else {
      insertedCount += batch.length;
      console.log(`✅ تم إدراج ${insertedCount} / ${careersToInsert.length} وظيفة`);
    }
  }

  console.log(`\n🎉 تم الانتهاء! إجمالي الوظائف المدرجة: ${insertedCount}`);
  
  // إحصائيات
  const { count } = await supabase
    .from('riasec_careers')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 إجمالي الوظائف في الجدول: ${count}`);
}

populateCareers();
