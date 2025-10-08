/**
 * Database Integration for RIASEC International Algorithm
 * 
 * This module handles:
 * 1. Fetching questions from database for all versions (30, 60, 180)
 * 2. Saving assessment results with enhanced scoring
 * 3. Integration with existing database schema
 * 4. Multi-language support
 */

import { createClient } from '@supabase/supabase-js';
import RIASECInternational from '../algorithms/RIASECInternational.js';
import RIASECSchool2Career from '../algorithms/RIASECSchool2Career.js';

// Database connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

class RIASECDatabaseIntegration {
  constructor() {
    this.algorithm = new RIASECInternational();
    this.school2careerAlgorithm = new RIASECSchool2Career();
  }

  /**
   * Fetch RIASEC questions from database based on version with stratified sampling
   * @param {string} version - '30', '60', '180'
   * @param {string} language - 'ar', 'en', 'fr'
   * @param {boolean} useStratifiedSampling - Whether to use balanced sampling across RIASEC types
   * @returns {Promise<Array>} Questions array
   */
  async fetchQuestions(version = '180', language = 'ar', useStratifiedSampling = true) {
    try {
      // Extract target count from version parameter
      let targetCount = 180; // default
      if (version === '30' || version.includes('30')) targetCount = 30;
      else if (version === '60' || version.includes('60')) targetCount = 60;
      else if (version === '180' || version.includes('180')) targetCount = 180;
      
      console.log(`🎯 Target question count: ${targetCount}`);
      
      // Handle new school/college versions (60 questions each)
      if (version === 'school' || version === 'college') {
        const toolCode = version === 'school' ? 'RIASEC_60_SCHOOL' : 'RIASEC_60_COLLEGE';
        console.log(`🎓 Fetching ${version} questions - Tool: ${toolCode}`);
        
        // Get tool from database
        const { data: tool, error: toolError } = await supabase
          .from('assessment_tools')
          .select('id, code')
          .eq('code', toolCode)
          .single();

        if (toolError) {
          throw new Error(`${toolCode} tool not found in database: ${toolError.message}`);
        }

        console.log(`✅ Found tool: ${tool.code} (ID: ${tool.id})`);

        // Fetch all questions for this tool
        const { data: allQuestions, error: questionsError } = await supabase
          .from('assessment_questions')
          .select('*')
          .eq('tool_id', tool.id)
          .order('order_index');

        if (questionsError) {
          throw new Error(`Failed to fetch questions: ${questionsError.message}`);
        }

        if (!allQuestions || allQuestions.length === 0) {
          throw new Error(`No questions found for ${toolCode}`);
        }

        console.log(`📋 Found ${allQuestions.length} questions for ${version}`);

        // Format questions for the frontend
        return allQuestions.map((q, index) => ({
          id: q.id,
          order: q.order_index || index + 1,
          text: q[`question_${language}`] || q.question_ar,
          originalText: q[`question_${language}`] || q.question_ar,
          type: q.dimension,
          weight: q.weight || 1.0,
          isReverse: q.is_reverse_scored || false
        }));
      }
      
      // Handle School2Career versions - Use stratified sampling for the enhanced versions
      if (version === 'school2career' || version.startsWith('school2career-')) {
        let targetQuestions = 120; // Default School2Career
        
        // Determine target count for specific versions
        if (version === 'school2career-30') targetQuestions = 30;
        else if (version === 'school2career-60') targetQuestions = 60;
        else if (version === 'school2career-120') targetQuestions = 120;
        
        console.log(`🚀 Fetching School2Career questions (${version}) - Target: ${targetQuestions} questions`);
        const toolCode = 'RIASEC_SCHOOL2CAREER';
        
        // Get School2Career tool from database
        const { data: tool, error: toolError } = await supabase
          .from('assessment_tools')
          .select('id, code')
          .eq('code', toolCode)
          .single();

        if (toolError) {
          throw new Error(`School2Career tool not found in database: ${toolError.message}`);
        }

        console.log(`✅ Found School2Career tool: ${tool.code} (ID: ${tool.id})`);

        // Fetch all School2Career questions
        const { data: allQuestions, error: questionsError } = await supabase
          .from('assessment_questions')
          .select('*')
          .eq('tool_id', tool.id)
          .order('order_index');

        if (questionsError) {
          throw new Error(`Failed to fetch School2Career questions: ${questionsError.message}`);
        }

        if (!allQuestions || allQuestions.length === 0) {
          throw new Error(`No questions found for School2Career tool. Please run the SQL scripts to insert questions.`);
        }

        console.log(`📋 Found ${allQuestions.length} School2Career questions`);

        // Use stratified sampling if we need fewer questions than available
        let finalQuestions = allQuestions;
        if (targetQuestions < allQuestions.length && useStratifiedSampling) {
          console.log(`🎲 Applying stratified sampling for ${version} (${targetQuestions} questions)`);
          finalQuestions = this.stratifiedSample(allQuestions, targetQuestions);
          console.log(`✅ Selected ${finalQuestions.length} questions with balanced distribution`);
        } else if (targetQuestions < allQuestions.length) {
          // Simple random sampling if stratified is disabled
          finalQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, targetQuestions);
        }

        // Format questions for the frontend - use original text from database
        return finalQuestions.map((q, index) => ({
          id: q.id,
          order: q.order_index || index + 1,
          text: q[`question_${language}`] || q.question_ar, // استخدم النص الأصلي من قاعدة البيانات
          originalText: q[`question_${language}`] || q.question_ar,
          type: q.dimension,
          weight: q.weight || 1.0,
          isReverse: q.is_reverse_scored || false
        }));
      }
      
      // Map version to exact tool code
      const toolCodeMap = {
        '30': 'RIASEC_30',
        '60': 'RIASEC_60', 
        '180': 'RIASEC_180',
        'school2career': 'RIASEC_SCHOOL2CAREER'
      };
      const toolCode = toolCodeMap[targetCount.toString()] || toolCodeMap[version] || toolCodeMap['school2career'];
      
      console.log(`🔍 Looking for tool code: ${toolCode}`);
      
      // Get RIASEC tool from database (version-specific)
      const { data: tool, error: toolError } = await supabase
        .from('assessment_tools')
        .select('id, code')
        .eq('code', toolCode)
        .single();

      if (toolError) {
        throw new Error(`RIASEC tool not found in database: ${toolError.message}`);
      }

      console.log(`✅ Found tool: ${tool.code} (ID: ${tool.id})`);

      // Fetch all RIASEC questions for this specific tool
      const { data: questions, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('tool_id', tool.id)
        .order('order_index');

      if (questionsError) {
        throw new Error(`Failed to fetch questions: ${questionsError.message}`);
      }

      if (!questions || questions.length === 0) {
        throw new Error(`No questions found for ${toolCode} tool`);
      }

      console.log(`📋 Found ${questions.length} questions for ${toolCode}`);

      // Apply stratified sampling for balanced RIASEC distribution
      let finalQuestions = questions;
      
      if (useStratifiedSampling && targetCount < questions.length) {
        console.log(`🎲 Applying stratified sampling for balanced RIASEC distribution`);
        finalQuestions = this.stratifiedSample(questions, targetCount);
        console.log(`✅ Selected ${finalQuestions.length} questions with balanced distribution`);
      }

      // Format questions for the frontend - use original text from database
      return finalQuestions.map((q, index) => ({
        id: q.id,
        order: q.order_index || index + 1,
        text: q[`question_${language}`] || q.question_ar, // استخدم النص الأصلي من قاعدة البيانات
        originalText: q[`question_${language}`] || q.question_ar, // النص الأصلي
        type: q.dimension,
        weight: q.weight || 1.0,
        isReverse: q.is_reverse_scored || false
      }));

    } catch (error) {
      console.error('Error fetching RIASEC questions:', error);
      throw error;
    }
  }

