const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually since we're not using dotenv package
const supabaseUrl = 'https://imobhmzywvzbvyqpzcau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb2JobXp5d3Z6YnZ5cXB6Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDkzNTEsImV4cCI6MjA3MjQyNTM1MX0.FpUXi86I-o38ecc0S1eJ6E2o1TRgYP-yNmOHqyYO3Pg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
    console.log('🚀 Creating database tables...');
    
    // Create countries table
    try {
        console.log('📝 Creating countries table...');
        const { data, error } = await supabase
            .from('countries')
            .insert([
                { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' },
                { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', name_fr: 'Arabie Saoudite' },
                { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', name_fr: 'Émirats Arabes Unis' }
            ])
            .select();
            
        if (error && !error.message.includes('duplicate key')) {
            console.error('Countries insert error:', error);
        } else {
            console.log('✅ Countries data ready');
        }
    } catch (err) {
        console.log('ℹ️ Countries table might already exist or need to be created via SQL');
    }
}

async function insertSeedData() {
    console.log('🌱 Inserting seed data...');
    
    // Insert countries
    const countries = [
        { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', name_fr: 'Égypte' },
        { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', name_fr: 'Arabie Saoudite' },
        { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', name_fr: 'Émirats Arabes Unis' }
    ];
    
    try {
        const { error: countriesError } = await supabase
            .from('countries')
            .upsert(countries, { onConflict: 'code' });
            
        if (countriesError) {
            console.log('Countries might need manual creation:', countriesError.message);
        } else {
            console.log('✅ Countries inserted');
        }
    } catch (err) {
        console.log('ℹ️ Countries table needs to be created first');
    }
    
    // Insert some governorates for Egypt
    const governorates = [
        { code: 'CAI', country_code: 'EG', name_ar: 'القاهرة', name_en: 'Cairo', name_fr: 'Le Caire' },
        { code: 'GIZ', country_code: 'EG', name_ar: 'الجيزة', name_en: 'Giza', name_fr: 'Gizeh' },
        { code: 'ALX', country_code: 'EG', name_ar: 'الإسكندرية', name_en: 'Alexandria', name_fr: 'Alexandrie' }
    ];
    
    try {
        const { error: govError } = await supabase
            .from('governorates')
            .upsert(governorates, { onConflict: 'code' });
            
        if (govError) {
            console.log('Governorates might need manual creation:', govError.message);
        } else {
            console.log('✅ Governorates inserted');
        }
    } catch (err) {
        console.log('ℹ️ Governorates table needs to be created first');
    }
}

async function executeMigration() {
    try {
        console.log('🚀 Starting database migration...');
        
        // First try to create tables and insert data
        await createTables();
        await insertSeedData();
        
        // التحقق من إنشاء الجداول
        console.log('🔍 Verifying table creation...');
        
        const tables = ['countries', 'governorates', 'education_levels', 'education_grades'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(5);
                    
                if (error) {
                    console.log(`ℹ️ Table ${table} might not exist yet:`, error.message);
                } else {
                    console.log(`✅ Table ${table}: ${data.length} records found`);
                }
            } catch (err) {
                console.log(`ℹ️ Table ${table} needs to be created via SQL`);
            }
        }
        
        // التحقق من الأعمدة الجديدة في user_profiles
        console.log('🔍 Checking user_profiles table structure...');
        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('user_profiles')
                .select('*')
                .limit(1);
                
            if (profilesError) {
                console.error('❌ Error checking user_profiles:', profilesError);
            } else {
                console.log('✅ user_profiles table accessible');
                if (profiles.length > 0) {
                    console.log('📊 Sample profile columns:', Object.keys(profiles[0]));
                } else {
                    console.log('📊 user_profiles table is empty but accessible');
                }
            }
        } catch (err) {
            console.log('ℹ️ user_profiles table needs to be checked');
        }
        
        console.log('\n📋 Migration Summary:');
        console.log('• Database structure updates: Attempted');
        console.log('• Seed data insertion: Attempted');
        console.log('• Table verification: Completed');
        console.log('\n⚠️ Note: Some operations may require SQL admin access');
        console.log('🎉 Database migration process completed!');
        
    } catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
}

// تنفيذ المهاجرة
executeMigration();