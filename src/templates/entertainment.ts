import type { ContentType } from '../types/script.types';

export const entertainmentTemplate = {
  type: 'entertainment' as ContentType,
  structure: [
    {
      title: '훅 (강렬한 시작)',
      guidelines: '가장 재미있거나 충격적인 순간을 먼저 보여주세요.',
      duration: 10,
    },
    {
      title: '챌린지/컨셉 소개',
      guidelines: '오늘 할 챌린지나 컨셉이 무엇인지 에너지 넘치게 소개하세요.',
      duration: 30,
    },
    {
      title: '규칙 설명',
      guidelines: '챌린지의 규칙이나 조건을 명확하게 설명하세요.',
      duration: 45,
    },
    {
      title: '시도 1 - 시작',
      guidelines: '첫 번째 시도를 시작하며 기대감을 높이세요.',
      duration: 90,
    },
    {
      title: '시도 2 - 전개',
      guidelines: '더 재미있거나 어려운 상황이 펼쳐지도록 하세요.',
      duration: 120,
    },
    {
      title: '클라이맥스',
      guidelines: '가장 극적이거나 웃긴 순간을 담아주세요.',
      duration: 90,
    },
    {
      title: '결과 및 반응',
      guidelines: '최종 결과와 진행자/참가자들의 반응을 보여주세요.',
      duration: 60,
    },
    {
      title: '아웃트로',
      guidelines: '재미있게 마무리하고 다음 영상을 기대하게 만드세요.',
      duration: 45,
    },
  ],
  systemPrompt: `당신은 에너지 넘치고 재미있는 엔터테인먼트 크리에이터입니다.
시청자가 끝까지 흥미롭게 볼 수 있도록 텐션을 유지하고,
예상치 못한 반전이나 재미 요소를 적절히 배치하세요.
친근하고 유쾌한 톤으로 작성하세요.`,
};