  /**
   * Calculate results using appropriate algorithm
   * @param {Object} responses - User responses
   * @param {string} toolCode - Tool identifier
   * @returns {Object} Algorithm results
   */
  async calculateResults(responses, toolCode) {
    try {
      console.log('🧮 riasecIntegration: بداية calculateResults');
      console.log('📈 عدد الاستجابات:', Object.keys(responses).length, 'إجابات');
      console.log('🏷️ رمز الأداة:', toolCode);
      console.log('📦 عينة من الاستجابات:', Object.keys(responses).slice(0, 5).map(key => `${key}: ${responses[key]}`));
      
      if (toolCode === 'RIASEC_SCHOOL2CAREER') {
        console.log('🚀 استخدام خوارزمية School2Career المحسّنة');
        // Use enhanced School2Career algorithm
        const results = this.school2careerAlgorithm.calculateEnhancedResults(responses, {
          tool_code: toolCode,
          calculation_method: 'school2career_enhanced'
        });
        console.log('✅ نتائج School2Career تم حسابها:', results);
        return results;
      } else {
        console.log('🌍 استخدام الخوارزمية الدولية القياسية');
        // Use standard international algorithm
        const version = this.getVersionFromCode(toolCode);
        console.log('📊 نسخة التقييم:', version);
        
        console.log('🚀 استدعاء algorithm.adaptToVersion...');
        const results = this.algorithm.adaptToVersion(responses, version);
        console.log('✅ نتائج الخوارزمية القياسية تم حسابها:', results);
        return results;
      }
    } catch (error) {
      console.error('❌ خطأ في حساب النتائج:', error);
      console.error('❌ تفاصيل الخطأ:', error.stack);
      throw error;
    }
  }

