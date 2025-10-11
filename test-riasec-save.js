// Test script for RIASEC save functionality
// Run in browser console after completing RIASEC assessment

async function testRIASECSave() {
  console.log('🧪 Testing RIASEC Save...');
  
  // 1. Check user authentication
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log('👤 User Data:', userData);
  
  if (!userData || !userData.id) {
    console.error('❌ No user data found!');
    return;
  }
  
  // 2. Create mock RIASEC results
  const mockResults = {
    holland_code: 'RIA',
    raw_scores: {
      R: { raw: 8, percentage: 80, z: 1.5, percentile: 93 },
      I: { raw: 7, percentage: 70, z: 1.2, percentile: 88 },
      A: { raw: 6, percentage: 60, z: 0.9, percentile: 82 },
      S: { raw: 4, percentage: 40, z: 0.2, percentile: 58 },
      E: { raw: 3, percentage: 30, z: -0.1, percentile: 46 },
      C: { raw: 2, percentage: 20, z: -0.5, percentile: 31 }
    },
    ranking: [
      { type: 'R', raw: 8, percentage: 80, z: 1.5, pct: 93 },
      { type: 'I', raw: 7, percentage: 70, z: 1.2, pct: 88 },
      { type: 'A', raw: 6, percentage: 60, z: 0.9, pct: 82 }
    ],
    indices: {
      consistency: { score: 85 }
    }
  };
  
  console.log('📊 Mock Results:', mockResults);
  
  // 3. Test save API
  try {
    const response = await fetch('/api/assessments/riasec/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        holland_code: mockResults.holland_code,
        raw_scores: mockResults.raw_scores,
        ranking: mockResults.ranking,
        confidence_score: mockResults.indices.consistency.score,
        user_id: userData.id
      })
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (data.success) {
      console.log('✅ TEST PASSED! Assessment saved with ID:', data.assessment_id);
      
      // 4. Verify in database
      console.log('🔍 Verifying in database...');
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY'
      );
      
      const { data: results, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });
      
      console.log('📊 All assessments:', results);
      console.log('📊 Total count:', results?.length);
      
      if (error) {
        console.error('❌ Database query error:', error);
      }
      
    } else {
      console.error('❌ TEST FAILED!');
      console.error('Error:', data.error);
      console.error('Details:', data.details);
    }
    
  } catch (error) {
    console.error('❌ TEST ERROR:', error);
  }
}

// Run the test
testRIASECSave();
