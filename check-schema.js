const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://imobhmzywvzbvyqpzcau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb2JobXp5d3Z6YnZ5cXB6Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDkzNTEsImV4cCI6MjA3MjQyNTM1MX0.FpUXi86I-o38ecc0S1eJ6E2o1TRgYP-yNmOHqyYO3Pg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfilesSchema() {
  console.log('🔍 Checking user_profiles table schema...');
  
  try {
    // Try to insert a minimal test record to see what columns are expected
    const testId = 'test-' + Date.now();
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ id: testId }])
      .select();
    
    if (error) {
      console.log('Insert error (this helps us understand the schema):', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Insert successful, record created:', data);
    }
    
    // Try a simple select to see if we can determine schema
    const { data: existing, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (selectError) {
      console.log('Select error:', selectError.message);
    } else {
      console.log('Existing records count:', existing.length);
      if (existing.length > 0) {
        console.log('Sample record columns:', Object.keys(existing[0]));
        console.log('Sample record data:', existing[0]);
      } else {
        console.log('No existing records found');
      }
    }
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
  }
}

checkUserProfilesSchema();