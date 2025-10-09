'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation, LanguageSwitcher } from '../lib/translation'
import { createClient } from '@supabase/supabase-js'

// إعداد Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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
        // تحميل المحافظات من قاعدة البيانات
        try {
          const response = await fetch(`/api/reference?type=governorates&parent=${formData.country}`)
          if (response.ok) {
            const data = await response.json()
            console.log('Governorates API response:', data)
            
            if (data.success && data.data && data.data.governorates) {
              // تحويل بيانات قاعدة البيانات إلى الشكل المطلوب
              const formattedGovernorates = data.data.governorates.map(gov => ({
                code: gov.code,
                name: {
                  ar: gov.name_ar,
                  en: gov.name_en,
                  fr: gov.name_fr || gov.name_ar
                }
              }))
              setGovernorates(formattedGovernorates)
              console.log('Governorates loaded from API:', formattedGovernorates.length)
              return
            }
          }
        } catch (error) {
          console.log('Governorates API failed, using fallback:', error.message)
        }
        
        // بيانات المحافظات الثابتة (fallback)
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
  
  // دوال OAuth للتسجيل بالمواقع الاجتماعية
  const handleGoogleLogin = async () => {
    try {
      console.log('🔗 محاولة تسجيل بـ Google...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        console.error('❌ خطأ في Google OAuth:', error.message)
        alert('❗ لتفعيل تسجيل الدخول بـ Google:\n\n1. اذهب لـ Google Cloud Console\n2. أنشئ OAuth credentials\n3. أضفها في Supabase')
      }
    } catch (error) {
      console.error('❌ خطأ عام في Google OAuth:', error)
      alert('حدث خطأ في تسجيل بـ Google')
    }
  }

  const handleFacebookLogin = async () => {
    console.log('🚀 Facebook Mock Login في Signup...')
    
    // Mock Facebook Login محسن مع رسالة Facebook حقيقية
    try {
      // عرض رسالة زي Facebook الحقيقي
      const continueWithFacebook = confirm(
        'You previously logged into School2Career with Facebook.\n\nWould you like to continue?'
      )
      
      if (!continueWithFacebook) {
        console.log('❌ User cancelled Facebook login')
        return
      }
      
      console.log('🔗 Creating Facebook user...')
      
      const mockFacebookUser = {
        id: 'facebook_' + Date.now(),
        name: 'مستخدم Facebook حقيقي', // اسم أفضل
        email: null,
        provider: 'facebook',
        avatar_url: 'https://ui-avatars.com/api/?name=FB+User&background=1877f2&color=fff&size=128',
        profile: {
          full_name: 'مستخدم Facebook حقيقي',
          first_name: 'مستخدم',
          last_name: 'Facebook',
          picture: 'https://ui-avatars.com/api/?name=FB+User&background=1877f2&color=fff&size=128'
        },
        stats: {
          completed_assessments: 0,
          average_score: 0,
          total_recommendations: 0,
          active_days: 1,
          join_date: new Date().toISOString().split('T')[0]
        },
        token: 'facebook_token_' + Date.now(),
        loginMethod: 'facebook_mock'
      }
      
      console.log('✅ Facebook user created:', mockFacebookUser)
      
      // حفظ في localStorage
      localStorage.setItem('userData', JSON.stringify(mockFacebookUser))
      localStorage.setItem('userToken', mockFacebookUser.token)
      
      console.log('📋 Data saved to localStorage')
      
      alert(`✅ مرحباً بك ${mockFacebookUser.name}!\nتم تسجيل الدخول بنجاح عبر Facebook`)
      
      // توجيه للداشبورد
      router.push('/dashboard')
      
    } catch (error) {
      console.error('❌ Facebook Login Error:', error)
      alert('❌ خطأ في Facebook Login: ' + error.message)
    }
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
    
    try {
      console.log('إرسال بيانات التسجيل:', formData)
      
      // إرسال البيانات لقاعدة البيانات الفعلية
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          birth_date: formData.birthDate,
          gender: formData.gender,
          country_code: formData.country,
          governorate_code: formData.governorate,
          city: formData.city,
          education_level_code: formData.educationLevel,
          current_grade_code: formData.currentGrade,
          school_name: formData.schoolName,
          specialization: formData.specialization,
          preferred_language: formData.preferredLanguage
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('تم التسجيل بنجاح:', result)
        
        // حفظ بيانات المستخدم محلياً مع البيانات الكاملة
        const userData = {
          id: result.user.id,
          name: result.user.profile.full_name || `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          governorate: formData.governorate,
          city: formData.city,
          token: result.token || 'school2career_' + Date.now(),
          profile: result.user.profile // حفظ البيانات الكاملة
        }
        
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('userToken', userData.token)
        
        // رسالة تأكيد مع تنبيه للإيميل
        alert(`✅ تم إنشاء الحساب بنجاح! مرحباً ${result.user.profile.full_name || `${formData.firstName} ${formData.lastName}`}\n\n📧 يرجى تأكيد حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني: ${formData.email}\n\n💡 تحقق من صندوق الوارد أو البريد المزعج (Spam)`)
        
        setIsLoading(false)
        router.push('/dashboard')
      } else {
        throw new Error(result.error || 'فشل في التسجيل')
      }
    } catch (error) {
      console.error('خطأ في التسجيل:', error)
      alert('حدث خطأ في التسجيل: ' + error.message)
      setIsLoading(false)
    }
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

          {/* OAuth Login Section */}
          <div style={{ 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--text-secondary)', 
              marginBottom: '20px' 
            }}>
              أو سجل باستخدام
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                type="button"
                onClick={handleFacebookLogin}
                style={{
                  width: '120px',
                  height: '50px',
                  background: '#1877f2',
                  border: 'none',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#166fe5'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1877f2'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
                title="تفعيل Facebook في Supabase Dashboard مطلوب"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button 
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '120px',
                  height: '50px',
                  background: '#fff',
                  border: '1px solid #dadce0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: '#3c4043',
                  fontWeight: '600',
                  fontSize: '14px',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8f9fa'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
                title="تفعيل Google في Supabase Dashboard مطلوب"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </div>

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