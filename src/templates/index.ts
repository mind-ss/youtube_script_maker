import { tutorialTemplate } from './tutorial';
import { reviewTemplate } from './review';
import { vlogTemplate } from './vlog';
import { newsTemplate } from './news';
import { entertainmentTemplate } from './entertainment';
import type { ContentType } from '../types/script.types';

export const templates = {
  tutorial: tutorialTemplate,
  review: reviewTemplate,
  vlog: vlogTemplate,
  news: newsTemplate,
  entertainment: entertainmentTemplate,
};

export function getTemplate(contentType: ContentType) {
  return templates[contentType];
}

export const contentTypeLabels: Record<ContentType, string> = {
  tutorial: '튜토리얼/강의',
  review: '리뷰/언박싱',
  vlog: '브이로그/스토리텔링',
  news: '정보 전달/뉴스',
  entertainment: '엔터테인먼트/챌린지',
};

export const toneLabels = {
  friendly: '친근함',
  professional: '전문적',
  humorous: '유머러스',
  serious: '진지함',
};

export const audienceLabels = {
  beginner: '초보자',
  intermediate: '중급자',
  expert: '전문가',
  general: '일반인',
};