  /**
   * Save assessment session and results
   * @param {Object} params
   * @param {string} params.userId - User ID
   * @param {string} params.toolCode - 'RIASEC_30', 'RIASEC_60', 'RIASEC_180'
   * @param {Object} params.responses - User responses object
   * @param {Object} params.options - Algorithm options (country, lambda, etc.)
   * @returns {Promise<Object>} Saved results
   */
  async saveAssessmentResults({ userId, toolCode, responses, options = {} }) {
    try {
      // Get tool information
      const { data: tool, error: toolError } = await supabase
        .from('assessment_tools')
        .select('id, code, name_ar, name_en, name_fr')
        .eq('code', toolCode)
        .single();

      if (toolError) {
        throw new Error(`Tool not found: ${toolCode}`);
      }

      // Calculate results using the new algorithm
      const algorithmResults = this.algorithm.adaptToVersion(responses, this.getVersionFromCode(toolCode));

      // Prepare result data for database
      const resultData = {
        user_id: userId,
        tool_id: tool.id,
        responses: responses,
        raw_scores: algorithmResults.raw_scores,
        calculated_scores: {
          holland_code: algorithmResults.holland_code,
          ranking: algorithmResults.ranking,
          indices: algorithmResults.indices,
          triad_details: algorithmResults.triad_details
        },
        algorithm_version: 'international_v2',
        algorithm_params: {
          ...algorithmResults.params,
          norms_used: algorithmResults.norms_used
        },
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Save to assessment_results table
      const { data: savedResult, error: saveError } = await supabase
        .from('assessment_results')
        .insert(resultData)
        .select()
        .single();

      if (saveError) {
        throw new Error(`Failed to save results: ${saveError.message}`);
      }

      // Update user profile statistics
      await this.updateUserStats(userId, algorithmResults);

      return {
        id: savedResult.id,
        results: algorithmResults,
        saved_at: savedResult.created_at
      };

    } catch (error) {
      console.error('Error saving assessment results:', error);
      throw error;
    }
  }

  /**
   * Retrieve user's assessment history
   * @param {string} userId - User ID
   * @param {string} toolCode - Optional tool filter
   * @returns {Promise<Array>} Assessment history
   */
  async getUserAssessmentHistory(userId, toolCode = null) {
    try {
      let query = supabase
        .from('assessment_results')
        .select(`
          id,
          created_at,
          completed_at,
          calculated_scores,
          algorithm_version,
          assessment_tools (
            code,
            name_ar,
            name_en,
            name_fr
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (toolCode) {
        // Filter by specific tool
        const { data: tool } = await supabase
          .from('assessment_tools')
          .select('id')
          .eq('code', toolCode)
          .single();
        
        if (tool) {
          query = query.eq('tool_id', tool.id);
        }
      }

      const { data: history, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch history: ${error.message}`);
      }

      return history.map(result => ({
        id: result.id,
        date: result.completed_at || result.created_at,
        tool: result.assessment_tools,
        holland_code: result.calculated_scores?.holland_code,
        primary_type: result.calculated_scores?.ranking?.[0],
        algorithm_version: result.algorithm_version
      }));

    } catch (error) {
      console.error('Error fetching assessment history:', error);
      throw error;
    }
  }

