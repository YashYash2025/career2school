const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://imobhmzywvzbvyqpzcau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb2JobXp5d3Z6YnZ5cXB6Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDkzNTEsImV4cCI6MjA3MjQyNTM1MX0.FpUXi86I-o38ecc0S1eJ6E2o1TRgYP-yNmOHqyYO3Pg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingTables() {
    console.log('🔍 Checking existing database tables...');
    
    // Check user_profiles table structure
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ user_profiles:', error.message);
        } else {
            console.log('✅ user_profiles table exists');
            if (data.length > 0) {
                console.log('📊 Current columns:', Object.keys(data[0]));
            } else {
                console.log('📊 Table is empty but accessible');
            }
        }
    } catch (err) {
        console.error('❌ user_profiles error:', err.message);
    }
    
    // Check assessment_results table
    try {
        const { data, error } = await supabase
            .from('assessment_results')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ assessment_results:', error.message);
        } else {
            console.log('✅ assessment_results table exists with', data.length, 'sample records');
        }
    } catch (err) {
        console.error('❌ assessment_results error:', err.message);
    }
    
    // Check questions table
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ questions:', error.message);
        } else {
            console.log('✅ questions table exists with', data.length, 'sample records');
        }
    } catch (err) {
        console.error('❌ questions error:', err.message);
    }
    
    // Try to check if we can create a simple test table
    console.log('\n🧪 Testing table creation capabilities...');
    
    // The anon key likely doesn't have CREATE permissions
    // We need to work with existing tables or use SQL editor in Supabase dashboard
    
    console.log('\n📝 Next steps:');
    console.log('1. The new tables (countries, governorates, education_levels, education_grades) need to be created via Supabase SQL Editor');
    console.log('2. The user_profiles table needs new columns added');
    console.log('3. After table creation, we can insert the seed data');
}

checkExistingTables();