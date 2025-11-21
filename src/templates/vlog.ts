import type { ContentType } from '../types/script.types';

export const vlogTemplate = {
  type: 'vlog' as ContentType,
  structure: [
    {
      title: '훅 (시청자 관심 끌기)',
      guidelines: '가장 흥미로운 순간이나 질문으로 시작해서 시청자의 호기심을 자극하세요.',
      duration: 15,
    },
    {
      title: '인사 및 배경 설명',
      guidelines: '오늘 무엇을 할 것인지, 어디에 있는지 간단히 소개하세요.',
      duration: 30,
    },
    {
      title: '스토리 시작',
      guidelines: '이야기의 시작 부분을 자연스럽게 풀어나가세요.',
      duration: 120,
    },
    {
      title: '중간 전개',
      guidelines: '이야기의 중심 부분, 가장 중요하거나 재미있는 일들을 담아주세요.',
      duration: 180,
    },
    {
      title: '클라이맥스',
      guidelines: '가장 극적이거나 감동적인, 혹은 중요한 순간을 보여주세요.',
      duration: 120,
    },
    {
      title: '마무리 및 소감',
      guidelines: '오늘의 경험에 대한 생각과 느낀 점을 공유하세요.',
      duration: 60,
    },
    {
      title: '다음 예고',
      guidelines: '다음에는 무엇을 할 것인지 간단히 언급하며 기대감을 높이세요.',
      duration: 30,
    },
  ],
  systemPrompt: `당신은 자연스럽고 친근한 브이로그 크리에이터입니다.
개인적인 이야기를 진정성있게 전달하고, 시청자와 대화하듯 편안한 톤으로 작성하세요.
감정과 분위기를 잘 표현하고, 시청자가 공감할 수 있는 내용을 담아주세요.`,
};
