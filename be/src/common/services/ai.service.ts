import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIAnalysisResult,
  AssessmentAnswerData,
} from '../interfaces/ai-analysis.interface';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface Career {
  title: string;
  description?: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private readonly model = 'models/gemini-2.5-flash';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('app.geminiApiKey') || 
                  this.configService.get<string>('GEMINI_API_KEY') || 
                  'AIzaSyApFDUurQHtjFoytIhUIMr0OPbX3WhvC4c';
  }

  async analyzePersonalityAndCareers(
    assessmentAnswers: AssessmentAnswerData[],
    availableCareers: Career[] = []
  ): Promise<AIAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(assessmentAnswers, availableCareers);
      const response = await this.callGeminiAPI(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      this.logger.error('Failed to analyze personality and careers:', error);
      throw new Error('AI analysis failed');
    }
  }

  private buildAnalysisPrompt(answers: AssessmentAnswerData[], careers: Career[]): string {
    const answersText = answers.map(a => 
      `Question: ${a.questionText}\nDimension: ${a.dimension}\nAnswer: ${JSON.stringify(a.answer)}`
    ).join('\n\n');

    const careersText = careers.length > 0 
      ? careers.map(c => `- ${c.title}: ${c.description || 'No description'}`).join('\n')
      : "Please suggest suitable careers based on personality analysis.";

    return `
You are an expert career counselor and psychologist. Analyze the following personality assessment results and provide career recommendations.

ASSESSMENT ANSWERS:
${answersText}

AVAILABLE CAREERS:
${careersText}

Please provide a comprehensive analysis in the following JSON format:
{
  "personalityAnalysis": {
    "bigFiveScores": {
      "openness": <0-100>,
      "conscientiousness": <0-100>,
      "extraversion": <0-100>,
      "agreeableness": <0-100>,
      "neuroticism": <0-100>
    },
    "riasecScores": {
      "realistic": <0-100>,
      "investigative": <0-100>,
      "artistic": <0-100>,
      "social": <0-100>,
      "enterprising": <0-100>,
      "conventional": <0-100>
    },
    "personalityProfile": {
      "dominantTraits": ["trait1", "trait2"],
      "strengthAreas": ["strength1", "strength2"],
      "developmentAreas": ["area1", "area2"],
      "workStyle": "description of preferred work style",
      "communication": "communication preference description", 
      "leadership": "leadership style description"
    }
  },
  "careerRecommendations": [
    {
      "careerId": "unique_id_or_null",
      "careerTitle": "Career Title",
      "fitScore": <0-100>,
      "personalityMatch": {
        "bigFiveAlignment": <0-100>,
        "riasecAlignment": <0-100>,
        "overallFit": <0-100>
      },
      "reasons": ["reason1", "reason2"],
      "potentialChallenges": ["challenge1", "challenge2"],
      "developmentSuggestions": ["suggestion1", "suggestion2"]
    }
  ],
  "explanation": "Overall analysis explanation and insights",
  "confidence": <0-100>
}

Requirements:
1. Analyze personality dimensions based on assessment answers
2. Calculate realistic scores (0-100) for Big Five and RIASEC
3. Recommend 3-5 most suitable careers
4. Provide specific, actionable insights
5. Be accurate and evidence-based
6. Return valid JSON only (no additional text)
7. ALL text content (traits, strengths, reasons, suggestions, explanations, etc.) MUST be written in Vietnamese language
`;
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };

    this.logger.debug('Calling Gemini API for personality analysis');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  private parseAnalysisResponse(responseText: string): AIAnalysisResult {
    try {
      // Clean up the response to extract JSON
      let cleanJson = responseText.trim();
      
      // Remove markdown code blocks if present
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json\n?/, '').replace(/```$/, '');
      }
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```\n?/, '').replace(/```$/, '');
      }

      // Try to fix truncated JSON by attempting to close brackets
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(cleanJson) as Record<string, unknown>;
      } catch (parseError) {
        this.logger.warn('JSON parse failed, attempting to fix truncated response...');
        // Try to fix by adding closing brackets
        let fixedJson = cleanJson;
        const openBraces = (fixedJson.match(/{/g) || []).length;
        const closeBraces = (fixedJson.match(/}/g) || []).length;
        const openBrackets = (fixedJson.match(/\[/g) || []).length;
        const closeBrackets = (fixedJson.match(/]/g) || []).length;
        
        // Add missing closing brackets
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          fixedJson += ']';
        }
        for (let i = 0; i < openBraces - closeBraces; i++) {
          fixedJson += '}';
        }
        
        try {
          parsed = JSON.parse(fixedJson) as Record<string, unknown>;
          this.logger.log('Successfully fixed truncated JSON');
        } catch {
          throw parseError;
        }
      }
      
      // Validate the structure
      if (!parsed.personalityAnalysis || !parsed.careerRecommendations) {
        throw new Error('Invalid analysis response structure');
      }

      return parsed as unknown as AIAnalysisResult;
    } catch (error) {
      this.logger.error('Failed to parse AI analysis response:', error);
      this.logger.debug('Raw response:', responseText);
      
      // Return a fallback structure
      return this.createFallbackAnalysis();
    }
  }

  private createFallbackAnalysis(): AIAnalysisResult {
    return {
      personalityAnalysis: {
        bigFiveScores: {
          openness: 60,
          conscientiousness: 60,
          extraversion: 60,
          agreeableness: 60,
          neuroticism: 40
        },
        riasecScores: {
          realistic: 50,
          investigative: 50,
          artistic: 50,
          social: 50,
          enterprising: 50,
          conventional: 50
        },
        personalityProfile: {
          dominantTraits: ['Tính cách cân bằng'],
          strengthAreas: ['Khả năng thích ứng', 'Kỹ năng giao tiếp'],
          developmentAreas: ['Cần đánh giá thêm'],
          workStyle: 'Linh hoạt với nhiều môi trường làm việc khác nhau',
          communication: 'Kỹ năng giao tiếp hiệu quả',
          leadership: 'Phong cách lãnh đạo hợp tác'
        }
      },
      careerRecommendations: [
        {
          careerId: null,
          careerTitle: 'Chuyên viên phân tích kinh doanh',
          fitScore: 75,
          personalityMatch: {
            bigFiveAlignment: 70,
            riasecAlignment: 80,
            overallFit: 75
          },
          reasons: ['Kỹ năng phân tích tốt', 'Khả năng giao tiếp mạnh'],
          potentialChallenges: ['Có thể cần đào tạo kỹ thuật'],
          developmentSuggestions: ['Phát triển kỹ năng phân tích dữ liệu', 'Tìm hiểu quy trình kinh doanh']
        }
      ],
      explanation: 'Phân tích hoàn thành với dữ liệu hạn chế. Vui lòng hoàn thành đầy đủ bài đánh giá để có kết quả chính xác hơn.',
      confidence: 60
    };
  }

  async generateCareerInsight(careerTitle: string, personalityTraits: string[]): Promise<string> {
    const prompt = `
Với tư cách là chuyên gia tư vấn nghề nghiệp, hãy cung cấp nhận xét ngắn gọn về việc một người có những đặc điểm tính cách sau sẽ phù hợp với nghề ${careerTitle} như thế nào:

Đặc điểm tính cách: ${personalityTraits.join(', ')}

Cung cấp nhận xét cụ thể, có thể hành động trong 2-3 câu về:
1. Tại sao nghề này phù hợp với tính cách của họ
2. Họ nên tập trung vào điều gì để thành công

Giữ phản hồi chuyên nghiệp và khích lệ. Trả lời bằng tiếng Việt.
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      this.logger.error('Failed to generate career insight:', error);
      return `${careerTitle} có thể phù hợp với hồ sơ tính cách của bạn. Hãy tập trung phát triển các kỹ năng liên quan và tích lũy kinh nghiệm trong lĩnh vực này.`;
    }
  }
}