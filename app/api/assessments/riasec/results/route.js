import { NextResponse } from 'next/server';
import RIASECInternational from '../../../../lib/algorithms/RIASECInternational.js';
import RIASECDatabaseIntegration from '../../../../lib/database/riasecIntegration.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('resultId');
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'detailed'; // detailed, summary, report
    const includeComparison = searchParams.get('includeComparison') === 'true';

    if (!resultId && !userId) {
      return NextResponse.json(
        { error: 'Either resultId or userId is required', code: 'MISSING_IDENTIFIER' },
        { status: 400 }
      );
    }

    const algorithm = new RIASECInternational();
    const dbIntegration = new RIASECDatabaseIntegration();

    let result = null;
    let comparisons = null;

    if (resultId) {
      // Get specific result by ID
      result = await dbIntegration.getAssessmentResult(resultId);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Assessment result not found', code: 'RESULT_NOT_FOUND' },
          { status: 404 }
        );
      }

      // Get comparison data if requested
      if (includeComparison && result.user_id) {
        const history = await dbIntegration.getUserAssessmentHistory(result.user_id, 5);
        comparisons = await dbIntegration.generateComparisonAnalytics(result.user_id, history);
      }
    } else {
      // Get latest result for user
      const history = await dbIntegration.getUserAssessmentHistory(userId, 1);
      if (history.length > 0) {
        result = history[0];
        
        if (includeComparison) {
          const fullHistory = await dbIntegration.getUserAssessmentHistory(userId, 5);
          comparisons = await dbIntegration.generateComparisonAnalytics(userId, fullHistory);
        }
      }
    }

    if (!result) {
      return NextResponse.json(
        { error: 'No assessment results found', code: 'NO_RESULTS' },
        { status: 404 }
      );
    }

    // Format response based on requested format
    let responseData = {};
    
    switch (format) {
      case 'summary':
        responseData = {
          result_id: result.id,
          user_id: result.user_id,
          holland_code: result.calculated_scores?.holland_code,
          top_types: result.calculated_scores?.ranking?.slice(0, 3),
          completion_date: result.created_at,
          tool_version: result.tool_code
        };
        break;
        
      case 'report':
        responseData = {
          ...result,
          detailed_analysis: {
            type_interpretations: {},
            career_recommendations: await generateCareerRecommendations(result),
            development_suggestions: await generateDevelopmentSuggestions(result),
            report_generated_at: new Date().toISOString()
          }
        };
        
        // Add interpretations for each type
        if (result.raw_scores) {
          const typeNames = algorithm.typeNames;
          for (const [type, scores] of Object.entries(result.raw_scores)) {
            responseData.detailed_analysis.type_interpretations[type] = {
              name: typeNames[type],
              ...scores,
              detailed_interpretation: algorithm.interpret(scores.percentage, type)
            };
          }
        }
        break;
        
      case 'detailed':
      default:
        responseData = {
          ...result,
          metadata: {
            algorithm_version: 'RIASECInternational_v1.0',
            calculation_parameters: result.options || {},
            database_version: 'v2.0',
            retrieved_at: new Date().toISOString()
          }
        };
        break;
    }

    // Add comparison data if available
    if (comparisons) {
      responseData.comparison_analytics = comparisons;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('RIASEC results retrieval error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve assessment results',
        code: 'RETRIEVAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate career recommendations
async function generateCareerRecommendations(result) {
  try {
    const hollandCode = result.calculated_scores?.holland_code;
    if (!hollandCode) return [];

    // جلب التوصيات من جدول riasec_recommendations الجديد
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // تحديد المنطقة والمرحلة (يمكن تخصيصها لاحقاً)
    const region = 'Egypt'; // يمكن أخذها من user profile
    const educationLevel = 'Work'; // يمكن أخذها من user profile أو result metadata

    const { data, error } = await supabase
      .from('riasec_recommendations')
      .select('recommendations_ar')
      .eq('holland_code', hollandCode)
      .eq('region', region)
      .eq('education_level', educationLevel)
      .single();

    if (error || !data) {
      console.error('Error fetching recommendations:', error);
      // Fallback to basic recommendations if database fetch fails
      return [];
    }

    // استخراج الوظائف من النص (مفصولة بـ ؛ أو ;)
    const careers = data.recommendations_ar
      .split(/[؛;]/) // فصل بـ ؛ العربية أو ; الإنجليزية
      .map(career => career.trim())
      .filter(career => career.length > 0)
      .slice(0, 6); // أول 6 وظائف

    return careers;
  } catch (error) {
    console.error('Career recommendation generation error:', error);
    return [];
  }
}

// Helper function to generate development suggestions  
async function generateDevelopmentSuggestions(result) {
  try {
    const ranking = result.calculated_scores?.ranking || [];
    const suggestions = [];

    // Analyze lowest scoring types for development opportunities
    const lowestTypes = ranking.slice(-2);
    
    for (const typeData of lowestTypes) {
      const type = typeData.type;
      const developmentMap = {
        'R': 'تطوير المهارات العملية والتقنية من خلال الدورات التدريبية والورش العملية',
        'I': 'تعزيز مهارات البحث والتحليل من خلال القراءة والدراسة المتعمقة',
        'A': 'استكشاف الأنشطة الإبداعية مثل الرسم أو الكتابة أو الموسيقى',
        'S': 'تطوير مهارات التواصل والعمل مع الآخرين من خلال الأنشطة التطوعية',
        'E': 'بناء مهارات القيادة والإدارة من خلال المشاريع الجماعية',
        'C': 'تحسين مهارات التنظيم والتخطيط من خلال أدوات إدارة الوقت'
      };
      
      if (developmentMap[type]) {
        suggestions.push({
          area: type,
          suggestion: developmentMap[type],
          priority: typeData.percentile < 25 ? 'high' : 'medium'
        });
      }
    }

    return suggestions;
  } catch (error) {
    console.error('Development suggestions generation error:', error);
    return [];
  }
}