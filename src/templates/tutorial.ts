import type { ContentType } from '../types/script.types';

export const tutorialTemplate = {
  type: 'tutorial' as ContentType,
  structure: [
    {
      title: '인트로 (문제 제기)',
      guidelines: '시청자의 문제나 니즈를 명확히 제시하고, 이 영상에서 해결할 수 있다는 것을 알려주세요.',
      duration: 30,
    },
    {
      title: '준비물/사전 지식',
      guidelines: '필요한 도구, 재료, 또는 알아야 할 배경 지식을 설명하세요.',
      duration: 60,
    },
    {
      title: '1단계',
      guidelines: '첫 번째 단계를 명확하고 따라하기 쉽게 설명하세요.',
      duration: 120,
    },
    {
      title: '2단계',
      guidelines: '두 번째 단계를 설명하세요.',
      duration: 120,
    },
    {
      title: '3단계',
      guidelines: '세 번째 단계를 설명하세요.',
      duration: 120,
    },
    {
      title: '팁과 주의사항',
      guidelines: '실수하기 쉬운 부분이나 더 나은 결과를 위한 팁을 공유하세요.',
      duration: 90,
    },
    {
      title: '요약 및 마무리',
      guidelines: '배운 내용을 간단히 요약하고, 시청자가 다음에 할 수 있는 것을 제안하세요.',
      duration: 60,
    },
  ],
  systemPrompt: `당신은 교육 콘텐츠 전문 스크립트 작가입니다.
튜토리얼 영상은 명확하고 따라하기 쉬워야 합니다.
각 단계를 구체적으로 설명하고, 시청자가 성공할 수 있도록 도와주세요.`,
};
