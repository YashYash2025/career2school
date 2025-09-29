'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation, LanguageSwitcher } from '../lib/translation'

export default function Signup() {
  const { t, currentLanguage, direction, changeLanguage } = useTranslation()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: '',
    country: '',
    governorate: '',
    city: '',
    educationLevel: '',
    currentGrade: '',
    schoolName: '',
    specialization: '',
    preferredLanguage: currentLanguage || 'ar'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Reference data states - تهيئة بمصفوفات فارغة
  const [countries, setCountries] = useState([])
  const [governorates, setGovernorates] = useState([])
  const [cities, setCities] = useState([])
  const [educationLevels, setEducationLevels] = useState([])
  const [grades, setGrades] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Load reference data - اولاً جرب من API وبعدين استخدم البيانات الثابتة
  useEffect(() => {
    loadReferenceData()
  }, [])
  
  // Update form language when global language changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, preferredLanguage: currentLanguage }))
  }, [currentLanguage])
  
  const loadReferenceData = async () => {
    console.log('Loading reference data...')
    try {
      // تحميل الدول من قاعدة البيانات
      const countriesResponse = await fetch('/api/reference?type=countries')
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json()
        console.log('Countries API response:', countriesData)
        
        if (countriesData.success && countriesData.data && countriesData.data.countries) {
          // تحويل بيانات قاعدة البيانات إلى الشكل المطلوب
          const formattedCountries = countriesData.data.countries.map(country => ({
            code: country.code,
            name: {
              ar: country.name_ar,
              en: country.name_en,
              fr: country.name_fr
            }
          }))
          setCountries(formattedCountries)
          console.log('Countries loaded from API:', formattedCountries.length)
          
          // تحميل المراحل التعليمية
          const educationResponse = await fetch('/api/reference?type=education_levels')
          if (educationResponse.ok) {
            const educationData = await educationResponse.json()
            console.log('Education API response:', educationData)
            
            if (educationData.success && educationData.data && educationData.data.education_levels) {
              const formattedEducationLevels = educationData.data.education_levels.map(level => ({
                code: level.code,
                name: {
                  ar: level.name_ar,
                  en: level.name_en,
                  fr: level.name_fr
                },
                sort_order: level.sort_order
              }))
              setEducationLevels(formattedEducationLevels)
              console.log('Education levels loaded from API:', formattedEducationLevels.length)
            }
          }
          
          setIsDataLoaded(true)
          return // نجح في تحميل البيانات من API
        }
      }
      throw new Error('API failed')
    } catch (error) {
      console.log('API failed, loading fallback data...', error.message)
      // البيانات الثابتة الشاملة
      const fallbackCountries = [
        // دول الشرق الأوسط وشمال أفريقيا
        { code: 'EG', name: { ar: 'مصر', en: 'Egypt', fr: 'Égypte' } },
        { code: 'SA', name: { ar: 'السعودية', en: 'Saudi Arabia', fr: 'Arabie Saoudite' } },
        { code: 'AE', name: { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates', fr: 'Émirats Arabes Unis' } },
        { code: 'QA', name: { ar: 'قطر', en: 'Qatar', fr: 'Qatar' } },
        { code: 'KW', name: { ar: 'الكويت', en: 'Kuwait', fr: 'Koweït' } },
        { code: 'BH', name: { ar: 'البحرين', en: 'Bahrain', fr: 'Bahreïn' } },
        { code: 'OM', name: { ar: 'عُمان', en: 'Oman', fr: 'Oman' } },
        { code: 'JO', name: { ar: 'الأردن', en: 'Jordan', fr: 'Jordanie' } },
        { code: 'LB', name: { ar: 'لبنان', en: 'Lebanon', fr: 'Liban' } },
        { code: 'SY', name: { ar: 'سوريا', en: 'Syria', fr: 'Syrie' } },
        { code: 'IQ', name: { ar: 'العراق', en: 'Iraq', fr: 'Irak' } },
        { code: 'PS', name: { ar: 'فلسطين', en: 'Palestine', fr: 'Palestine' } },
        { code: 'YE', name: { ar: 'اليمن', en: 'Yemen', fr: 'Yémen' } },
        { code: 'MA', name: { ar: 'المغرب', en: 'Morocco', fr: 'Maroc' } },
        { code: 'TN', name: { ar: 'تونس', en: 'Tunisia', fr: 'Tunisie' } },
        { code: 'DZ', name: { ar: 'الجزائر', en: 'Algeria', fr: 'Algérie' } },
        { code: 'LY', name: { ar: 'ليبيا', en: 'Libya', fr: 'Libye' } },
        { code: 'SD', name: { ar: 'السودان', en: 'Sudan', fr: 'Soudan' } },
        // دول أوروبية رئيسية
        { code: 'DE', name: { ar: 'ألمانيا', en: 'Germany', fr: 'Allemagne' } },
        { code: 'FR', name: { ar: 'فرنسا', en: 'France', fr: 'France' } },
        { code: 'GB', name: { ar: 'المملكة المتحدة', en: 'United Kingdom', fr: 'Royaume-Uni' } },
        { code: 'IT', name: { ar: 'إيطاليا', en: 'Italy', fr: 'Italie' } },
        { code: 'ES', name: { ar: 'إسبانيا', en: 'Spain', fr: 'Espagne' } },
        { code: 'NL', name: { ar: 'هولندا', en: 'Netherlands', fr: 'Pays-Bas' } },
        // دول أمريكا الشمالية
        { code: 'US', name: { ar: 'الولايات المتحدة', en: 'United States', fr: 'États-Unis' } },
        { code: 'CA', name: { ar: 'كندا', en: 'Canada', fr: 'Canada' } },
        // دول آسيوية رئيسية
        { code: 'CN', name: { ar: 'الصين', en: 'China', fr: 'Chine' } },
        { code: 'JP', name: { ar: 'اليابان', en: 'Japan', fr: 'Japon' } },
        { code: 'KR', name: { ar: 'كوريا الجنوبية', en: 'South Korea', fr: 'Corée du Sud' } },
        { code: 'IN', name: { ar: 'الهند', en: 'India', fr: 'Inde' } },
        { code: 'PK', name: { ar: 'باكستان', en: 'Pakistan', fr: 'Pakistan' } },
        { code: 'BD', name: { ar: 'بنغلاديش', en: 'Bangladesh', fr: 'Bangladesh' } },
        { code: 'TR', name: { ar: 'تركيا', en: 'Turkey', fr: 'Turquie' } },
        { code: 'IR', name: { ar: 'إيران', en: 'Iran', fr: 'Iran' } },
        { code: 'AF', name: { ar: 'أفغانستان', en: 'Afghanistan', fr: 'Afghanistan' } },
        // دول أفريقية
        { code: 'NG', name: { ar: 'نيجيريا', en: 'Nigeria', fr: 'Nigeria' } },
        { code: 'ZA', name: { ar: 'جنوب أفريقيا', en: 'South Africa', fr: 'Afrique du Sud' } },
        { code: 'KE', name: { ar: 'كينيا', en: 'Kenya', fr: 'Kenya' } },
        { code: 'ET', name: { ar: 'إثيوبيا', en: 'Ethiopia', fr: 'Éthiopie' } },
        { code: 'GH', name: { ar: 'غانا', en: 'Ghana', fr: 'Ghana' } },
        { code: 'UG', name: { ar: 'أوغندا', en: 'Uganda', fr: 'Ouganda' } },
        { code: 'TZ', name: { ar: 'تنزانيا', en: 'Tanzania', fr: 'Tanzanie' } },
        // دول أوروبية إضافية
        { code: 'SE', name: { ar: 'السويد', en: 'Sweden', fr: 'Suède' } },
        { code: 'NO', name: { ar: 'النرويج', en: 'Norway', fr: 'Norvège' } },
        { code: 'DK', name: { ar: 'الدنمارك', en: 'Denmark', fr: 'Danemark' } },
        { code: 'FI', name: { ar: 'فنلندا', en: 'Finland', fr: 'Finlande' } },
        { code: 'CH', name: { ar: 'سويسرا', en: 'Switzerland', fr: 'Suisse' } },
        { code: 'AT', name: { ar: 'النمسا', en: 'Austria', fr: 'Autriche' } },
        { code: 'BE', name: { ar: 'بلجيكا', en: 'Belgium', fr: 'Belgique' } },
        { code: 'PT', name: { ar: 'البرتغال', en: 'Portugal', fr: 'Portugal' } },
        { code: 'GR', name: { ar: 'اليونان', en: 'Greece', fr: 'Grèce' } },
        { code: 'PL', name: { ar: 'بولندا', en: 'Poland', fr: 'Pologne' } },
        { code: 'CZ', name: { ar: 'التشيك', en: 'Czech Republic', fr: 'République Tchèque' } },
        { code: 'HU', name: { ar: 'المجر', en: 'Hungary', fr: 'Hongrie' } },
        // دول أمريكا اللاتينية
        { code: 'BR', name: { ar: 'البرازيل', en: 'Brazil', fr: 'Brésil' } },
        { code: 'MX', name: { ar: 'المكسيك', en: 'Mexico', fr: 'Mexique' } },
        { code: 'AR', name: { ar: 'الأرجنتين', en: 'Argentina', fr: 'Argentine' } },
        { code: 'CL', name: { ar: 'تشيلي', en: 'Chile', fr: 'Chili' } },
        { code: 'CO', name: { ar: 'كولومبيا', en: 'Colombia', fr: 'Colombie' } },
        { code: 'PE', name: { ar: 'بيرو', en: 'Peru', fr: 'Pérou' } },
        // دول آسيوية إضافية
        { code: 'TH', name: { ar: 'تايلاند', en: 'Thailand', fr: 'Thaïlande' } },
        { code: 'VN', name: { ar: 'فيتنام', en: 'Vietnam', fr: 'Viêt Nam' } },
        { code: 'MY', name: { ar: 'ماليزيا', en: 'Malaysia', fr: 'Malaisie' } },
        { code: 'SG', name: { ar: 'سنغافورة', en: 'Singapore', fr: 'Singapour' } },
        { code: 'PH', name: { ar: 'الفلبين', en: 'Philippines', fr: 'Philippines' } },
        { code: 'ID', name: { ar: 'إندونيسيا', en: 'Indonesia', fr: 'Indonésie' } },
        // دول أوقيانوسيا
        { code: 'AU', name: { ar: 'أستراليا', en: 'Australia', fr: 'Australie' } },
        { code: 'NZ', name: { ar: 'نيوزيلندا', en: 'New Zealand', fr: 'Nouvelle-Zélande' } }
      ]
      setCountries(fallbackCountries)
      console.log('Fallback countries loaded:', fallbackCountries.length)
      
      // المراحل التعليمية
      const fallbackEducationLevels = [
        { code: 'elementary', name: { ar: 'ابتدائي', en: 'Elementary', fr: 'Élémentaire' }, sort_order: 1 },
        { code: 'middle', name: { ar: 'إعدادي', en: 'Middle School', fr: 'Collège' }, sort_order: 2 },
        { code: 'high', name: { ar: 'ثانوي', en: 'High School', fr: 'Lycée' }, sort_order: 3 },
        { code: 'university', name: { ar: 'جامعي', en: 'University', fr: 'Université' }, sort_order: 4 },
        { code: 'graduate', name: { ar: 'خريج', en: 'Graduate', fr: 'Diplômé' }, sort_order: 5 },
        { code: 'postgraduate', name: { ar: 'دراسات عليا', en: 'Postgraduate', fr: 'Études supérieures' }, sort_order: 6 }
      ]
      setEducationLevels(fallbackEducationLevels)
      console.log('Education levels loaded:', fallbackEducationLevels.length)
      setIsDataLoaded(true)
    }
  }

  // Load governorates when country changes
  useEffect(() => {
    const loadGovernorates = async () => {
      if (formData.country) {
        try {
          const response = await fetch(`/api/reference?type=governorates&parent=${formData.country}`)
          if (response.ok) {
            const data = await response.json()
            setGovernorates(data.data || [])
          } else {
            throw new Error('DB not ready')
          }
        } catch (error) {
          // بيانات المحافظات الثابتة
          const staticGovernorates = {
            'EG': [
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
              { code: 'ASW', name: { ar: 'أسوان', en: 'Aswan', fr: 'Assouan' } },
              { code: 'LXR', name: { ar: 'الأقصر', en: 'Luxor', fr: 'Louxor' } }
            ],
            'SA': [
              { code: 'RYD', name: { ar: 'الرياض', en: 'Riyadh', fr: 'Riyad' } },
              { code: 'MKK', name: { ar: 'مكة المكرمة', en: 'Makkah', fr: 'La Mecque' } },
              { code: 'MDN', name: { ar: 'المدينة المنورة', en: 'Madinah', fr: 'Médine' } },
              { code: 'EAS', name: { ar: 'الشرقية', en: 'Eastern Province', fr: 'Province orientale' } },
              { code: 'ASR', name: { ar: 'عسير', en: 'Asir', fr: 'Assir' } },
              { code: 'TAB', name: { ar: 'تبوك', en: 'Tabuk', fr: 'Tabouk' } },
              { code: 'HAL', name: { ar: 'حائل', en: 'Hail', fr: 'Haïtl' } },
              { code: 'JZN', name: { ar: 'جازان', en: 'Jazan', fr: 'Jizan' } },
              { code: 'NJR', name: { ar: 'نجران', en: 'Najran', fr: 'Najran' } },
              { code: 'BAH', name: { ar: 'الباحة', en: 'Al Bahah', fr: 'Al Bahah' } },
              { code: 'QSM', name: { ar: 'القصيم', en: 'Al Qassim', fr: 'Al Qassim' } }
            ],
            'AE': [
              { code: 'AUH', name: { ar: 'أبو ظبي', en: 'Abu Dhabi', fr: 'Abou Dabi' } },
              { code: 'DXB', name: { ar: 'دبي', en: 'Dubai', fr: 'Dubaï' } },
              { code: 'SHJ', name: { ar: 'الشارقة', en: 'Sharjah', fr: 'Charjah' } },
              { code: 'AJM', name: { ar: 'عجمان', en: 'Ajman', fr: 'Ajman' } },
              { code: 'RAK', name: { ar: 'رأس الخيمة', en: 'Ras Al Khaimah', fr: 'Ras el Khaïmah' } },
              { code: 'FUJ', name: { ar: 'الفجيرة', en: 'Fujairah', fr: 'Foujairah' } },
              { code: 'UAQ', name: { ar: 'أم القيوين', en: 'Umm Al Quwain', fr: 'Oumm al Qaïwaïn' } }
            ],
            'QA': [
              { code: 'DOH', name: { ar: 'الدوحة', en: 'Doha', fr: 'Doha' } },
              { code: 'RAY', name: { ar: 'الريان', en: 'Al Rayyan', fr: 'Al Rayyan' } },
              { code: 'WAK', name: { ar: 'الوكرة', en: 'Al Wakrah', fr: 'Al Wakrah' } }
            ],
            'KW': [
              { code: 'CAP', name: { ar: 'محافظة العاصمة', en: 'Capital Governorate', fr: 'Gouvernorat de la capitale' } },
              { code: 'HAW', name: { ar: 'محافظة حولي', en: 'Hawalli Governorate', fr: 'Gouvernorat de Hawalli' } },
              { code: 'FAR', name: { ar: 'محافظة الفروانية', en: 'Farwaniya Governorate', fr: 'Gouvernorat de Farwaniya' } }
            ],
            'BH': [
              { code: 'CAP', name: { ar: 'محافظة العاصمة', en: 'Capital Governorate', fr: 'Gouvernorat de la capitale' } },
              { code: 'MUH', name: { ar: 'محافظة المحرق', en: 'Muharraq Governorate', fr: 'Gouvernorat de Muharraq' } },
              { code: 'SOU', name: { ar: 'محافظة الجنوبية', en: 'Southern Governorate', fr: 'Gouvernorat du Sud' } }
            ],
            'OM': [
              { code: 'MUS', name: { ar: 'محافظة مسقط', en: 'Muscat Governorate', fr: 'Gouvernorat de Mascate' } },
              { code: 'DHA', name: { ar: 'محافظة ظفار', en: 'Dhofar Governorate', fr: 'Gouvernorat de Dhofar' } },
              { code: 'BAT', name: { ar: 'محافظة الباطنة', en: 'Al Batinah Governorate', fr: 'Gouvernorat d\'Al Batinah' } }
            ],
            'JO': [
              { code: 'AMM', name: { ar: 'عمان', en: 'Amman', fr: 'Amman' } },
              { code: 'ZAR', name: { ar: 'الزرقاء', en: 'Zarqa', fr: 'Zarqa' } },
              { code: 'IRB', name: { ar: 'إربد', en: 'Irbid', fr: 'Irbid' } },
              { code: 'AQL', name: { ar: 'العقبة', en: 'Aqaba', fr: 'Aqaba' } },
              { code: 'BAL', name: { ar: 'البلقاء', en: 'Balqa', fr: 'Balqa' } },
              { code: 'MAD', name: { ar: 'مأدبا', en: 'Madaba', fr: 'Madaba' } }
            ],
            'LB': [
              { code: 'BEI', name: { ar: 'بيروت', en: 'Beirut', fr: 'Beyrouth' } },
              { code: 'MOU', name: { ar: 'جبل لبنان', en: 'Mount Lebanon', fr: 'Mont-Liban' } },
              { code: 'NOR', name: { ar: 'الشمال', en: 'North Lebanon', fr: 'Liban-Nord' } },
              { code: 'SOU', name: { ar: 'الجنوب', en: 'South Lebanon', fr: 'Liban-Sud' } },
              { code: 'BEK', name: { ar: 'البقاع', en: 'Bekaa', fr: 'Bekaa' } },
              { code: 'NAB', name: { ar: 'النبطية', en: 'Nabatieh', fr: 'Nabatié' } }
            ],
            'MA': [
              { code: 'CAS', name: { ar: 'الدار البيضاء', en: 'Casablanca', fr: 'Casablanca' } },
              { code: 'RAB', name: { ar: 'الرباط', en: 'Rabat', fr: 'Rabat' } },
              { code: 'FES', name: { ar: 'فاس', en: 'Fez', fr: 'Fès' } },
              { code: 'MAR', name: { ar: 'مراكش', en: 'Marrakech', fr: 'Marrakech' } },
              { code: 'TAN', name: { ar: 'طنجة', en: 'Tangier', fr: 'Tanger' } },
              { code: 'AGA', name: { ar: 'أكادير', en: 'Agadir', fr: 'Agadir' } }
            ],
            'TN': [
              { code: 'TUN', name: { ar: 'تونس', en: 'Tunis', fr: 'Tunis' } },
              { code: 'SFA', name: { ar: 'صفاقس', en: 'Sfax', fr: 'Sfax' } },
              { code: 'SOU', name: { ar: 'سوسة', en: 'Sousse', fr: 'Sousse' } },
              { code: 'GAB', name: { ar: 'قابس', en: 'Gabes', fr: 'Gabès' } },
              { code: 'BIZ', name: { ar: 'بنزرت', en: 'Bizerte', fr: 'Bizerte' } }
            ],
            'DZ': [
              { code: 'ALG', name: { ar: 'الجزائر', en: 'Algiers', fr: 'Alger' } },
              { code: 'ORA', name: { ar: 'وهران', en: 'Oran', fr: 'Oran' } },
              { code: 'CON', name: { ar: 'قسنطينة', en: 'Constantine', fr: 'Constantine' } },
              { code: 'ANN', name: { ar: 'عنابة', en: 'Annaba', fr: 'Annaba' } },
              { code: 'BAT', name: { ar: 'باتنة', en: 'Batna', fr: 'Batna' } }
            ],
            'US': [
              { code: 'CA', name: { ar: 'كاليفورنيا', en: 'California', fr: 'Californie' } },
              { code: 'NY', name: { ar: 'نيويورك', en: 'New York', fr: 'New York' } },
              { code: 'TX', name: { ar: 'تكساس', en: 'Texas', fr: 'Texas' } },
              { code: 'FL', name: { ar: 'فلوريدا', en: 'Florida', fr: 'Floride' } },
              { code: 'IL', name: { ar: 'إلينوي', en: 'Illinois', fr: 'Illinois' } },
              { code: 'WA', name: { ar: 'واشنطن', en: 'Washington', fr: 'Washington' } }
            ],
            'CA': [
              { code: 'ON', name: { ar: 'أونتاريو', en: 'Ontario', fr: 'Ontario' } },
              { code: 'QC', name: { ar: 'كيبيك', en: 'Quebec', fr: 'Québec' } },
              { code: 'BC', name: { ar: 'كولومبيا البريطانية', en: 'British Columbia', fr: 'Colombie-Britannique' } },
              { code: 'AB', name: { ar: 'ألبرتا', en: 'Alberta', fr: 'Alberta' } },
              { code: 'MB', name: { ar: 'مانيتوبا', en: 'Manitoba', fr: 'Manitoba' } }
            ],
            'DE': [
              { code: 'BY', name: { ar: 'بافاريا', en: 'Bavaria', fr: 'Bavière' } },
              { code: 'NW', name: { ar: 'شمال الراين-فستفاليا', en: 'North Rhine-Westphalia', fr: 'Rhénanie-du-Nord-Westphalie' } },
              { code: 'BW', name: { ar: 'بادن-فورتمبيرغ', en: 'Baden-Württemberg', fr: 'Bade-Wurtemberg' } },
              { code: 'NI', name: { ar: 'ساكسونيا السفلى', en: 'Lower Saxony', fr: 'Basse-Saxe' } },
              { code: 'HE', name: { ar: 'هيسن', en: 'Hesse', fr: 'Hesse' } }
            ],
            'FR': [
              { code: 'IDF', name: { ar: 'إيل دو فرانس', en: 'Île-de-France', fr: 'Île-de-France' } },
              { code: 'ARA', name: { ar: 'أوفيرن-رون-ألب', en: 'Auvergne-Rhône-Alpes', fr: 'Auvergne-Rhône-Alpes' } },
              { code: 'PAC', name: { ar: 'بروفانس-ألب-كوت دأزور', en: 'Provence-Alpes-Côte d\'Azur', fr: 'Provence-Alpes-Côte d\'Azur' } },
              { code: 'OCC', name: { ar: 'أوكسيتانيا', en: 'Occitania', fr: 'Occitanie' } },
              { code: 'NOR', name: { ar: 'نورماندي', en: 'Normandy', fr: 'Normandie' } }
            ]
          }
          setGovernorates(staticGovernorates[formData.country] || [])
        }
      } else {
        setGovernorates([])
      }
    }
    loadGovernorates()
  }, [formData.country])
  
  // Load grades when education level changes
  useEffect(() => {
    const loadGrades = async () => {
      if (formData.educationLevel) {
        const staticGrades = {
          'elementary': [
            { code: '1', name: { ar: 'الصف الأول', en: '1st Grade', fr: 'CP' } },
            { code: '2', name: { ar: 'الصف الثاني', en: '2nd Grade', fr: 'CE1' } },
            { code: '3', name: { ar: 'الصف الثالث', en: '3rd Grade', fr: 'CE2' } },
            { code: '4', name: { ar: 'الصف الرابع', en: '4th Grade', fr: 'CM1' } },
            { code: '5', name: { ar: 'الصف الخامس', en: '5th Grade', fr: 'CM2' } },
            { code: '6', name: { ar: 'الصف السادس', en: '6th Grade', fr: '6ème' } }
          ],
          'middle': [
            { code: '7', name: { ar: 'الصف الأول الإعدادي', en: '7th Grade', fr: '5ème' } },
            { code: '8', name: { ar: 'الصف الثاني الإعدادي', en: '8th Grade', fr: '4ème' } },
            { code: '9', name: { ar: 'الصف الثالث الإعدادي', en: '9th Grade', fr: '3ème' } }
          ],
          'high': [
            { code: '10', name: { ar: 'الصف الأول الثانوي', en: '10th Grade', fr: 'Seconde' } },
            { code: '11', name: { ar: 'الصف الثاني الثانوي', en: '11th Grade', fr: 'Première' } },
            { code: '12', name: { ar: 'الصف الثالث الثانوي', en: '12th Grade', fr: 'Terminale' } }
          ],
          'university': [
            { code: '1', name: { ar: 'السنة الأولى', en: '1st Year', fr: '1ère année' } },
            { code: '2', name: { ar: 'السنة الثانية', en: '2nd Year', fr: '2ème année' } },
            { code: '3', name: { ar: 'السنة الثالثة', en: '3rd Year', fr: '3ème année' } },
            { code: '4', name: { ar: 'السنة الرابعة', en: '4th Year', fr: '4ème année' } },
            { code: '5', name: { ar: 'السنة الخامسة', en: '5th Year', fr: '5ème année' } },
            { code: '6', name: { ar: 'السنة السادسة', en: '6th Year', fr: '6ème année' } }
          ],
          'graduate': [
            { code: 'recent', name: { ar: 'خريج حديث (0-2 سنة)', en: 'Recent Graduate (0-2 years)', fr: 'Diplômé récent (0-2 ans)' } },
            { code: 'exp', name: { ar: 'خريج ذو خبرة (2+ سنوات)', en: 'Experienced Graduate (2+ years)', fr: 'Diplômé expérimenté (2+ ans)' } }
          ],
          'postgraduate': [
            { code: 'masters', name: { ar: 'ماجستير', en: 'Master\'s Degree', fr: 'Master' } },
            { code: 'phd', name: { ar: 'دكتوراه', en: 'PhD', fr: 'Doctorat' } },
            { code: 'diploma', name: { ar: 'دبلوم عالي', en: 'Higher Diploma', fr: 'Diplôme supérieur' } }
          ]
        }
        setGrades(staticGrades[formData.educationLevel] || [])
      } else {
        setGrades([])
      }
    }
    loadGrades()
  }, [formData.educationLevel])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Clear dependent fields
      ...(name === 'country' && { governorate: '', city: '' }),
      ...(name === 'educationLevel' && { currentGrade: '' })
    }))
  }

  const getName = (item) => {
    if (!item || !item.name) {
      console.log('Invalid item:', item)
      return ''
    }
    const name = item.name[currentLanguage] || item.name.ar || item.name.en || ''
    console.log('Getting name for:', item.code, 'in language:', currentLanguage, 'result:', name)
    return name
  }
  
  // الترجمات الكاملة
  const translations = {
    ar: {
      title: 'إنشاء حساب جديد',
      subtitle: 'انضم إلينا واكتشف مسارك المهني المثالي',
      personalInfo: 'البيانات الشخصية',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      birthDate: 'تاريخ الميلاد',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      locationInfo: 'البيانات الجغرافية',
      country: 'البلد',
      governorate: 'المحافظة',
      city: 'المدينة',
      educationInfo: 'البيانات التعليمية',
      educationLevel: 'المرحلة الدراسية',
      currentGrade: 'الصف الحالي',
      schoolName: 'المدرسة/الجامعة',
      specialization: 'التخصص',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      createAccount: 'إنشاء الحساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      selectCountry: 'اختر البلد',
      selectGovernorate: 'اختر المحافظة',
      selectEducationLevel: 'اختر المرحلة الدراسية',
      selectGrade: 'اختر الصف',
      selectGender: 'اختر الجنس',
      enterFirstName: 'أدخل الاسم الأول',
      enterLastName: 'أدخل الاسم الأخير',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPhone: 'أدخل رقم هاتفك',
      enterPassword: 'أدخل كلمة المرور',
      reenterPassword: 'أعد كتابة كلمة المرور',
      enterSchool: 'أدخل اسم المدرسة/الجامعة',
      enterSpecialization: 'أدخل تخصصك',
      enterCity: 'أدخل اسم مدينتك',
      creating: 'جاري إنشاء الحساب...',
      passwordMismatch: 'كلمتا المرور غير متطابقتين'
    },
    en: {
      title: 'Create New Account',
      subtitle: 'Join us and discover your ideal career path',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      birthDate: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      locationInfo: 'Location Information',
      country: 'Country',
      governorate: 'Governorate/State',
      city: 'City',
      educationInfo: 'Educational Information',
      educationLevel: 'Education Level',
      currentGrade: 'Current Grade',
      schoolName: 'School/University',
      specialization: 'Specialization',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Login',
      selectCountry: 'Select Country',
      selectGovernorate: 'Select Governorate/State',
      selectEducationLevel: 'Select Education Level',
      selectGrade: 'Select Grade',
      selectGender: 'Select Gender',
      enterFirstName: 'Enter first name',
      enterLastName: 'Enter last name',
      enterEmail: 'Enter email address',
      enterPhone: 'Enter phone number',
      enterPassword: 'Enter password',
      reenterPassword: 'Re-enter password',
      enterSchool: 'Enter school/university name',
      enterSpecialization: 'Enter specialization',
      enterCity: 'Enter city name',
      creating: 'Creating Account...',
      passwordMismatch: 'Passwords do not match'
    },
    fr: {
      title: 'Créer un Nouveau Compte',
      subtitle: 'Rejoignez-nous et découvrez votre parcours professionnel idéal',
      personalInfo: 'Informations Personnelles',
      firstName: 'Prénom',
      lastName: 'Nom de Famille',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      birthDate: 'Date de Naissance',
      gender: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      locationInfo: 'Informations de Localisation',
      country: 'Pays',
      governorate: 'Gouvernorat/État',
      city: 'Ville',
      educationInfo: 'Informations Éducatives',
      educationLevel: 'Niveau d\'Éducation',
      currentGrade: 'Classe Actuelle',
      schoolName: 'École/Université',
      specialization: 'Spécialisation',
      password: 'Mot de Passe',
      confirmPassword: 'Confirmer le Mot de Passe',
      createAccount: 'Créer un Compte',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      login: 'Se Connecter',
      selectCountry: 'Sélectionner le Pays',
      selectGovernorate: 'Sélectionner le Gouvernorat/État',
      selectEducationLevel: 'Sélectionner le Niveau d\'Éducation',
      selectGrade: 'Sélectionner la Classe',
      selectGender: 'Sélectionner le Sexe',
      enterFirstName: 'Entrez le prénom',
      enterLastName: 'Entrez le nom de famille',
      enterEmail: 'Entrez l\'adresse email',
      enterPhone: 'Entrez le numéro de téléphone',
      enterPassword: 'Entrez le mot de passe',
      reenterPassword: 'Ressaisissez le mot de passe',
      enterSchool: 'Entrez le nom de l\'école/université',
      enterSpecialization: 'Entrez la spécialisation',
      enterCity: 'Entrez le nom de la ville',
      creating: 'Création du compte...',
      passwordMismatch: 'Les mots de passe ne correspondent pas'
    }
  }
  
  const getText = (key) => {
    return translations[currentLanguage]?.[key] || translations.ar[key] || key
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert(getText('passwordMismatch'))
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        governorate: formData.governorate,
        city: formData.city,
        token: 'school2career_' + Date.now()
      }
      
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('userToken', userData.token)
      
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div dir={direction} className="min-h-screen">
      {/* Animated Background */}
      <div className="bg-animation"></div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      {/* Navigation with Language Switcher */}
      <nav>
        <div className="nav-container">
          <Link href="/" className="logo">School2Career</Link>
          <div className="nav-links">
            <LanguageSwitcher />
            <Link href="/" className="nav-link">{currentLanguage === 'ar' ? 'الرئيسية' : currentLanguage === 'en' ? 'Home' : 'Accueil'}</Link>
            <Link href="/assessments" className="nav-link">{currentLanguage === 'ar' ? 'التقييمات' : currentLanguage === 'en' ? 'Assessments' : 'Évaluations'}</Link>
            <Link href="/careers" className="nav-link">{currentLanguage === 'ar' ? 'المهن' : currentLanguage === 'en' ? 'Careers' : 'Carrières'}</Link>
            <Link href="/about" className="nav-link">{currentLanguage === 'ar' ? 'عن المنصة' : currentLanguage === 'en' ? 'About' : 'À propos'}</Link>
            <Link href="/login">
              <button className="cta-button">{getText('login')}</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
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
          maxWidth: '800px',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              {getText('title')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              {getText('subtitle')}
            </p>
          </div>

          <form onSubmit={handleSignup}>
            {/* Personal Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '20px', 
                marginBottom: '20px',
                borderBottom: '2px solid var(--accent-neon)',
                paddingBottom: '10px'
              }}>
                {getText('personalInfo')}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('firstName')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterFirstName')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterLastName')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('email')}
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
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterEmail')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterPhone')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('gender')}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="">{getText('selectGender')}</option>
                    <option value="male">{getText('male')}</option>
                    <option value="female">{getText('female')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '20px', 
                marginBottom: '20px',
                borderBottom: '2px solid var(--accent-purple)',
                paddingBottom: '10px'
              }}>
                {getText('locationInfo')}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('country')}
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="">{getText('selectCountry')}</option>
                    {countries && countries.length > 0 ? (
                      countries.map(country => {
                        console.log('Rendering country:', country)
                        return (
                          <option key={country.code} value={country.code}>
                            {getName(country)}
                          </option>
                        )
                      })
                    ) : (
                      <option disabled>جاري تحميل البيانات...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('governorate')}
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    disabled={!formData.country}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: formData.country ? 1 : 0.5
                    }}
                  >
                    <option value="">{getText('selectGovernorate')}</option>
                    {governorates && governorates.length > 0 && governorates.map(governorate => (
                      <option key={governorate.code} value={governorate.code}>
                        {getName(governorate)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterCity')}
                  />
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '20px', 
                marginBottom: '20px',
                borderBottom: '2px solid var(--accent-blue)',
                paddingBottom: '10px'
              }}>
                {getText('educationInfo')}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('educationLevel')}
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="">{getText('selectEducationLevel')}</option>
                    {educationLevels && educationLevels.length > 0 ? (
                      educationLevels.map(level => {
                        console.log('Rendering education level:', level)
                        return (
                          <option key={level.code} value={level.code}>
                            {getName(level)}
                          </option>
                        )
                      })
                    ) : (
                      <option disabled>جاري تحميل المراحل التعليمية...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('currentGrade')}
                  </label>
                  <select
                    name="currentGrade"
                    value={formData.currentGrade}
                    onChange={handleInputChange}
                    disabled={!formData.educationLevel}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: formData.educationLevel ? 1 : 0.5
                    }}
                  >
                    <option value="">{getText('selectGrade')}</option>
                    {grades && grades.length > 0 && grades.map(grade => (
                      <option key={grade.code} value={grade.code}>
                        {getName(grade)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('schoolName')}
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterSchool')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('specialization')}
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterSpecialization')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('birthDate')}
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '20px', 
                marginBottom: '20px',
                borderBottom: '2px solid var(--accent-orange)',
                paddingBottom: '10px'
              }}>
                كلمة المرور
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('password')}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('enterPassword')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {getText('confirmPassword')}
                  </label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={getText('reenterPassword')}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? getText('creating') : getText('createAccount')}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {getText('alreadyHaveAccount')}
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
                {getText('login')}
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}