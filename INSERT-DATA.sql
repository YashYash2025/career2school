-- إدراج البيانات الأساسية
-- نفذ هذا بعد إنشاء الجداول

-- 1. إدراج البلدان
INSERT INTO countries (code, name_ar, name_en, name_fr) VALUES
('EG', 'مصر', 'Egypt', 'Égypte'),
('SA', 'السعودية', 'Saudi Arabia', 'Arabie Saoudite'),
('AE', 'الإمارات العربية المتحدة', 'United Arab Emirates', 'Émirats Arabes Unis')
ON CONFLICT (code) DO NOTHING;

-- 2. إدراج المحافظات
INSERT INTO governorates (code, country_code, name_ar, name_en, name_fr) VALUES
-- مصر
('CAI', 'EG', 'القاهرة', 'Cairo', 'Le Caire'),
('GIZ', 'EG', 'الجيزة', 'Giza', 'Gizeh'),
('ALX', 'EG', 'الإسكندرية', 'Alexandria', 'Alexandrie'),
('SHR', 'EG', 'الشرقية', 'Sharqia', 'Charqiya'),
('MNF', 'EG', 'المنوفية', 'Monufia', 'Ménoufia'),
('QAL', 'EG', 'القليوبية', 'Qalyubia', 'Qalyubia'),
('GHR', 'EG', 'الغربية', 'Gharbia', 'Gharbia'),
('BHR', 'EG', 'البحيرة', 'Beheira', 'Beheira'),
-- السعودية
('RYD', 'SA', 'الرياض', 'Riyadh', 'Riyad'),
('MKK', 'SA', 'مكة المكرمة', 'Makkah', 'La Mecque'),
('MDN', 'SA', 'المدينة المنورة', 'Madinah', 'Médine'),
('EAS', 'SA', 'الشرقية', 'Eastern Province', 'Province orientale'),
('ASR', 'SA', 'عسير', 'Asir', 'Assir'),
('TAB', 'SA', 'تبوك', 'Tabuk', 'Tabouk'),
-- الإمارات
('AUH', 'AE', 'أبو ظبي', 'Abu Dhabi', 'Abou Dabi'),
('DXB', 'AE', 'دبي', 'Dubai', 'Dubaï'),
('SHJ', 'AE', 'الشارقة', 'Sharjah', 'Charjah'),
('AJM', 'AE', 'عجمان', 'Ajman', 'Ajman'),
('RAK', 'AE', 'رأس الخيمة', 'Ras Al Khaimah', 'Ras el Khaïmah'),
('FUJ', 'AE', 'الفجيرة', 'Fujairah', 'Foujairah')
ON CONFLICT (code) DO NOTHING;

-- 3. إدراج المراحل التعليمية
INSERT INTO education_levels (code, name_ar, name_en, name_fr, sort_order) VALUES
('middle', 'إعدادي', 'Middle School', 'Collège', 1),
('high', 'ثانوي', 'High School', 'Lycée', 2),
('university', 'جامعي', 'University', 'Université', 3),
('graduate', 'خريج', 'Graduate', 'Diplômé', 4)
ON CONFLICT (code) DO NOTHING;

-- 4. إدراج الصفوف الدراسية
INSERT INTO education_grades (code, education_level_code, name_ar, name_en, name_fr, sort_order) VALUES
-- إعدادي
('7', 'middle', 'الصف الأول الإعدادي', '7th Grade', '5ème', 1),
('8', 'middle', 'الصف الثاني الإعدادي', '8th Grade', '4ème', 2),
('9', 'middle', 'الصف الثالث الإعدادي', '9th Grade', '3ème', 3),
-- ثانوي
('10', 'high', 'الصف الأول الثانوي', '10th Grade', 'Seconde', 1),
('11', 'high', 'الصف الثاني الثانوي', '11th Grade', 'Première', 2),
('12', 'high', 'الصف الثالث الثانوي', '12th Grade', 'Terminale', 3),
-- جامعي
('1', 'university', 'السنة الأولى', '1st Year', '1ère année', 1),
('2', 'university', 'السنة الثانية', '2nd Year', '2ème année', 2),
('3', 'university', 'السنة الثالثة', '3rd Year', '3ème année', 3),
('4', 'university', 'السنة الرابعة', '4th Year', '4ème année', 4),
-- خريج
('recent', 'graduate', 'خريج حديث (0-2 سنة)', 'Recent Graduate (0-2 years)', 'Diplômé récent', 1),
('exp', 'graduate', 'خريج ذو خبرة (2+ سنوات)', 'Experienced Graduate (2+ years)', 'Diplômé expérimenté', 2)
ON CONFLICT (code) DO NOTHING;