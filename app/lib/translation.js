'use client'
'use client';

import { createContext, useContext, useState, useEffect } from 'react'

// Translation data
const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      assessments: 'التقييمات',
      assessments_aria: 'انتقل إلى صفحة التقييمات',
      careers: 'المهن',
      education: 'التعليم',
      about: 'عن المنصة',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      start_now: 'ابدأ الآن',
      user: 'المستخدم',
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      startNow: 'ابدأ الآن',
      welcome: 'مرحباً بك'
    },
    buttons: {
      continue: 'متابعة',
      cancel: 'إلغاء',
      save: 'حفظ',
      submit: 'إرسال',
      back: 'العودة',
      next: 'التالي',
      close: 'إغلاق',
      search: 'بحث',
      startAssessment: 'ابدأ التقييم المجاني',
      learnMore: 'تعرف أكثر',
      exploreMore: 'استكشف المزيد'
    },
    status: {
      loading: 'جاري التحميل...',
      success: 'تم بنجاح',
      error: 'حدث خطأ',
      pending: 'قيد الانتظار',
      completed: 'مكتمل'
    },
    hero: {
      title_1: 'اكتشف مستقبلك مع',
      title: 'اكتشف مستقبلك مع',
      subtitle: 'منصة تقييم ذكية تساعدك على اكتشاف قدراتك ومهاراتك وتوجهك نحو المسار المهني الأنسب لك',
      start_assessment: 'ابدأ التقييم المجاني',
      watch_video: 'شاهد الفيديو التعريفي',
      brand: 'School2Career',
      description: 'منصة تقييم ذكية تساعدك على اكتشاف قدراتك ومهاراتك وتوجهك نحو المسار المهني الأنسب لك'
    },
    features: {
      comprehensive_assessment: 'تقييم شامل',
      comprehensive_assessment_desc: 'اختبارات متخصصة تقيس 8 مهارات أساسية',
      instant_results: 'نتائج فورية',
      instant_results_desc: 'احصل على تقرير مفصل بمجرد إنهاء الاختبار',
      smart_recommendations: 'توصيات ذكية',
      smart_recommendations_desc: 'نصائح مخصصة لتطوير مهاراتك',
      clear_paths: 'مسارات واضحة',
      clear_paths_desc: 'خطط تعليمية ومهنية مدروسة'
    },
    stats: {
      users: 'مستخدم',
      assessments: 'تقييم',
      career_paths: 'مسار مهني',
      satisfaction: 'رضا العملاء'
    },
    targets: {
      title: 'الفئات المستهدفة',
      students: {
        title: 'الطلاب',
        age: '15-18 سنة',
        description: 'طلاب المرحلة الثانوية الذين يحددون مسارهم الأكاديمي',
        features: {
          academic_discovery: 'اكتشاف الميول الأكاديمية',
          specialization: 'تحديد التخصص المناسب',
          future_planning: 'التخطيط للمستقبل',
          informed_decisions: 'اتخاذ قرارات مدروسة'
        }
      },
      professionals: {
        title: 'المهنيون',
        age: '18+ سنة',
        description: 'المهنيون الراغبون في تطوير مسيرتهم المهنية',
        features: {
          skill_assessment: 'تقييم المهارات المهنية',
          development_opportunities: 'اكتشاف فرص التطوير',
          promotion_planning: 'التخطيط للترقية',
          career_change: 'تغيير المسار المهني'
        }
      },
      organizations: {
        title: 'المؤسسات',
        size: '500+ موظف',
        description: 'المؤسسات التعليمية والشركات',
        features: {
          employee_assessment: 'تقييم الموظفين',
          development_programs: 'برامج التطوير',
          candidate_selection: 'اختيار المرشحين',
          team_building: 'بناء الفرق'
        }
      }
    },
    skills: {
      title: 'ماذا نقيس؟',
      scientific: {
        name: 'المهارات العلمية',
        category: 'رياضيات، فيزياء، كيمياء'
      },
      literary: {
        name: 'المهارات الأدبية',
        category: 'لغات، تاريخ، جغرافيا'
      },
      technical: {
        name: 'المهارات التقنية',
        category: 'برمجة، تصميم، تكنولوجيا'
      },
      artistic: {
        name: 'المهارات الفنية',
        category: 'رسم، موسيقى، تصميم'
      },
      social: {
        name: 'المهارات الاجتماعية',
        category: 'تواصل، قيادة، عمل جماعي'
      },
      critical_thinking: {
        name: 'التفكير النقدي',
        category: 'تحليل، حل مشكلات'
      },
      sports: {
        name: 'المهارات الرياضية',
        category: 'لياقة، رياضات، تنسيق'
      },
      medical: {
        name: 'المهارات الطبية',
        category: 'علوم صحية، رعاية، بحث'
      },
      categories: {
        technical: 'المهارات التقنية',
        communication: 'مهارات التواصل',
        creative: 'المهارات الإبداعية',
        interpersonal: 'المهارات الاجتماعية',
        analytical: 'مهارات التحليل',
        physical: 'المهارات البدنية',
        healthcare: 'المهارات الطبية'
      }
    },
    paths: {
      title: 'المسارات المهنية',
      explore_more: 'استكشف المزيد',
      science: {
        title: 'العلوم والتكنولوجيا',
        subtitle: 'للمبدعين والمبتكرين',
        description: 'مجالات الطب والهندسة والتكنولوجيا'
      },
      technology: {
        title: 'التكنولوجيا والبرمجة',
        subtitle: 'لعشاق التقنية',
        description: 'تطوير البرمجيات وأنظمة المعلومات'
      },
      arts: {
        title: 'الفنون والإبداع',
        subtitle: 'للموهوبين فنياً',
        description: 'التصميم والفنون والإعلام'
      },
      business: {
        title: 'الأعمال والإدارة',
        subtitle: 'لقادة المستقبل',
        description: 'إدارة الأعمال والتسويق والمالية'
      }
    },
    cta: {
      title: 'ابدأ رحلتك المهنية اليوم',
      description: 'انضم إلى آلاف الطلاب والمهنيين الذين اكتشفوا مسارهم المثالي',
      start_assessment: 'ابدأ التقييم',
      login: 'تسجيل الدخول'
    },
    rating: {
      rate: 'قيم',
      out_of: 'من',
      current_rating: 'التقييم الحالي',
      poor: 'ضعيف',
      fair: 'مقبول',
      good: 'جيد',
      very_good: 'جيد جداً',
      excellent: 'ممتاز'
    },
    assessment: {
      progress: 'تقدم التقييم',
      saved: 'تم الحفظ',
      completed: 'تم إنهاء التقييم',
      completed_description: 'تهانينا! لقد أنهيت تقييم جميع المهارات بنجاح',
      view_results: 'عرض النتائج',
      retake: 'إعادة التقييم'
    },
    footer: {
      copyright: '© 2025 School2Career - جميع الحقوق محفوظة',
      developer: 'تطوير د. محمد يشار'
    },
    assessments_page: {
      title: 'التقييمات المتاحة',
      subtitle: 'اختر التقييم المناسب لك',
      main_title: 'منصة التقييمات الذكية',
      main_subtitle: 'استكشف قدراتك وميولك مع مجموعة متنوعة من التقييمات العلمية المتطورة',
      personality_group: {
        title: 'الشخصية والميول',
        subtitle: 'اكتشف شخصيتك وميولك المهنية وقيمك الأساسية',
        badge: 'متاح الآن ✨'
      },
      personality_mirror: {
        title: 'مرآة الشخصية™',
        brand: 'Personality Mirror™',
        subtitle: 'افهم نفسك لتختار مستقبلك',
        description: '3 تقييمات متطورة من مرآة School2Career: للمدارس الإعدادية والثانوية والجامعات',
        badge: 'متاح الآن'
      },
      career_compass: {
        title: 'بوصلة المهن™',
        brand: 'Career Compass™',
        subtitle: 'اكتشف مسارك المهني بدقة علمية',
        description: '4 تقييمات متطورة من بوصلة School2Career الذكية: للمدارس والجامعات بنسختين (سريع 60 سؤال - شامل 180 سؤال)',
        badge: 'متاح الآن'
      },
      values_motivations: {
        title: 'القيم والدوافع',
        subtitle: 'اختبار القيم والدوافع',
        time: '15 دقيقة',
        badge: 'قريباً'
      },
      start_assessment: 'ابدأ التقييم',
      coming_soon: 'قريباً'
    },
    careers_page: {
      title: 'المسارات المهنية',
      subtitle: 'استكشف المهن المتاحة في مختلف المجالات',
      demand: {
        high: 'عالي',
        very_high: 'عالي جداً',
        medium: 'متوسط',
        low: 'منخفض'
      },
      categories: {
        science_tech: 'العلوم والتكنولوجيا',
        technology_programming: 'التكنولوجيا والبرمجة',
        business_management: 'الأعمال والإدارة',
        arts_creativity: 'الفنون والإبداع'
      }
    }
  },
  en: {
    nav: {
      home: 'Home',
      assessments: 'Assessments',
      assessments_aria: 'Go to Assessments page',
      careers: 'Careers',
      education: 'Education',
      about: 'About',
      login: 'Login',
      signup: 'Sign Up',
      start_now: 'Start Now',
      user: 'User',
      dashboard: 'Dashboard',
      profile: 'Profile',
      logout: 'Logout',
      startNow: 'Start Now',
      welcome: 'Welcome'
    },
    buttons: {
      continue: 'Continue',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      close: 'Close',
      search: 'Search',
      startAssessment: 'Start Free Assessment',
      learnMore: 'Learn More',
      exploreMore: 'Explore More'
    },
    status: {
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      pending: 'Pending',
      completed: 'Completed'
    },
    hero: {
      title_1: 'Discover Your Future with',
      title: 'Discover Your Future with',
      subtitle: 'An intelligent assessment platform that helps you discover your abilities and skills and guides you towards the most suitable career path for you',
      start_assessment: 'Start Free Assessment',
      watch_video: 'Watch Video',
      brand: 'School2Career',
      description: 'An intelligent assessment platform that helps you discover your abilities and skills and guides you towards the most suitable career path for you'
    },
    features: {
      comprehensive_assessment: 'Comprehensive Assessment',
      comprehensive_assessment_desc: 'Detailed analysis of your personality, interests, and abilities',
      instant_results: 'Instant Results',
      instant_results_desc: 'Get your results immediately after completing the assessment',
      smart_recommendations: 'Smart Recommendations',
      smart_recommendations_desc: 'AI-powered career suggestions based on your profile',
      clear_paths: 'Clear Career Paths',
      clear_paths_desc: 'Step-by-step guidance to achieve your career goals'
    },
    stats: {
      users: 'Users',
      assessments: 'Completed Assessments',
      career_paths: 'Career Paths',
      satisfaction: 'Satisfaction Rate'
    },
    targets: {
      title: 'Who Is This Platform For?',
      students: {
        title: 'Students',
        age: 'Age 15-25',
        description: 'Helping students discover their academic and professional future',
        features: {
          academic_discovery: 'Discover your academic interests',
          specialization: 'Choose the right specialization',
          future_planning: 'Plan your educational future',
          informed_decisions: 'Make informed career decisions'
        }
      },
      professionals: {
        title: 'Professionals',
        age: 'Age 25-45',
        description: 'Supporting professionals in developing their careers',
        features: {
          skill_assessment: 'Assess your current skills',
          development_opportunities: 'Identify development opportunities',
          promotion_planning: 'Plan for career advancement',
          career_change: 'Navigate career transitions'
        }
      },
      organizations: {
        title: 'Organizations',
        size: 'Any Size',
        description: 'Helping organizations develop their human resources',
        features: {
          employee_assessment: 'Assess employee capabilities',
          development_programs: 'Design development programs',
          candidate_selection: 'Improve candidate selection',
          team_building: 'Build effective teams'
        }
      }
    },
    skills: {
      title: 'Skills We Assess',
      scientific: {
        name: 'Scientific Skills',
        category: 'Research & Analysis'
      },
      literary: {
        name: 'Literary Skills',
        category: 'Language & Communication'
      },
      technical: {
        name: 'Technical Skills',
        category: 'Technology & Engineering'
      },
      artistic: {
        name: 'Artistic Skills',
        category: 'Creativity & Design'
      },
      social: {
        name: 'Social Skills',
        category: 'Leadership & Teamwork'
      },
      critical_thinking: {
        name: 'Critical Thinking',
        category: 'Problem Solving'
      },
      sports: {
        name: 'Sports Skills',
        category: 'Physical & Athletic'
      },
      medical: {
        name: 'Medical Skills',
        category: 'Healthcare & Medicine'
      },
      categories: {
        technical: 'Technical Skills',
        communication: 'Communication Skills',
        creative: 'Creative Skills',
        interpersonal: 'Interpersonal Skills',
        analytical: 'Analytical Skills',
        physical: 'Physical Skills',
        healthcare: 'Healthcare Skills'
      }
    },
    paths: {
      title: 'Career Paths Available',
      explore_more: 'Explore More',
      science: {
        title: 'Science & Research',
        subtitle: 'Explore the world of discovery',
        description: 'From laboratory research to field studies, discover careers in various scientific fields'
      },
      technology: {
        title: 'Technology & Innovation',
        subtitle: 'Shape the digital future',
        description: 'From software development to artificial intelligence, explore tech careers'
      },
      arts: {
        title: 'Arts & Creativity',
        subtitle: 'For the artistically talented',
        description: 'Design, arts, and media'
      },
      business: {
        title: 'Business & Management',
        subtitle: 'For future leaders',
        description: 'Business administration, marketing, and finance'
      }
    },
    cta: {
      title: 'Start Your Career Journey Today',
      description: 'Join thousands of students and professionals who discovered their ideal path',
      start_assessment: 'Start Assessment',
      login: 'Login'
    },
    rating: {
      rate: 'Rate',
      out_of: 'out of',
      current_rating: 'Current Rating',
      poor: 'Poor',
      fair: 'Fair',
      good: 'Good',
      very_good: 'Very Good',
      excellent: 'Excellent'
    },
    assessment: {
      progress: 'Assessment Progress',
      saved: 'Saved',
      completed: 'Assessment Completed',
      completed_description: 'Congratulations! You have successfully completed the assessment of all skills',
      view_results: 'View Results',
      retake: 'Retake Assessment'
    },
    footer: {
      copyright: '© 2025 School2Career - All Rights Reserved',
      developer: 'Developed by Dr. Mohamed Yashar'
    },
    assessments_page: {
      title: 'Available Assessments',
      subtitle: 'Choose the right assessment for you',
      main_title: 'Smart Assessment Platform',
      main_subtitle: 'Explore your abilities and interests with a variety of advanced scientific assessments',
      personality_group: {
        title: 'Personality & Interests',
        subtitle: 'Discover your personality, career interests, and core values',
        badge: 'Available Now ✨'
      },
      personality_mirror: {
        title: 'Personality Mirror™',
        brand: 'Personality Mirror™',
        subtitle: 'Understand yourself to choose your future',
        description: '3 advanced assessments from School2Career Mirror: for middle schools, high schools, and universities',
        badge: 'Available Now'
      },
      career_compass: {
        title: 'Career Compass™',
        brand: 'Career Compass™',
        subtitle: 'Discover your career path with scientific accuracy',
        description: '4 advanced assessments from School2Career Smart Compass: for schools and universities in two versions (Quick 60 questions - Comprehensive 180 questions)',
        badge: 'Available Now'
      },
      values_motivations: {
        title: 'Values & Motivations',
        subtitle: 'Values and Motivations Assessment',
        time: '15 minutes',
        badge: 'Coming Soon'
      },
      start_assessment: 'Start Assessment',
      coming_soon: 'Coming Soon'
    },
    careers_page: {
      title: 'Career Paths',
      subtitle: 'Explore available careers in various fields',
      demand: {
        high: 'High',
        very_high: 'Very High',
        medium: 'Medium',
        low: 'Low'
      },
      categories: {
        science_tech: 'Science & Technology',
        technology_programming: 'Technology & Programming',
        business_management: 'Business & Management',
        arts_creativity: 'Arts & Creativity'
      }
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      assessments: 'Évaluations',
      assessments_aria: 'Aller à la page des évaluations',
      careers: 'Carrières',
      education: 'Éducation',
      about: 'À Propos',
      login: 'Connexion',
      signup: 'S\'inscrire',
      start_now: 'Commencer',
      user: 'Utilisateur',
      dashboard: 'Tableau de Bord',
      profile: 'Profil',
      logout: 'Déconnexion',
      startNow: 'Commencer',
      welcome: 'Bienvenue'
    },
    buttons: {
      continue: 'Continuer',
      cancel: 'Annuler',
      save: 'Sauvegarder',
      submit: 'Soumettre',
      back: 'Retour',
      next: 'Suivant',
      close: 'Fermer',
      search: 'Rechercher',
      startAssessment: 'Commencer l\'Evaluation Gratuite',
      learnMore: 'En Savoir Plus',
      exploreMore: 'Explorer Plus'
    },
    status: {
      loading: 'Chargement...',
      success: 'Succès',
      error: 'Erreur',
      pending: 'En Attente',
      completed: 'Terminé'
    },
    hero: {
      title_1: 'Découvrez votre avenir avec',
      title: 'Découvrez votre avenir avec',
      subtitle: 'Une plateforme d\'évaluation intelligente qui vous aide à découvrir vos capacités et compétences et vous guide vers le parcours professionnel le plus adapté pour vous',
      start_assessment: 'Commencer l\'Evaluation Gratuite',
      watch_video: 'Regarder la Vidéo',
      brand: 'School2Career',
      description: 'Une plateforme d\'évaluation intelligente qui vous aide à découvrir vos capacités et compétences et vous guide vers le parcours professionnel le plus adapté pour vous'
    },
    features: {
      comprehensive_assessment: 'Évaluation Complète',
      comprehensive_assessment_desc: 'Analyse détaillée de votre personnalité, intérêts et capacités',
      instant_results: 'Résultats Instantanés',
      instant_results_desc: 'Obtenez vos résultats immédiatement après avoir terminé l\'évaluation',
      smart_recommendations: 'Recommandations Intelligentes',
      smart_recommendations_desc: 'Suggestions de carrière alimentées par l\'IA basées sur votre profil',
      clear_paths: 'Parcours Professionnels Clairs',
      clear_paths_desc: 'Orientation étape par étape pour atteindre vos objectifs de carrière'
    },
    stats: {
      users: 'Utilisateurs',
      assessments: 'Évaluations Terminées',
      career_paths: 'Parcours Professionnels',
      satisfaction: 'Taux de Satisfaction'
    },
    targets: {
      title: 'Pour qui est cette plateforme ?',
      students: {
        title: 'Étudiants',
        age: 'Âge 15-25',
        description: 'Aider les étudiants à découvrir leur avenir académique et professionnel',
        features: {
          academic_discovery: 'Découvrez vos intérêts académiques',
          specialization: 'Choisissez la bonne spécialisation',
          future_planning: 'Planifiez votre avenir éducatif',
          informed_decisions: 'Prenez des décisions de carrière éclairées'
        }
      },
      professionals: {
        title: 'Professionnels',
        age: 'Âge 25-45',
        description: 'Soutenir les professionnels dans le développement de leur carrière',
        features: {
          skill_assessment: 'Évaluez vos compétences actuelles',
          development_opportunities: 'Identifiez les opportunités de développement',
          promotion_planning: 'Planifiez l\'avancement de carrière',
          career_change: 'Naviguez les transitions de carrière'
        }
      },
      organizations: {
        title: 'Organisations',
        size: 'Toute Taille',
        description: 'Aider les organisations à développer leurs ressources humaines',
        features: {
          employee_assessment: 'Évaluer les capacités des employés',
          development_programs: 'Concevoir des programmes de développement',
          candidate_selection: 'Améliorer la sélection des candidats',
          team_building: 'Construire des équipes efficaces'
        }
      }
    },
    skills: {
      title: 'Compétences que nous évaluons',
      scientific: {
        name: 'Compétences Scientifiques',
        category: 'Recherche et Analyse'
      },
      literary: {
        name: 'Compétences Littéraires',
        category: 'Langue et Communication'
      },
      technical: {
        name: 'Compétences Techniques',
        category: 'Technologie et Ingénierie'
      },
      artistic: {
        name: 'Compétences Artistiques',
        category: 'Créativité et Design'
      },
      social: {
        name: 'Compétences Sociales',
        category: 'Leadership et Travail d\'équipe'
      },
      critical_thinking: {
        name: 'Pensée Critique',
        category: 'Résolution de Problèmes'
      },
      sports: {
        name: 'Compétences Sportives',
        category: 'Physique et Athlétique'
      },
      medical: {
        name: 'Compétences Médicales',
        category: 'Santé et Médecine'
      },
      categories: {
        technical: 'Compétences Techniques',
        communication: 'Compétences de Communication',
        creative: 'Compétences Créatives',
        interpersonal: 'Compétences Interpersonnelles',
        analytical: 'Compétences Analytiques',
        physical: 'Compétences Physiques',
        healthcare: 'Compétences Médicales'
      }
    },
    paths: {
      title: 'Parcours Professionnels Disponibles',
      explore_more: 'Explorer Plus',
      science: {
        title: 'Science et Recherche',
        subtitle: 'Explorez le monde de la découverte',
        description: 'De la recherche en laboratoire aux études de terrain, découvrez les carrières dans divers domaines scientifiques'
      },
      technology: {
        title: 'Technologie et Innovation',
        subtitle: 'Façonnez l\'avenir numérique',
        description: 'Du développement logiciel à l\'intelligence artificielle, explorez les carrières technologiques'
      },
      arts: {
        title: 'Arts et créativité',
        subtitle: 'Pour les talents artistiques',
        description: 'Design, arts et médias'
      },
      business: {
        title: 'Affaires et gestion',
        subtitle: 'Pour les futurs leaders',
        description: 'Administration des affaires, marketing et finance'
      }
    },
    cta: {
      title: 'Commencez votre parcours professionnel aujourd\'hui',
      description: 'Rejoignez des milliers d\'étudiants et de professionnels qui ont découvert leur voie idéale',
      start_assessment: 'Commencer l\'évaluation',
      login: 'Connexion'
    },
    rating: {
      rate: 'Évaluer',
      out_of: 'sur',
      current_rating: 'Évaluation Actuelle',
      poor: 'Faible',
      fair: 'Correct',
      good: 'Bon',
      very_good: 'Très Bon',
      excellent: 'Excellent'
    },
    assessment: {
      progress: 'Progrès de l\'Evaluation',
      saved: 'Sauvegardé',
      completed: 'Évaluation Terminée',
      completed_description: 'Félicitations! Vous avez terminé avec succès l\'évaluation de toutes les compétences',
      view_results: 'Voir les Résultats',
      retake: 'Reprendre l\'Évaluation'
    },
    footer: {
      copyright: '© 2025 School2Career - Tous Droits Réservés',
      developer: 'Développé par Dr. Mohamed Yashar'
    },
    assessments_page: {
      title: 'Évaluations disponibles',
      subtitle: 'Choisissez l\'évaluation qui vous convient',
      main_title: 'Plateforme d\'Évaluation Intelligente',
      main_subtitle: 'Explorez vos capacités et intérêts avec une variété d\'évaluations scientifiques avancées',
      personality_group: {
        title: 'Personnalité et Intérêts',
        subtitle: 'Découvrez votre personnalité, vos intérêts professionnels et vos valeurs fondamentales',
        badge: 'Disponible maintenant ✨'
      },
      personality_mirror: {
        title: 'Miroir de Personnalité™',
        brand: 'Personality Mirror™',
        subtitle: 'Comprenez-vous pour choisir votre avenir',
        description: '3 évaluations avancées du Miroir School2Career : pour les collèges, lycées et universités',
        badge: 'Disponible maintenant'
      },
      career_compass: {
        title: 'Boussole de Carrière™',
        brand: 'Career Compass™',
        subtitle: 'Découvrez votre parcours professionnel avec précision scientifique',
        description: '4 évaluations avancées de la Boussole Intelligente School2Career : pour les écoles et universités en deux versions (Rapide 60 questions - Complète 180 questions)',
        badge: 'Disponible maintenant'
      },
      values_motivations: {
        title: 'Valeurs et Motivations',
        subtitle: 'Évaluation des valeurs et motivations',
        time: '15 minutes',
        badge: 'Bientôt disponible'
      },
      start_assessment: 'Commencer l\'évaluation',
      coming_soon: 'Bientôt disponible'
    },
    careers_page: {
      title: 'Parcours Professionnels',
      subtitle: 'Explorez les carrières disponibles dans divers domaines',
      demand: {
        high: 'Élevé',
        very_high: 'Très Élevé',
        medium: 'Moyen',
        low: 'Faible'
      },
      categories: {
        science_tech: 'Sciences et Technologie',
        technology_programming: 'Technologie et Programmation',
        business_management: 'Affaires et Gestion',
        arts_creativity: 'Arts et Créativité'
      }
    }
  }
}

