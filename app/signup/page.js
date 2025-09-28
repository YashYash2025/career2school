'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [formData, setFormData] = useState({
    // البيانات الشخصية
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // البيانات الديموغرافية
    age: '',
    gender: '',
    birthDate: '',
    
    // البيانات الجغرافية
    country: '',
    governorate: '',
    city: '',
    
    // البيانات التعليمية
    educationLevel: '', // إعدادي/ثانوي/جامعي/خريج
    currentGrade: '', // الصف الحالي
    school: '', // اسم المدرسة/الجامعة
    specialization: '', // التخصص
    
    // اللغة المفضلة
    preferredLanguage: 'ar' // ar, en, fr
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // بيانات البلدان والمحافظات
  const countries = {
    'EG': {
      name: { ar: 'مصر', en: 'Egypt', fr: 'Égypte' },
      governorates: [
        { code: 'CAI', name: { ar: 'القاهرة', en: 'Cairo', fr: 'Le Caire' } },
        { code: 'GIZ', name: { ar: 'الجيزة', en: 'Giza', fr: 'Gizeh' } },
        { code: 'ALX', name: { ar: 'الإسكندرية', en: 'Alexandria', fr: 'Alexandrie' } },
        { code: 'SHR', name: { ar: 'الشرقية', en: 'Sharqia', fr: 'Charqiya' } },
        { code: 'MNF', name: { ar: 'المنوفية', en: 'Monufia', fr: 'Ménoufia' } },
        { code: 'QAL', name: { ar: 'القليوبية', en: 'Qalyubia', fr: 'Qalyubia' } },
        { code: 'GHR', name: { ar: 'الغربية', en: 'Gharbia', fr: 'Gharbia' } },
        { code: 'BHR', name: { ar: 'البحيرة', en: 'Beheira', fr: 'Beheira' } },
        { code: 'KFS', name: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh', fr: 'Kafr el-Cheikh' } },
        { code: 'DQH', name: { ar: 'الدقهلية', en: 'Dakahlia', fr: 'Dakahlia' } },
        { code: 'DMT', name: { ar: 'دمياط', en: 'Damietta', fr: 'Damiette' } },
        { code: 'PTS', name: { ar: 'بورسعيد', en: 'Port Said', fr: 'Port-Saïd' } },
        { code: 'ISM', name: { ar: 'الإسماعيلية', en: 'Ismailia', fr: 'Ismaïlia' } },
        { code: 'SUZ', name: { ar: 'السويس', en: 'Suez', fr: 'Suez' } },
        { code: 'NSR', name: { ar: 'شمال سيناء', en: 'North Sinai', fr: 'Sinaï du Nord' } },
        { code: 'SSR', name: { ar: 'جنوب سيناء', en: 'South Sinai', fr: 'Sinaï du Sud' } },
        { code: 'FYM', name: { ar: 'الفيوم', en: 'Fayoum', fr: 'Fayoum' } },
        { code: 'BNS', name: { ar: 'بني سويف', en: 'Beni Suef', fr: 'Beni Suef' } },
        { code: 'MNA', name: { ar: 'المنيا', en: 'Minya', fr: 'Minya' } },
        { code: 'AST', name: { ar: 'أسيوط', en: 'Asyut', fr: 'Assiout' } },
        { code: 'SHG', name: { ar: 'سوهاج', en: 'Sohag', fr: 'Sohag' } },
        { code: 'QNA', name: { ar: 'قنا', en: 'Qena', fr: 'Qena' } },
        { code: 'LXR', name: { ar: 'الأقصر', en: 'Luxor', fr: 'Louxor' } },
        { code: 'ASW', name: { ar: 'أسوان', en: 'Aswan', fr: 'Assouan' } },
        { code: 'BSE', name: { ar: 'البحر الأحمر', en: 'Red Sea', fr: 'Mer Rouge' } },
        { code: 'WAD', name: { ar: 'الوادي الجديد', en: 'New Valley', fr: 'Nouvelle Vallée' } },
        { code: 'MAT', name: { ar: 'مطروح', en: 'Matrouh', fr: 'Matruh' } }
      ]
    },
    'SA': {
      name: { ar: 'السعودية', en: 'Saudi Arabia', fr: 'Arabie Saoudite' },
      governorates: [
        { code: 'RYD', name: { ar: 'الرياض', en: 'Riyadh', fr: 'Riyad' } },
        { code: 'MKK', name: { ar: 'مكة المكرمة', en: 'Makkah', fr: 'La Mecque' } },
        { code: 'MDN', name: { ar: 'المدينة المنورة', en: 'Madinah', fr: 'Médine' } },
        { code: 'EAS', name: { ar: 'الشرقية', en: 'Eastern Province', fr: 'Province orientale' } },
        { code: 'ASR', name: { ar: 'عسير', en: 'Asir', fr: 'Assir' } },
        { code: 'TAB', name: { ar: 'تبوك', en: 'Tabuk', fr: 'Tabouk' } },
        { code: 'HAL', name: { ar: 'حائل', en: 'Hail', fr: 'Haïtl' } },
        { code: 'NRN', name: { ar: 'الحدود الشمالية', en: 'Northern Borders', fr: 'Frontières du Nord' } },
        { code: 'JZN', name: { ar: 'جازان', en: 'Jazan', fr: 'Jizan' } },
        { code: 'NJR', name: { ar: 'نجران', en: 'Najran', fr: 'Najran' } },
        { code: 'BAH', name: { ar: 'الباحة', en: 'Al Bahah', fr: 'Al Bahah' } },
        { code: 'JOF', name: { ar: 'الجوف', en: 'Al Jouf', fr: 'Al Jawf' } },
        { code: 'QSM', name: { ar: 'القصيم', en: 'Al Qassim', fr: 'Al Qassim' } }
      ]
    },
    'AE': {
      name: { ar: 'الإمارات', en: 'UAE', fr: 'Émirats Arabes Unis' },
      governorates: [
        { code: 'AUH', name: { ar: 'أبو ظبي', en: 'Abu Dhabi', fr: 'Abou Dabi' } },
        { code: 'DXB', name: { ar: 'دبي', en: 'Dubai', fr: 'Dubaï' } },
        { code: 'SHJ', name: { ar: 'الشارقة', en: 'Sharjah', fr: 'Charjah' } },
        { code: 'AJM', name: { ar: 'عجمان', en: 'Ajman', fr: 'Ajman' } },
        { code: 'UAQ', name: { ar: 'أم القيوين', en: 'Umm Al Quwain', fr: 'Oumm al Qaïwaïn' } },
        { code: 'RAK', name: { ar: 'رأس الخيمة', en: 'Ras Al Khaimah', fr: 'Ras el Khaïmah' } },
        { code: 'FUJ', name: { ar: 'الفجيرة', en: 'Fujairah', fr: 'Foujairah' } }
      ]
    }
  };

  // بيانات المراحل التعليمية
  const educationLevels = {
    'middle': {
      name: { ar: 'إعدادي', en: 'Middle School', fr: 'Collège' },
      grades: [
        { code: '7', name: { ar: 'الصف الأول الإعدادي', en: '7th Grade', fr: '5ème' } },
        { code: '8', name: { ar: 'الصف الثاني الإعدادي', en: '8th Grade', fr: '4ème' } },
        { code: '9', name: { ar: 'الصف الثالث الإعدادي', en: '9th Grade', fr: '3ème' } }
      ]
    },
    'high': {
      name: { ar: 'ثانوي', en: 'High School', fr: 'Lycée' },
      grades: [
        { code: '10', name: { ar: 'الصف الأول الثانوي', en: '10th Grade', fr: 'Seconde' } },
        { code: '11', name: { ar: 'الصف الثاني الثانوي', en: '11th Grade', fr: 'Première' } },
        { code: '12', name: { ar: 'الصف الثالث الثانوي', en: '12th Grade', fr: 'Terminale' } }
      ]
    },
    'university': {
      name: { ar: 'جامعي', en: 'University', fr: 'Université' },
      grades: [
        { code: '1', name: { ar: 'السنة الأولى', en: '1st Year', fr: '1ère année' } },
        { code: '2', name: { ar: 'السنة الثانية', en: '2nd Year', fr: '2ème année' } },
        { code: '3', name: { ar: 'السنة الثالثة', en: '3rd Year', fr: '3ème année' } },
        { code: '4', name: { ar: 'السنة الرابعة', en: '4th Year', fr: '4ème année' } },
        { code: '5', name: { ar: 'السنة الخامسة', en: '5th Year', fr: '5ème année' } },
        { code: '6', name: { ar: 'السنة السادسة', en: '6th Year', fr: '6ème année' } }
      ]
    },
    'graduate': {
      name: { ar: 'خريج', en: 'Graduate', fr: 'Diplômé' },
      grades: [
        { code: 'recent', name: { ar: 'خريج حديث (0-2 سنة)', en: 'Recent Graduate (0-2 years)', fr: 'Diplômé récent (0-2 ans)' } },
        { code: 'experienced', name: { ar: 'خريج ذو خبرة (2+ سنوات)', en: 'Experienced Graduate (2+ years)', fr: 'Diplômé expérimenté (2+ ans)' } }
      ]
    }
  };

  // اللغات المتاحة
  const languages = {
    ar: { name: 'العربية', dir: 'rtl' },
    en: { name: 'English', dir: 'ltr' },
    fr: { name: 'Français', dir: 'ltr' }
  };

  // النص بالثلاث لغات
  const getText = (key) => {
    const translations = {
      ar: {
        // العناوين الرئيسية
        title: 'إنشاء حساب جديد',
        subtitle: 'انضم إلينا واكتشف مسارك المهني المثالي',
        
        // البيانات الشخصية
        personalInfo: 'البيانات الشخصية',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        birthDate: 'تاريخ الميلاد',
        gender: 'الجنس',
        male: 'ذكر',
        female: 'أنثى',
        
        // البيانات الجغرافية
        locationInfo: 'البيانات الجغرافية',
        country: 'البلد',
        governorate: 'المحافظة',
        city: 'المدينة',
        
        // البيانات التعليمية
        educationInfo: 'البيانات التعليمية',
        educationLevel: 'المرحلة الدراسية',
        currentGrade: 'الصف الحالي',
        school: 'المدرسة/الجامعة',
        specialization: 'التخصص',
        
        // كلمة المرور
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        
        // اللغة
        preferredLanguage: 'اللغة المفضلة',
        
        // الأزرار
        createAccount: 'إنشاء الحساب',
        login: 'تسجيل الدخول',
        
        // النصوص الأخرى
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        agreeToTerms: 'أوافق على',
        termsOfService: 'شروط الاستخدام',
        privacyPolicy: 'سياسة الخصوصية',
        and: 'و',
        
        // Placeholders
        enterName: 'أدخل اسمك الكامل',
        enterEmail: 'أدخل بريدك الإلكتروني',
        enterPhone: 'أدخل رقم هاتفك',
        enterPassword: 'أدخل كلمة المرور',
        reenterPassword: 'أعد كتابة كلمة المرور',
        enterSchool: 'أدخل اسم المدرسة/الجامعة',
        enterSpecialization: 'أدخل تخصصك',
        enterCity: 'أدخل اسم مدينتك',
        
        // خيارات القوائم
        selectCountry: 'اختر البلد',
        selectGovernorate: 'اختر المحافظة',
        selectEducationLevel: 'اختر المرحلة الدراسية',
        selectGrade: 'اختر الصف',
        selectGender: 'اختر الجنس',
        selectLanguage: 'اختر اللغة المفضلة'
      },
      en: {
        // Main titles
        title: 'Create New Account',
        subtitle: 'Join us and discover your ideal career path',
        
        // Personal data
        personalInfo: 'Personal Information',
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        birthDate: 'Date of Birth',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        
        // Location data
        locationInfo: 'Location Information',
        country: 'Country',
        governorate: 'Governorate/State',
        city: 'City',
        
        // Education data
        educationInfo: 'Educational Information',
        educationLevel: 'Education Level',
        currentGrade: 'Current Grade',
        school: 'School/University',
        specialization: 'Specialization',
        
        // Password
        password: 'Password',
        confirmPassword: 'Confirm Password',
        
        // Language
        preferredLanguage: 'Preferred Language',
        
        // Buttons
        createAccount: 'Create Account',
        login: 'Login',
        
        // Other texts
        alreadyHaveAccount: 'Already have an account?',
        agreeToTerms: 'I agree to the',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        and: 'and',
        
        // Placeholders
        enterName: 'Enter your full name',
        enterEmail: 'Enter your email address',
        enterPhone: 'Enter your phone number',
        enterPassword: 'Enter password',
        reenterPassword: 'Re-enter password',
        enterSchool: 'Enter school/university name',
        enterSpecialization: 'Enter your specialization',
        enterCity: 'Enter your city name',
        
        // Select options
        selectCountry: 'Select Country',
        selectGovernorate: 'Select Governorate/State',
        selectEducationLevel: 'Select Education Level',
        selectGrade: 'Select Grade',
        selectGender: 'Select Gender',
        selectLanguage: 'Select Preferred Language'
      },
      fr: {
        // Titres principaux
        title: 'Créer un Nouveau Compte',
        subtitle: 'Rejoignez-nous et découvrez votre parcours professionnel idéal',
        
        // Données personnelles
        personalInfo: 'Informations Personnelles',
        fullName: 'Nom Complet',
        email: 'Adresse Email',
        phone: 'Numéro de Téléphone',
        birthDate: 'Date de Naissance',
        gender: 'Sexe',
        male: 'Homme',
        female: 'Femme',
        
        // Données de localisation
        locationInfo: 'Informations de Localisation',
        country: 'Pays',
        governorate: 'Gouvernorat/État',
        city: 'Ville',
        
        // Données éducatives
        educationInfo: 'Informations Éducatives',
        educationLevel: 'Niveau d\'Éducation',
        currentGrade: 'Classe Actuelle',
        school: 'École/Université',
        specialization: 'Spécialisation',
        
        // Mot de passe
        password: 'Mot de Passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        
        // Langue
        preferredLanguage: 'Langue Préférée',
        
        // Boutons
        createAccount: 'Créer un Compte',
        login: 'Se Connecter',
        
        // Autres textes
        alreadyHaveAccount: 'Vous avez déjà un compte?',
        agreeToTerms: 'J\'accepte les',
        termsOfService: 'Conditions d\'Utilisation',
        privacyPolicy: 'Politique de Confidentialité',
        and: 'et',
        
        // Placeholders
        enterName: 'Entrez votre nom complet',
        enterEmail: 'Entrez votre adresse email',
        enterPhone: 'Entrez votre numéro de téléphone',
        enterPassword: 'Entrez le mot de passe',
        reenterPassword: 'Ressaisissez le mot de passe',
        enterSchool: 'Entrez le nom de l\'école/université',
        enterSpecialization: 'Entrez votre spécialisation',
        enterCity: 'Entrez le nom de votre ville',
        
        // Options de sélection
        selectCountry: 'Sélectionner le Pays',
        selectGovernorate: 'Sélectionner le Gouvernorat/État',
        selectEducationLevel: 'Sélectionner le Niveau d\'Éducation',
        selectGrade: 'Sélectionner la Classe',
        selectGender: 'Sélectionner le Sexe',
        selectLanguage: 'Sélectionner la Langue Préférée'
      }
    };
    
    return translations[formData.preferredLanguage]?.[key] || translations.ar[key] || key;
  };

  // دالة للحصول على المحافظات حسب البلد المختار
  const getGovernorates = () => {
    if (!formData.country) return [];
    return countries[formData.country]?.governorates || [];
  };

  // دالة للحصول على الصفوف حسب المرحلة التعليمية
  const getGrades = () => {
    if (!formData.educationLevel) return [];
    return educationLevels[formData.educationLevel]?.grades || [];
  };

  // دالة للتعامل مع تغيير القيم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // إذا تغير البلد، مسح المحافظة
      if (name === 'country') {
        newData.governorate = '';
      }
      
      // إذا تغيرت المرحلة التعليمية، مسح الصف
      if (name === 'educationLevel') {
        newData.currentGrade = '';
      }
      
      return newData;
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('كلمتا المرور غير متطابقتين')
      return
    }

    setIsLoading(true)
    
    // محاكاة عملية إنشاء الحساب مع بيانات شاملة
    setTimeout(() => {
      // حفظ بيانات المستخدم في localStorage
      const userData = {
        // البيانات الشخصية
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        
        // البيانات الجغرافية
        country: formData.country,
        countryName: countries[formData.country]?.name[formData.preferredLanguage] || '',
        governorate: formData.governorate,
        governorateName: countries[formData.country]?.governorates.find(g => g.code === formData.governorate)?.name[formData.preferredLanguage] || '',
        city: formData.city,
        
        // البيانات التعليمية
        educationLevel: formData.educationLevel,
        educationLevelName: educationLevels[formData.educationLevel]?.name[formData.preferredLanguage] || '',
        currentGrade: formData.currentGrade,
        currentGradeName: educationLevels[formData.educationLevel]?.grades.find(g => g.code === formData.currentGrade)?.name[formData.preferredLanguage] || '',
        school: formData.school,
        specialization: formData.specialization,
        
        // بيانات أخرى
        preferredLanguage: formData.preferredLanguage,
        registrationDate: new Date().toISOString(),
        token: 'school2career_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      }
      
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('userToken', userData.token)
      localStorage.setItem('userLanguage', formData.preferredLanguage)
      
      console.log('تم حفظ بيانات المستخدم:', userData)
      
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animation"></div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <Link href="/" className="logo">School2Career</Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/assessments" className="nav-link">التقييمات</Link>
            <Link href="/careers" className="nav-link">المهن</Link>
            <Link href="/about" className="nav-link">عن المنصة</Link>
            <Link href="/login">
              <button className="cta-button">تسجيل الدخول</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 20px 40px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '25px',
          padding: '50px',
          width: '100%',
          maxWidth: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Card Background Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 0%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
            zIndex: -1
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              إنشاء حساب جديد
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              انضم إلينا واكتشف مسارك المهني المثالي
            </p>
          </div>

          <form onSubmit={handleSignup}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px', 
              marginBottom: '25px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  العمر
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                >
                  <option value="">اختر عمرك</option>
                  <option value="13-15">13-15 سنة</option>
                  <option value="16-18">16-18 سنة</option>
                  <option value="19-25">19-25 سنة</option>
                  <option value="26-35">26-35 سنة</option>
                  <option value="36+">36+ سنة</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px', 
              marginBottom: '25px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  الجنس
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  المستوى التعليمي
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                >
                  <option value="">اختر مستواك التعليمي</option>
                  <option value="middle-school">المرحلة المتوسطة</option>
                  <option value="high-school">المرحلة الثانوية</option>
                  <option value="university">الجامعة</option>
                  <option value="graduate">خريج</option>
                  <option value="postgraduate">دراسات عليا</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px', 
              marginBottom: '30px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  تأكيد كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="أعد كتابة كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  required
                  style={{ 
                    marginLeft: '10px',
                    accentColor: 'var(--accent-neon)'
                  }} 
                />
                أوافق على{' '}
                <Link href="/terms" style={{ color: 'var(--accent-neon)', marginRight: '5px', marginLeft: '5px' }}>
                  شروط الاستخدام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" style={{ color: 'var(--accent-neon)', marginRight: '5px' }}>
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                background: isLoading ? 'var(--text-secondary)' : 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginLeft: '10px'
                  }}></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                'إنشاء الحساب'
              )}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              لديك حساب بالفعل؟
            </p>
            <Link href="/login">
              <button style={{
                padding: '15px 30px',
                background: 'transparent',
                color: 'var(--accent-purple)',
                border: '2px solid var(--accent-purple)',
                borderRadius: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                تسجيل الدخول
              </button>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}