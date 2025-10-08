import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hardcoded reference data (fallback when database tables don't exist yet)
const REFERENCE_DATA = {
  countries: [
    { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' },
    { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', name_fr: 'Arabie Saoudite' },
    { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', name_fr: 'Émirats Arabes Unis' }
  ],
  governorates: {
    EG: [
      { code: 'CAI', name_ar: 'القاهرة', name_en: 'Cairo', name_fr: 'Le Caire' },
      { code: 'GIZ', name_ar: 'الجيزة', name_en: 'Giza', name_fr: 'Gizeh' },
      { code: 'ALX', name_ar: 'الإسكندرية', name_en: 'Alexandria', name_fr: 'Alexandrie' },
      { code: 'SHR', name_ar: 'الشرقية', name_en: 'Sharqia', name_fr: 'Charqiya' },
      { code: 'MNF', name_ar: 'المنوفية', name_en: 'Monufia', name_fr: 'Ménoufia' },
      { code: 'QAL', name_ar: 'القليوبية', name_en: 'Qalyubia', name_fr: 'Qalyubia' },
      { code: 'GHR', name_ar: 'الغربية', name_en: 'Gharbia', name_fr: 'Gharbia' },
      { code: 'BHR', name_ar: 'البحيرة', name_en: 'Beheira', name_fr: 'Beheira' },
      { code: 'KFS', name_ar: 'كفر الشيخ', name_en: 'Kafr El Sheikh', name_fr: 'Kafr el-Cheikh' },
      { code: 'DQH', name_ar: 'الدقهلية', name_en: 'Dakahlia', name_fr: 'Dakahlia' },
      { code: 'DMT', name_ar: 'دمياط', name_en: 'Damietta', name_fr: 'Damiette' },
      { code: 'PTS', name_ar: 'بورسعيد', name_en: 'Port Said', name_fr: 'Port-Saïd' },
      { code: 'ISM', name_ar: 'الإسماعيلية', name_en: 'Ismailia', name_fr: 'Ismaïlia' },
      { code: 'SUZ', name_ar: 'السويس', name_en: 'Suez', name_fr: 'Suez' },
      { code: 'FYM', name_ar: 'الفيوم', name_en: 'Fayoum', name_fr: 'Fayoum' },
      { code: 'BNS', name_ar: 'بني سويف', name_en: 'Beni Suef', name_fr: 'Beni Suef' },
      { code: 'MNA', name_ar: 'المنيا', name_en: 'Minya', name_fr: 'Minya' },
      { code: 'AST', name_ar: 'أسيوط', name_en: 'Asyut', name_fr: 'Assiout' },
      { code: 'SHG', name_ar: 'سوهاج', name_en: 'Sohag', name_fr: 'Sohag' },
      { code: 'QNA', name_ar: 'قنا', name_en: 'Qena', name_fr: 'Qena' },
      { code: 'LXR', name_ar: 'الأقصر', name_en: 'Luxor', name_fr: 'Louxor' },
      { code: 'ASW', name_ar: 'أسوان', name_en: 'Aswan', name_fr: 'Assouan' }
    ],
    SA: [
      { code: 'RYD', name_ar: 'الرياض', name_en: 'Riyadh', name_fr: 'Riyad' },
      { code: 'MKK', name_ar: 'مكة المكرمة', name_en: 'Makkah', name_fr: 'La Mecque' },
      { code: 'MDN', name_ar: 'المدينة المنورة', name_en: 'Madinah', name_fr: 'Médine' },
      { code: 'EAS', name_ar: 'الشرقية', name_en: 'Eastern Province', name_fr: 'Province orientale' },
      { code: 'ASR', name_ar: 'عسير', name_en: 'Asir', name_fr: 'Assir' },
      { code: 'TAB', name_ar: 'تبوك', name_en: 'Tabuk', name_fr: 'Tabouk' },
      { code: 'HAL', name_ar: 'حائل', name_en: 'Hail', name_fr: 'Haïtl' },
      { code: 'JZN', name_ar: 'جازان', name_en: 'Jazan', name_fr: 'Jizan' },
      { code: 'NJR', name_ar: 'نجران', name_en: 'Najran', name_fr: 'Najran' },
      { code: 'BAH', name_ar: 'الباحة', name_en: 'Al Bahah', name_fr: 'Al Bahah' },
      { code: 'QSM', name_ar: 'القصيم', name_en: 'Al Qassim', name_fr: 'Al Qassim' }
    ],
    AE: [
      { code: 'AUH', name_ar: 'أبو ظبي', name_en: 'Abu Dhabi', name_fr: 'Abou Dabi' },
      { code: 'DXB', name_ar: 'دبي', name_en: 'Dubai', name_fr: 'Dubaï' },
      { code: 'SHJ', name_ar: 'الشارقة', name_en: 'Sharjah', name_fr: 'Charjah' },
      { code: 'AJM', name_ar: 'عجمان', name_en: 'Ajman', name_fr: 'Ajman' },
      { code: 'UAQ', name_ar: 'أم القيوين', name_en: 'Umm Al Quwain', name_fr: 'Oumm al Qaïwaïn' },
      { code: 'RAK', name_ar: 'رأس الخيمة', name_en: 'Ras Al Khaimah', name_fr: 'Ras el Khaïmah' },
      { code: 'FUJ', name_ar: 'الفجيرة', name_en: 'Fujairah', name_fr: 'Foujairah' }
    ]
  },
  educationLevels: [
    { code: 'middle', name_ar: 'إعدادي', name_en: 'Middle School', name_fr: 'Collège', min_age: 12, max_age: 15 },
    { code: 'high', name_ar: 'ثانوي', name_en: 'High School', name_fr: 'Lycée', min_age: 15, max_age: 18 },
    { code: 'university', name_ar: 'جامعي', name_en: 'University', name_fr: 'Université', min_age: 18, max_age: 25 },
    { code: 'graduate', name_ar: 'خريج', name_en: 'Graduate', name_fr: 'Diplômé', min_age: 22, max_age: 65 }
  ],
  educationGrades: {
    middle: [
      { code: '7', name_ar: 'الصف الأول الإعدادي', name_en: '7th Grade', name_fr: '5ème' },
      { code: '8', name_ar: 'الصف الثاني الإعدادي', name_en: '8th Grade', name_fr: '4ème' },
      { code: '9', name_ar: 'الصف الثالث الإعدادي', name_en: '9th Grade', name_fr: '3ème' }
    ],
    high: [
      { code: '10', name_ar: 'الصف الأول الثانوي', name_en: '10th Grade', name_fr: 'Seconde' },
      { code: '11', name_ar: 'الصف الثاني الثانوي', name_en: '11th Grade', name_fr: 'Première' },
      { code: '12', name_ar: 'الصف الثالث الثانوي', name_en: '12th Grade', name_fr: 'Terminale' }
    ],
    university: [
      { code: '1', name_ar: 'السنة الأولى', name_en: '1st Year', name_fr: '1ère année' },
      { code: '2', name_ar: 'السنة الثانية', name_en: '2nd Year', name_fr: '2ème année' },
      { code: '3', name_ar: 'السنة الثالثة', name_en: '3rd Year', name_fr: '3ème année' },  
      { code: '4', name_ar: 'السنة الرابعة', name_en: '4th Year', name_fr: '4ème année' },
      { code: '5', name_ar: 'السنة الخامسة', name_en: '5th Year', name_fr: '5ème année' },
      { code: '6', name_ar: 'السنة السادسة', name_en: '6th Year', name_fr: '6ème année' }
    ],
    graduate: [
      { code: 'recent', name_ar: 'خريج حديث (0-2 سنة)', name_en: 'Recent Graduate (0-2 years)', name_fr: 'Diplômé récent (0-2 ans)' },
      { code: 'experienced', name_ar: 'خريج ذو خبرة (2+ سنوات)', name_en: 'Experienced Graduate (2+ years)', name_fr: 'Diplômé expérimenté (2+ ans)' }
    ]
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // countries, governorates, education_levels, education_grades
    const countryCode = searchParams.get('country') || searchParams.get('parent'); // Support both parameter names
    const educationLevel = searchParams.get('level');

    let data = {};

    switch (type) {
      case 'countries':
        // Try to get from database first, fallback to hardcoded
        try {
          const { data: dbCountries, error } = await supabase
            .from('countries')
            .select('*')
            .order('name_ar');

          if (error) {
            console.log('Using fallback countries data:', error.message);
            data.countries = REFERENCE_DATA.countries;
          } else {
            data.countries = dbCountries;
          }
        } catch (err) {
          data.countries = REFERENCE_DATA.countries;
        }
        break;

      case 'governorates':
        if (!countryCode) {
          return NextResponse.json(
            { error: 'Country code required for governorates' },
            { status: 400 }
          );
        }

        try {
          const { data: dbGovernorates, error } = await supabase
            .from('governorates')
            .select('*')
            .eq('country_code', countryCode)
            .order('name_ar');

          if (error) {
            console.log('Using fallback governorates data:', error.message);
            data.governorates = REFERENCE_DATA.governorates[countryCode] || [];
          } else {
            data.governorates = dbGovernorates;
          }
        } catch (err) {
          data.governorates = REFERENCE_DATA.governorates[countryCode] || [];
        }
        break;

      case 'education_levels':
        try {
          const { data: dbLevels, error } = await supabase
            .from('education_levels')
            .select('*')
            .order('sort_order');

          if (error) {
            console.log('Using fallback education levels data:', error.message);
            data.education_levels = REFERENCE_DATA.educationLevels;
          } else {
            data.education_levels = dbLevels;
          }
        } catch (err) {
          data.education_levels = REFERENCE_DATA.educationLevels;
        }
        break;

      case 'education_grades':
        if (!educationLevel) {
          return NextResponse.json(
            { error: 'Education level required for grades' },
            { status: 400 }
          );
        }

        try {
          const { data: dbGrades, error } = await supabase
            .from('education_grades')
            .select('*')
            .eq('education_level_code', educationLevel)
            .order('sort_order');

          if (error) {
            console.log('Using fallback education grades data:', error.message);
            data.education_grades = REFERENCE_DATA.educationGrades[educationLevel] || [];
          } else {
            data.education_grades = dbGrades;
          }
        } catch (err) {
          data.education_grades = REFERENCE_DATA.educationGrades[educationLevel] || [];
        }
        break;

      case 'all':
        // Return all reference data
        try {
          // Try to get countries from database
          const { data: dbCountries } = await supabase
            .from('countries')
            .select('*')
            .order('name_ar');

          const { data: dbLevels } = await supabase
            .from('education_levels')
            .select('*')
            .order('sort_order');

          data = {
            countries: dbCountries || REFERENCE_DATA.countries,
            education_levels: dbLevels || REFERENCE_DATA.educationLevels,
            // Include hardcoded governorates and grades for now
            governorates: REFERENCE_DATA.governorates,
            education_grades: REFERENCE_DATA.educationGrades
          };
        } catch (err) {
          data = REFERENCE_DATA;
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: countries, governorates, education_levels, education_grades, or all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Reference data error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}