// Language Context
const LanguageContext = createContext()

// Language Provider
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('ar')
  const [direction, setDirection] = useState('rtl')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ar'
    setCurrentLanguage(savedLanguage)
    updateDirection(savedLanguage)
  }, [])

  const updateDirection = (lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    setDirection(dir)
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }

  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage)
    updateDirection(newLanguage)
    localStorage.setItem('preferredLanguage', newLanguage)
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const value = {
    currentLanguage,
    direction,
    changeLanguage,
    t,
    languages: [
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

// Language Switcher Component
export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          fontSize: 'var(--font-sm)',
          transition: 'var(--transition-normal)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--card-bg)'
        }}
      >
        {languages.find(lang => lang.code === currentLanguage)?.flag}
        {languages.find(lang => lang.code === currentLanguage)?.name}
        <span style={{ fontSize: '10px' }}>▼</span>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 'var(--spacing-xs)',
          background: 'var(--dark-bg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          minWidth: '150px',
          boxShadow: 'var(--shadow-xl)',
          backdropFilter: 'blur(20px)',
          zIndex: 'var(--z-dropdown)',
          overflow: 'hidden'
        }}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code)
                setIsOpen(false)
              }}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: currentLanguage === language.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                fontSize: 'var(--font-sm)',
                transition: 'var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = currentLanguage === language.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              {language.flag} {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}