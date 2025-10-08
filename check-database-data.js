const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllTables() {
    console.log('🔍 فحص جميع الجداول...\n');

    const tables = [
        'users',
        'user_profiles',
        'students',
        'counselors',
        'countries',
        'governorates',
        'education_levels',
        'education_grades',
        'assessment_tools',
        'assessment_questions',
        'assessment_packages',
        'assessment_sessions',
        'assessment_progress',
        'assessment_results',
        'user_answers',
        'user_assessments',
        'career_recommendations',
        'career_paths',
        'majors',
        'pricing_packages',
        'payment_transactions',
        'subscriptions',
        'subscription_plans',
        'achievements',
        'user_achievements',
        'student_progress',
        'resources'
    ];

    const tablesWithData = [];
    const emptyTables = [];
    const missingTables = [];

    for (const table of tables) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                if (error.message.includes('does not exist')) {
                    missingTables.push(table);
                    console.log(`❌ ${table}: الجدول غير موجود`);
                } else {
                    console.log(`⚠️  ${table}: خطأ - ${error.message}`);
                }
            } else {
                if (count > 0) {
                    tablesWithData.push({ table, count });
                    console.log(`📊 ${table}: ${count} صف`);
                } else {
                    emptyTables.push(table);
                    console.log(`✅ ${table}: فارغ`);
                }
            }
        } catch (err) {
            console.log(`⚠️  ${table}: خطأ - ${err.message}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📈 ملخص النتائج:\n');

    if (tablesWithData.length > 0) {
        console.log('🔴 جداول تحتوي على بيانات (تحتاج تفريغ):');
        tablesWithData.forEach(({ table, count }) => {
            console.log(`   - ${table}: ${count} صف`);
        });
    }

    if (emptyTables.length > 0) {
        console.log('\n✅ جداول فارغة:');
        emptyTables.forEach(table => console.log(`   - ${table}`));
    }

    if (missingTables.length > 0) {
        console.log('\n❌ جداول غير موجودة:');
        missingTables.forEach(table => console.log(`   - ${table}`));
    }

    console.log('\n' + '='.repeat(60));

    return { tablesWithData, emptyTables, missingTables };
}

checkAllTables()
    .then(() => {
        console.log('\n✅ انتهى الفحص');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ خطأ:', err);
        process.exit(1);
    });