  /**
   * Get detailed results for a specific assessment
   * @param {string} resultId - Assessment result ID
   * @param {string} userId - User ID (for security)
   * @returns {Promise<Object>} Detailed results
   */
  async getDetailedResults(resultId, userId) {
    try {
      const { data: result, error } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessment_tools (*)
        `)
        .eq('id', resultId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch results: ${error.message}`);
      }

      return {
        id: result.id,
        tool: result.assessment_tools,
        responses: result.responses,
        raw_scores: result.raw_scores,
        calculated_scores: result.calculated_scores,
        algorithm_params: result.algorithm_params,
        completed_at: result.completed_at,
        // Add career recommendations based on Holland code
        career_recommendations: await this.getCareerRecommendations(
          result.calculated_scores.holland_code
        )
      };

    } catch (error) {
      console.error('Error fetching detailed results:', error);
      throw error;
    }
  }

  /**
   * Get career recommendations based on Holland code
   * @param {string} hollandCode - 3-letter Holland code (e.g., "RIA")
   * @returns {Promise<Array>} Career recommendations
   */
  async getCareerRecommendations(hollandCode) {
    try {
      // This would integrate with your career database
      // For now, return a basic structure
      const { data: careers, error } = await supabase
        .from('career_paths')
        .select('*')
        .or(`code.eq.${hollandCode},code.like.${hollandCode[0]}%`);

      if (error) {
        console.warn('No career recommendations found:', error);
        return [];
      }

      return careers.map(career => ({
        id: career.id,
        name: career.name_ar,
        name_en: career.name_en,
        description: career.description_ar,
        match_level: career.code === hollandCode ? 'perfect' : 'good',
        required_education: career.education_level,
        salary_range: career.salary_range
      }));

    } catch (error) {
      console.warn('Error fetching career recommendations:', error);
      return [];
    }
  }

  /**
   * Update user statistics after assessment completion
   * @param {string} userId - User ID
   * @param {Object} results - Algorithm results
   */
  async updateUserStats(userId, results) {
    try {
      // Update user_profiles with latest RIASEC results
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          riasec_code: results.holland_code,
          primary_interest: results.ranking[0].type,
          last_assessment_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.warn('Failed to update user stats:', error);
      }

    } catch (error) {
      console.warn('Error updating user stats:', error);
    }
  }

  /**
   * Batch process multiple assessments (for analytics)
   * @param {Array} assessmentIds - Array of assessment result IDs
   * @returns {Promise<Object>} Aggregated statistics
   */
  async batchAnalyzeResults(assessmentIds) {
    try {
      const { data: results, error } = await supabase
        .from('assessment_results')
        .select('calculated_scores, algorithm_params')
        .in('id', assessmentIds);

      if (error) {
        throw new Error(`Failed to fetch batch results: ${error.message}`);
      }

      // Aggregate statistics
      const stats = {
        total_assessments: results.length,
        holland_code_distribution: {},
        average_indices: {
          differentiation: 0,
          consistency: 0,
          congruence: 0,
          profile_elevation: 0
        },
        country_distribution: {}
      };

      results.forEach(result => {
        const { holland_code } = result.calculated_scores;
        const { indices } = result.calculated_scores;
        const { country } = result.algorithm_params;

        // Count Holland codes
        stats.holland_code_distribution[holland_code] = 
          (stats.holland_code_distribution[holland_code] || 0) + 1;

        // Sum indices for averaging
        if (indices) {
          stats.average_indices.differentiation += indices.differentiation.score || 0;
          stats.average_indices.consistency += indices.consistency.score || 0;
          stats.average_indices.congruence += indices.congruence.score || 0;
          stats.average_indices.profile_elevation += indices.profile_elevation.score || 0;
        }

        // Count countries
        stats.country_distribution[country] = 
          (stats.country_distribution[country] || 0) + 1;
      });

      // Calculate averages
      const count = results.length;
      if (count > 0) {
        stats.average_indices.differentiation /= count;
        stats.average_indices.consistency /= count;
        stats.average_indices.congruence /= count;
        stats.average_indices.profile_elevation /= count;
      }

      return stats;

    } catch (error) {
      console.error('Error in batch analysis:', error);
      throw error;
    }
  }

  /**
   * Stratified sampling to ensure balanced question distribution across RIASEC types
   * @param {Array} questions - All available questions
   * @param {number} targetCount - Target number of questions
   * @returns {Array} Balanced selection of questions
   */
  stratifiedSample(questions, targetCount) {
    try {
      // Group questions by RIASEC type
      const questionsByType = {
        'R': [],
        'I': [],
        'A': [],
        'S': [],
        'E': [],
        'C': []
      };

      questions.forEach(q => {
        if (q.dimension && questionsByType[q.dimension]) {
          questionsByType[q.dimension].push(q);
        }
      });

      console.log('📊 Questions per type:', Object.keys(questionsByType).map(type => 
        `${type}: ${questionsByType[type].length}`
      ).join(', '));

      // Calculate questions per type (equal distribution)
      const questionsPerType = Math.floor(targetCount / 6);
      const remainder = targetCount % 6;
      
      console.log(`🎯 Target: ${questionsPerType} questions per type, ${remainder} extra questions`);

      let selectedQuestions = [];
      const types = ['R', 'I', 'A', 'S', 'E', 'C'];

      // Select equal number from each type
      types.forEach((type, index) => {
        const typeQuestions = questionsByType[type];
        let typeTarget = questionsPerType;
        
        // Distribute remainder to first few types
        if (index < remainder) {
          typeTarget++;
        }

        if (typeQuestions.length >= typeTarget) {
          // Randomly select from available questions of this type
          const shuffled = [...typeQuestions].sort(() => Math.random() - 0.5);
          selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, typeTarget)];
          console.log(`✅ Selected ${typeTarget} questions for type ${type}`);
        } else {
          // Use all available questions if less than target
          selectedQuestions = [...selectedQuestions, ...typeQuestions];
          console.log(`⚠️ Only ${typeQuestions.length} questions available for type ${type} (needed ${typeTarget})`);
        }
      });

      // Shuffle final selection to avoid predictable order
      const shuffledSelection = selectedQuestions.sort(() => Math.random() - 0.5);
      
      console.log(`🎲 Final stratified selection: ${shuffledSelection.length} questions`);
      
      // Verify distribution
      const distribution = {};
      shuffledSelection.forEach(q => {
        distribution[q.dimension] = (distribution[q.dimension] || 0) + 1;
      });
      console.log('📈 Final distribution:', distribution);

      return shuffledSelection;

    } catch (error) {
      console.error('❌ Error in stratified sampling:', error);
      // Fallback to simple random sampling
      return questions.sort(() => Math.random() - 0.5).slice(0, targetCount);
    }
  }

  /**
   * Helper function to determine version from tool code
   * @param {string} toolCode - Tool code like 'RIASEC_180'
   * @returns {string} Version string for algorithm
   */
  getVersionFromCode(toolCode) {
    if (toolCode.includes('30')) return 'short';
    if (toolCode.includes('60')) return 'medium';
    return 'full';
  }

  /**
   * Test the algorithm with sample data
   * @param {string} version - Version to test
   * @returns {Promise<Object>} Test results
   */
  async testAlgorithm(version = 'RIASEC_180') {
    try {
      // Create sample responses
      const sampleResponses = this.generateSampleResponses(version);
      
      // Test calculation
      const results = this.algorithm.adaptToVersion(
        sampleResponses, 
        this.getVersionFromCode(version)
      );

      return {
        version,
        sample_responses: sampleResponses,
        results,
        test_passed: results.holland_code && results.holland_code.length === 3
      };

    } catch (error) {
      console.error('Algorithm test failed:', error);
      throw error;
    }
  }

  /**
   * Generate sample responses for testing
   * @param {string} version - Version code
   * @returns {Object} Sample responses
   */
  generateSampleResponses(version) {
    const responses = {};
    const questionCount = version.includes('30') ? 30 : 
                         version.includes('60') ? 60 : 180;
    
    // Generate realistic sample data
    const types = ['R', 'I', 'A', 'S', 'E', 'C'];
    let questionIndex = 1;

    for (let i = 0; i < questionCount; i++) {
      const type = types[i % 6];
      const response = Math.floor(Math.random() * 3); // 0, 1, or 2
      responses[`${type}${Math.ceil(questionIndex / 6)}`] = response;
      questionIndex++;
    }

    return responses;
  }
}

export default RIASECDatabaseIntegration;