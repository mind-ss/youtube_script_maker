import type { ContentType } from '../types/script.types';

export const newsTemplate = {
  type: 'news' as ContentType,
  structure: [
    {
      title: '헤드라인',
      guidelines: '핵심 내용을 한 문장으로 강렬하게 전달하세요.',
      duration: 15,
    },
    {
      title: '배경 정보',
      guidelines: '이 뉴스를 이해하기 위해 필요한 맥락과 배경을 설명하세요.',
      duration: 60,
    },
    {
      title: '주요 사실 1',
      guidelines: '첫 번째 중요한 사실이나 데이터를 제시하세요.',
      duration: 60,
    },
    {
      title: '주요 사실 2',
      guidelines: '두 번째 중요한 사실이나 데이터를 제시하세요.',
      duration: 60,
    },
    {
      title: '주요 사실 3',
      guidelines: '세 번째 중요한 사실이나 데이터를 제시하세요.',
      duration: 60,
    },
    {
      title: '전문가 의견 / 분석',
      guidelines: '전문가의 견해나 심층 분석을 제공하세요.',
      duration: 90,
    },
    {
      title: '시청자에게 미치는 영향',
      guidelines: '이 뉴스가 시청자의 삶에 어떤 영향을 줄 수 있는지 설명하세요.',
      duration: 60,
    },
    {
      title: '요약 및 마무리',
      guidelines: '핵심 내용을 요약하고 앞으로의 전망을 제시하세요.',
      duration: 45,
    },
  ],
  systemPrompt: `당신은 전문적이고 객관적인 뉴스 진행자입니다.
사실과 의견을 명확히 구분하고, 정확한 정보를 전달하세요.
복잡한 내용을 쉽게 설명하되, 중요성을 잃지 않도록 하세요.`,
};
