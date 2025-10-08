import { NextResponse } from 'next/server';
import RIASECInternational from '../../../../lib/algorithms/RIASECInternational.js';
import RIASECDatabaseIntegration from '../../../../lib/database/riasecIntegration.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version') || '180'; // 30, 60, or 180
    const language = searchParams.get('language') || 'ar';
    const randomize = searchParams.get('randomize') === 'true';
    const useStratifiedSampling = searchParams.get('stratified') !== 'false'; // Default to true

    // Validate version
    const validVersions = ['30', '60', '180', 'school', 'college', 'school2career', 'school2career-30', 'school2career-60', 'school2career-120'];
    if (!validVersions.includes(version)) {
      return NextResponse.json(
        { error: `Invalid version. Must be one of: ${validVersions.join(', ')}`, code: 'INVALID_VERSION' },
        { status: 400 }
      );
    }

    // Initialize database integration
    const algorithm = new RIASECInternational();
    const dbIntegration = new RIASECDatabaseIntegration();

    // Fetch questions from database with stratified sampling
    let questions;
    try {
      console.log(`🔍 Fetching questions for version: ${version}, stratified: ${useStratifiedSampling}`);
      questions = await dbIntegration.fetchQuestions(version, language, useStratifiedSampling);
      console.log(`✅ Successfully fetched ${questions?.length || 0} questions from database`);
      
      if (!questions || questions.length === 0) {
        console.log('⚠️ No questions found in database, checking what\'s available...');
        throw new Error('No questions found in database');
      }
    } catch (dbError) {
      console.log('❌ Database error:', dbError.message);
      return NextResponse.json(
        { 
          error: 'خطأ في الاتصال بقاعدة البيانات',
          code: 'DATABASE_ERROR',
          details: dbError.message
        },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      console.log('❌ No questions found in database');
      return NextResponse.json(
        { 
          error: 'لا توجد أسئلة متاحة في قاعدة البيانات للنسخة المطلوبة',
          code: 'NO_QUESTIONS_FOUND',
          details: `لم يتم العثور على أسئلة للنسخة ${version}`
        },
        { status: 404 }
      );
    }

    // Additional randomization if requested (after stratified sampling)
    let processedQuestions = questions;
    if (randomize) {
      processedQuestions = [...questions].sort(() => Math.random() - 0.5);
      console.log('🎲 Applied additional randomization to questions order');
    }

    // Determine tool code for metadata
    const toolCodeMap = {
      '30': 'RIASEC_30',
      '60': 'RIASEC_60', 
      '180': 'RIASEC_180',
      'school2career': 'RIASEC_SCHOOL2CAREER',
      'school2career-30': 'RIASEC_SCHOOL2CAREER',
      'school2career-60': 'RIASEC_SCHOOL2CAREER',
      'school2career-120': 'RIASEC_SCHOOL2CAREER'
    };
    const toolCode = toolCodeMap[version] || 'RIASEC_180';

    // Add question metadata
    const questionsWithMetadata = processedQuestions.map((q, index) => ({
      ...q,
      question_number: index + 1,
      total_questions: processedQuestions.length,
      version: version
    }));

    return NextResponse.json({
      success: true,
      data: {
        questions: questionsWithMetadata,
        metadata: {
          version: version,
          language: language,
          total_questions: questionsWithMetadata.length,
          tool_code: toolCode,
          randomized: randomize,
          stratified_sampling: useStratifiedSampling,
          fetched_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('RIASEC questions fetch error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch questions',
        code: 'FETCH_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for creating custom question sets
export async function POST(request) {
  try {
    const body = await request.json();
    const { version, custom_selection, language = 'ar' } = body;

    if (!version || !custom_selection) {
      return NextResponse.json(
        { error: 'Version and custom_selection are required', code: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    const algorithm = new RIASECInternational();
    const dbIntegration = new RIASECDatabaseIntegration();

    // Get all questions first
    const allQuestions = await dbIntegration.fetchQuestions('RIASEC-180', language);
    
    // Filter based on custom selection criteria
    let selectedQuestions = [];
    
    if (custom_selection.type_distribution) {
      // Ensure equal distribution across RIASEC types
      const typesNeeded = ['R', 'I', 'A', 'S', 'E', 'C'];
      const questionsPerType = Math.floor(parseInt(version) / 6);
      
      for (const type of typesNeeded) {
        const typeQuestions = allQuestions.filter(q => q.riasec_type === type);
        const selectedTypeQuestions = typeQuestions.slice(0, questionsPerType);
        selectedQuestions = [...selectedQuestions, ...selectedTypeQuestions];
      }
    } else {
      // Simple random selection
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      selectedQuestions = shuffled.slice(0, parseInt(version));
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: selectedQuestions,
        metadata: {
          custom_version: version,
          selection_criteria: custom_selection,
          language: language,
          total_questions: selectedQuestions.length,
          created_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Custom RIASEC questions creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create custom question set',
        code: 'CUSTOM_SET_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
}