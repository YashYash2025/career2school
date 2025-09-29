-- ==============================================
-- إدخال البيانات الأساسية لقاعدة البيانات
-- البلدان، المحافظات، والمراحل التعليمية
-- ==============================================

DO $$
BEGIN
    -- إدخال البلدان
    INSERT INTO countries (code, name_ar, name_en, name_fr) VALUES
        ('EG', 'مصر', 'Egypt', 'Égypte'),
        ('SA', 'السعودية', 'Saudi Arabia', 'Arabie Saoudite'),
        ('AE', 'الإمارات', 'UAE', 'Émirats Arabes Unis')
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        updated_at = NOW();

    RAISE NOTICE 'تم إدخال بيانات البلدان';

    -- إدخال محافظات مصر
    INSERT INTO governorates (code, country_code, name_ar, name_en, name_fr) VALUES
        ('CAI', 'EG', 'القاهرة', 'Cairo', 'Le Caire'),
        ('GIZ', 'EG', 'الجيزة', 'Giza', 'Gizeh'),
        ('ALX', 'EG', 'الإسكندرية', 'Alexandria', 'Alexandrie'),
        ('SHR', 'EG', 'الشرقية', 'Sharqia', 'Charqiya'),
        ('MNF', 'EG', 'المنوفية', 'Monufia', 'Ménoufia'),
        ('QAL', 'EG', 'القليوبية', 'Qalyubia', 'Qalyubia'),
        ('GHR', 'EG', 'الغربية', 'Gharbia', 'Gharbia'),
        ('BHR', 'EG', 'البحيرة', 'Beheira', 'Beheira'),
        ('KFS', 'EG', 'كفر الشيخ', 'Kafr El Sheikh', 'Kafr el-Cheikh'),
        ('DQH', 'EG', 'الدقهلية', 'Dakahlia', 'Dakahlia'),
        ('DMT', 'EG', 'دمياط', 'Damietta', 'Damiette'),
        ('PTS', 'EG', 'بورسعيد', 'Port Said', 'Port-Saïd'),
        ('ISM', 'EG', 'الإسماعيلية', 'Ismailia', 'Ismaïlia'),
        ('SUZ', 'EG', 'السويس', 'Suez', 'Suez'),
        ('NSR', 'EG', 'شمال سيناء', 'North Sinai', 'Sinaï du Nord'),
        ('SSR', 'EG', 'جنوب سيناء', 'South Sinai', 'Sinaï du Sud'),
        ('FYM', 'EG', 'الفيوم', 'Fayoum', 'Fayoum'),
        ('BNS', 'EG', 'بني سويف', 'Beni Suef', 'Beni Suef'),
        ('MNA', 'EG', 'المنيا', 'Minya', 'Minya'),
        ('AST', 'EG', 'أسيوط', 'Asyut', 'Assiout'),
        ('SHG', 'EG', 'سوهاج', 'Sohag', 'Sohag'),
        ('QNA', 'EG', 'قنا', 'Qena', 'Qena'),
        ('LXR', 'EG', 'الأقصر', 'Luxor', 'Louxor'),
        ('ASW', 'EG', 'أسوان', 'Aswan', 'Assouan'),
        ('BSE', 'EG', 'البحر الأحمر', 'Red Sea', 'Mer Rouge'),
        ('WAD', 'EG', 'الوادي الجديد', 'New Valley', 'Nouvelle Vallée'),
        ('MAT', 'EG', 'مطروح', 'Matrouh', 'Matruh')
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        updated_at = NOW();

    -- إدخال مناطق السعودية
    INSERT INTO governorates (code, country_code, name_ar, name_en, name_fr) VALUES
        ('RYD', 'SA', 'الرياض', 'Riyadh', 'Riyad'),
        ('MKK', 'SA', 'مكة المكرمة', 'Makkah', 'La Mecque'),
        ('MDN', 'SA', 'المدينة المنورة', 'Madinah', 'Médine'),
        ('EAS', 'SA', 'الشرقية', 'Eastern Province', 'Province orientale'),
        ('ASR', 'SA', 'عسير', 'Asir', 'Assir'),
        ('TAB', 'SA', 'تبوك', 'Tabuk', 'Tabouk'),
        ('HAL', 'SA', 'حائل', 'Hail', 'Haïtl'),
        ('NRN', 'SA', 'الحدود الشمالية', 'Northern Borders', 'Frontières du Nord'),
        ('JZN', 'SA', 'جازان', 'Jazan', 'Jizan'),
        ('NJR', 'SA', 'نجران', 'Najran', 'Najran'),
        ('BAH', 'SA', 'الباحة', 'Al Bahah', 'Al Bahah'),
        ('JOF', 'SA', 'الجوف', 'Al Jouf', 'Al Jawf'),
        ('QSM', 'SA', 'القصيم', 'Al Qassim', 'Al Qassim')
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        updated_at = NOW();

    -- إدخال إمارات الإمارات
    INSERT INTO governorates (code, country_code, name_ar, name_en, name_fr) VALUES
        ('AUH', 'AE', 'أبو ظبي', 'Abu Dhabi', 'Abou Dabi'),
        ('DXB', 'AE', 'دبي', 'Dubai', 'Dubaï'),
        ('SHJ', 'AE', 'الشارقة', 'Sharjah', 'Charjah'),
        ('AJM', 'AE', 'عجمان', 'Ajman', 'Ajman'),
        ('UAQ', 'AE', 'أم القيوين', 'Umm Al Quwain', 'Oumm al Qaïwaïn'),
        ('RAK', 'AE', 'رأس الخيمة', 'Ras Al Khaimah', 'Ras el Khaïmah'),
        ('FUJ', 'AE', 'الفجيرة', 'Fujairah', 'Foujairah')
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        updated_at = NOW();

    RAISE NOTICE 'تم إدخال بيانات المحافظات والإمارات';

    -- إدخال المراحل التعليمية
    INSERT INTO education_levels (code, name_ar, name_en, name_fr, min_age, max_age, sort_order) VALUES
        ('middle', 'إعدادي', 'Middle School', 'Collège', 12, 15, 1),
        ('high', 'ثانوي', 'High School', 'Lycée', 15, 18, 2),
        ('university', 'جامعي', 'University', 'Université', 18, 25, 3),
        ('graduate', 'خريج', 'Graduate', 'Diplômé', 22, 65, 4)
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        min_age = EXCLUDED.min_age,
        max_age = EXCLUDED.max_age,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();

    -- إدخال الصفوف الدراسية للإعدادي
    INSERT INTO education_grades (code, education_level_code, name_ar, name_en, name_fr, sort_order) VALUES
        ('7', 'middle', 'الصف الأول الإعدادي', '7th Grade', '5ème', 1),
        ('8', 'middle', 'الصف الثاني الإعدادي', '8th Grade', '4ème', 2),
        ('9', 'middle', 'الصف الثالث الإعدادي', '9th Grade', '3ème', 3)
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();

    -- إدخال الصفوف الدراسية للثانوي
    INSERT INTO education_grades (code, education_level_code, name_ar, name_en, name_fr, sort_order) VALUES
        ('10', 'high', 'الصف الأول الثانوي', '10th Grade', 'Seconde', 1),
        ('11', 'high', 'الصف الثاني الثانوي', '11th Grade', 'Première', 2),
        ('12', 'high', 'الصف الثالث الثانوي', '12th Grade', 'Terminale', 3)
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();

    -- إدخال السنوات الجامعية
    INSERT INTO education_grades (code, education_level_code, name_ar, name_en, name_fr, sort_order) VALUES
        ('1', 'university', 'السنة الأولى', '1st Year', '1ère année', 1),
        ('2', 'university', 'السنة الثانية', '2nd Year', '2ème année', 2),
        ('3', 'university', 'السنة الثالثة', '3rd Year', '3ème année', 3),
        ('4', 'university', 'السنة الرابعة', '4th Year', '4ème année', 4),
        ('5', 'university', 'السنة الخامسة', '5th Year', '5ème année', 5),
        ('6', 'university', 'السنة السادسة', '6th Year', '6ème année', 6)
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();

    -- إدخال مستويات الخريجين
    INSERT INTO education_grades (code, education_level_code, name_ar, name_en, name_fr, sort_order) VALUES
        ('recent', 'graduate', 'خريج حديث (0-2 سنة)', 'Recent Graduate (0-2 years)', 'Diplômé récent (0-2 ans)', 1),
        ('experienced', 'graduate', 'خريج ذو خبرة (2+ سنوات)', 'Experienced Graduate (2+ years)', 'Diplômé expérimenté (2+ ans)', 2)
    ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        name_fr = EXCLUDED.name_fr,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();

    RAISE NOTICE 'تم إدخال بيانات المراحل التعليمية والصفوف';

END $$;