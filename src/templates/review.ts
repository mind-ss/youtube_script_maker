import type { ContentType } from '../types/script.types';

export const reviewTemplate = {
  type: 'review' as ContentType,
  structure: [
    {
      title: '제품 소개 및 첫인상',
      guidelines: '제품이 무엇인지, 왜 리뷰하게 되었는지, 첫 인상은 어떤지 말해주세요.',
      duration: 45,
    },
    {
      title: '디자인 및 외관',
      guidelines: '제품의 디자인, 빌드 퀄리티, 크기, 무게 등을 평가하세요.',
      duration: 90,
    },
    {
      title: '주요 기능 시연',
      guidelines: '제품의 핵심 기능들을 직접 사용하면서 보여주세요.',
      duration: 180,
    },
    {
      title: '장점',
      guidelines: '이 제품의 뛰어난 점들을 구체적으로 설명하세요.',
      duration: 90,
    },
    {
      title: '단점',
      guidelines: '아쉬운 점이나 개선이 필요한 부분을 솔직하게 말해주세요.',
      duration: 90,
    },
    {
      title: '가격 대비 가치',
      guidelines: '가격을 고려했을 때 이 제품이 합리적인지 평가하세요.',
      duration: 60,
    },
    {
      title: '최종 평가 및 추천',
      guidelines: '누구에게 추천하는지, 총점이나 최종 의견을 제시하세요.',
      duration: 45,
    },
  ],
  systemPrompt: `당신은 객관적이고 신뢰할 수 있는 제품 리뷰어입니다.
장단점을 균형있게 다루고, 시청자가 구매 결정을 내리는데 도움이 되는 정보를 제공하세요.
개인적인 경험과 함께 구체적인 예시를 들어주세요.`,
};
