import Anthropic from '@anthropic-ai/sdk';
import type { ScriptGenerationParams, Script } from '../types/script.types';
import { getTemplate } from '../templates';
import { addBufferTime } from '../utils/textAnalyzer';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('VITE_ANTHROPIC_API_KEY is not set. Script generation will not work.');
}

const client = apiKey ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) : null;

interface ClaudeScriptResponse {
  title: string;
  hook: string;
  sections: Array<{
    title: string;
    content: string;
    speakingNotes: string[];
    visualCues: string[];
  }>;
  outro: string;
}

export async function generateScript(params: ScriptGenerationParams): Promise<Script> {
  if (!client) {
    throw new Error('Claude API client is not initialized. Please set VITE_ANTHROPIC_API_KEY.');
  }

  const template = getTemplate(params.contentType);

  const prompt = buildPrompt(params, template);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
                     responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response: No JSON found');
    }

    const scriptData: ClaudeScriptResponse = JSON.parse(
      jsonMatch[1] || jsonMatch[0]
    );

    // Add timestamps to sections
    const sectionsWithIds = scriptData.sections.map((section, index) => ({
      ...section,
      id: `section-${Date.now()}-${index}`,
      estimatedDuration: 0, // Will be calculated by addBufferTime
      timestamp: '00:00',
    }));

    const sectionsWithTime = addBufferTime(sectionsWithIds);

    // Calculate total duration
    const totalDuration = sectionsWithTime.reduce(
      (sum, s) => sum + s.estimatedDuration,
      0
    );

    const script: Script = {
      id: `script-${Date.now()}`,
      title: scriptData.title,
      hook: scriptData.hook,
      sections: sectionsWithTime,
      outro: scriptData.outro,
      estimatedDuration: totalDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: params.contentType,
      metadata: {
        topic: params.topic,
        targetAudience: params.targetAudience,
        tone: params.tone,
        targetDuration: params.duration,
        keyPoints: params.keyPoints,
        customCTA: params.customCTA,
      },
    };

    return script;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}

function buildPrompt(
  params: ScriptGenerationParams,
  template: ReturnType<typeof getTemplate>
): string {
  const structureDescription = template.structure
    .map((section, index) => {
      return `${index + 1}. ${section.title} (${section.guidelines})`;
    })
    .join('\n');

  let prompt = `${template.systemPrompt}

다음 조건에 맞는 유튜브 영상 스크립트를 작성해주세요:

**기본 정보:**
- 주제: ${params.topic}
- 콘텐츠 타입: ${params.contentType}
- 목표 영상 길이: ${params.duration}분
- 타겟 시청자: ${params.targetAudience}
- 톤앤매너: ${params.tone}
`;

  if (params.keyPoints && params.keyPoints.length > 0) {
    prompt += `\n**반드시 포함할 핵심 포인트:**\n`;
    params.keyPoints.forEach(point => {
      prompt += `- ${point}\n`;
    });
  }

  if (params.customCTA) {
    prompt += `\n**CTA (콜투액션):** ${params.customCTA}\n`;
  }

  prompt += `
**스크립트 구조 가이드:**
${structureDescription}

**중요한 작성 지침:**
1. 구어체로 자연스럽게 작성하세요 (실제로 말할 수 있는 문장)
2. 시청자와 대화하듯이 친근하게 작성하세요
3. 각 섹션은 논리적으로 연결되어야 합니다
4. 구체적인 예시와 스토리를 포함하세요
5. 시청자의 관심을 유지할 수 있는 훅과 포인트를 배치하세요
6. speakingNotes에는 촬영 시 참고할 연기 지침이나 표정, 제스처를 포함하세요
7. visualCues에는 B-roll, 화면 전환, 자막, 그래픽 등의 제안을 포함하세요

**응답 형식 (반드시 JSON 형식으로):**
\`\`\`json
{
  "title": "매력적인 영상 제목 (클릭을 유도하되 낚시성은 피함)",
  "hook": "처음 10초 동안 할 말 (시청자의 관심을 강하게 끄는 내용)",
  "sections": [
    {
      "title": "섹션 제목",
      "content": "실제로 말할 스크립트 내용 (구어체, 자연스러운 문장)",
      "speakingNotes": [
        "촬영 시 참고사항 (예: 밝은 표정으로)",
        "강조할 부분이나 제스처"
      ],
      "visualCues": [
        "B-roll 제안 (예: 제품 클로즈업 샷)",
        "화면 전환이나 자막 제안"
      ]
    }
  ],
  "outro": "마무리 멘트 및 CTA (구독, 좋아요, 알림 설정 등)"
}
\`\`\`

이제 위 조건에 맞는 완벽한 스크립트를 JSON 형식으로 작성해주세요.`;

  return prompt;
}

// Test function to check if API is working
export async function testClaudeAPI(): Promise<boolean> {
  if (!client) {
    return false;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say "API is working" if you can read this.',
        },
      ],
    });

    return message.content[0].type === 'text' &&
           message.content[0].text.includes('API is working');
  } catch (error) {
    console.error('Claude API test failed:', error);
    return false;
  }
}
