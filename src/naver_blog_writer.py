"""
네이버 블로그 글 작성 도구

네이버 검색 최적화와 한국 독자의 읽기 습관을 고려한 블로그 글 생성기
"""

from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime
import re


@dataclass
class BlogConfig:
    """블로그 글 설정"""
    title: str
    keywords: List[str]
    target_audience: str
    content_type: str  # review, howto, place, comparison
    min_length: int = 2000
    max_length: int = 5000
    image_count: int = 5
    emoji_level: str = "moderate"  # none, light, moderate, heavy
    tone: str = "friendly"  # formal, friendly, casual


@dataclass
class BlogSection:
    """블로그 섹션"""
    heading: str
    content: str
    level: int = 2  # H2, H3 등
    images: List[str] = None

    def __post_init__(self):
        if self.images is None:
            self.images = []


class NaverBlogWriter:
    """네이버 블로그 글 작성 클래스"""

    def __init__(self, config: BlogConfig):
        self.config = config
        self.sections: List[BlogSection] = []

    def _optimize_title(self, title: str) -> str:
        """
        제목 최적화
        - 키워드를 앞부분에 배치
        - 25-35자 유지
        - 숫자와 특수문자 활용
        """
        # 키워드가 제목 앞에 없으면 추가
        main_keyword = self.config.keywords[0] if self.config.keywords else ""
        if main_keyword and not title.startswith(main_keyword):
            title = f"{main_keyword} {title}"

        # 길이 조정
        if len(title) > 35:
            title = title[:32] + "..."

        return title

    def _format_intro(self, intro_text: str) -> str:
        """
        서론 포맷팅
        - 공감대 형성
        - 첫 2-3줄에 핵심 요약
        """
        lines = intro_text.strip().split('\n')
        formatted_lines = []

        for i, line in enumerate(lines):
            formatted_lines.append(line.strip())
            # 2-3문장마다 줄바꿈
            if i < len(lines) - 1:
                formatted_lines.append('')

        return '\n'.join(formatted_lines)

    def _format_paragraph(self, text: str) -> str:
        """
        단락 포맷팅
        - 2-3문장마다 줄바꿈
        - 200-300자 단위로 분리
        """
        # 문장 분리
        sentences = re.split(r'(?<=[.!?])\s+', text)

        formatted = []
        current_group = []
        current_length = 0

        for sentence in sentences:
            current_group.append(sentence)
            current_length += len(sentence)

            # 2-3문장 또는 200자 이상이면 그룹 완성
            if len(current_group) >= 2 or current_length >= 200:
                formatted.append(' '.join(current_group))
                formatted.append('')  # 빈 줄
                current_group = []
                current_length = 0

        # 남은 문장 처리
        if current_group:
            formatted.append(' '.join(current_group))

        return '\n'.join(formatted)

    def _add_emphasis(self, text: str, keywords: List[str]) -> str:
        """
        중요 키워드 강조
        - **굵게** 처리
        """
        for keyword in keywords:
            # 이미 강조된 경우 제외
            if f"**{keyword}**" not in text:
                text = text.replace(keyword, f"**{keyword}**", 1)

        return text

    def add_section(self, heading: str, content: str, level: int = 2,
                    images: List[str] = None):
        """섹션 추가"""
        formatted_content = self._format_paragraph(content)
        formatted_content = self._add_emphasis(formatted_content, self.config.keywords)

        section = BlogSection(
            heading=heading,
            content=formatted_content,
            level=level,
            images=images or []
        )
        self.sections.append(section)

    def generate_table_of_contents(self) -> str:
        """목차 생성"""
        toc = ["## 목차\n"]

        for i, section in enumerate(self.sections, 1):
            indent = "  " * (section.level - 2)
            toc.append(f"{indent}{i}. {section.heading}")

        toc.append("")  # 빈 줄
        return '\n'.join(toc)

    def generate_tags(self) -> List[str]:
        """태그 생성 (5-10개)"""
        tags = []

        # 메인 키워드들
        for keyword in self.config.keywords[:5]:
            tags.append(f"#{keyword.replace(' ', '')}")

        # 관련 키워드 추가
        if self.config.content_type == "review":
            tags.extend(["#리뷰", "#후기", "#추천"])
        elif self.config.content_type == "howto":
            tags.extend(["#방법", "#노하우", "#팁"])
        elif self.config.content_type == "place":
            tags.extend(["#가볼만한곳", "#여행", "#맛집"])
        elif self.config.content_type == "comparison":
            tags.extend(["#비교", "#분석", "#추천"])

        # 중복 제거 및 최대 10개로 제한
        tags = list(dict.fromkeys(tags))[:10]

        return tags

    def generate_meta_description(self) -> str:
        """메타 설명 생성 (검색 결과에 표시될 요약문)"""
        description = f"{self.config.keywords[0]} 관련 "

        if self.config.content_type == "review":
            description += "솔직한 리뷰와 사용 후기를 공유합니다."
        elif self.config.content_type == "howto":
            description += "초보자도 쉽게 따라할 수 있는 방법을 알려드립니다."
        elif self.config.content_type == "place":
            description += "꼭 가봐야 할 추천 장소를 소개합니다."
        elif self.config.content_type == "comparison":
            description += "상세한 비교 분석으로 선택을 도와드립니다."

        return description

    def build(self, title: str, intro: str, conclusion: str,
              add_toc: bool = True) -> str:
        """
        최종 블로그 글 생성

        Args:
            title: 제목
            intro: 서론
            conclusion: 결론
            add_toc: 목차 추가 여부

        Returns:
            완성된 블로그 글 (마크다운 형식)
        """
        blog_post = []

        # 제목
        optimized_title = self._optimize_title(title)
        blog_post.append(f"# {optimized_title}\n")

        # 메타 정보 (주석으로)
        blog_post.append(f"<!-- 작성일: {datetime.now().strftime('%Y-%m-%d')} -->")
        blog_post.append(f"<!-- 타겟: {self.config.target_audience} -->")
        blog_post.append(f"<!-- 메타 설명: {self.generate_meta_description()} -->\n")

        # 서론
        blog_post.append(self._format_intro(intro))
        blog_post.append("")

        # 목차
        if add_toc and len(self.sections) >= 3:
            blog_post.append(self.generate_table_of_contents())

        # 본문 섹션들
        for section in self.sections:
            heading_prefix = "#" * section.level
            blog_post.append(f"{heading_prefix} {section.heading}\n")
            blog_post.append(section.content)

            # 이미지 위치 표시
            if section.images:
                blog_post.append("\n[이미지 삽입 위치]")
                for img in section.images:
                    blog_post.append(f"<!-- 이미지: {img} -->")

            blog_post.append("")

        # 결론
        blog_post.append("## 마무리\n")
        blog_post.append(self._format_intro(conclusion))  # 결론도 동일한 포맷 적용
        blog_post.append("")

        # 독자 참여 유도
        blog_post.append(self._generate_cta())
        blog_post.append("")

        # 태그
        tags = self.generate_tags()
        blog_post.append("---")
        blog_post.append(f"**태그**: {' '.join(tags)}")

        return '\n'.join(blog_post)

    def _generate_cta(self) -> str:
        """Call-to-Action 생성"""
        emoji = "😊" if self.config.emoji_level != "none" else ""

        cta = [
            f"오늘 포스팅이 도움이 되셨나요? {emoji}",
            "",
            "궁금한 점이 있으시다면 댓글로 남겨주세요!",
            "더 많은 정보가 필요하시다면 이웃추가 부탁드립니다.",
            ""
        ]

        if self.config.emoji_level in ["moderate", "heavy"]:
            cta.append("공감❤️과 댓글💬은 큰 힘이 됩니다!")

        return '\n'.join(cta)

    def get_stats(self) -> Dict[str, any]:
        """글 통계 정보"""
        full_text = self.build("", "", "")

        return {
            "total_characters": len(full_text),
            "total_sections": len(self.sections),
            "keywords": len(self.config.keywords),
            "tags": len(self.generate_tags()),
            "estimated_reading_time": len(full_text) // 500,  # 분 단위
        }


class SEOOptimizer:
    """SEO 최적화 도구"""

    @staticmethod
    def check_keyword_density(text: str, keyword: str) -> float:
        """키워드 밀도 확인 (이상적: 1-3%)"""
        text_lower = text.lower()
        keyword_lower = keyword.lower()

        keyword_count = text_lower.count(keyword_lower)
        word_count = len(text.split())

        if word_count == 0:
            return 0.0

        density = (keyword_count / word_count) * 100
        return round(density, 2)

    @staticmethod
    def suggest_improvements(text: str, keywords: List[str]) -> List[str]:
        """SEO 개선 제안"""
        suggestions = []

        # 길이 체크
        char_count = len(text)
        if char_count < 1000:
            suggestions.append(f"❌ 글 길이가 너무 짧습니다 ({char_count}자). 최소 1,500자 이상 권장")
        elif char_count < 1500:
            suggestions.append(f"⚠️ 글 길이 보통 ({char_count}자). 2,000자 이상 권장")
        else:
            suggestions.append(f"✅ 글 길이 적정 ({char_count}자)")

        # 키워드 밀도 체크
        for keyword in keywords:
            density = SEOOptimizer.check_keyword_density(text, keyword)
            if density < 0.5:
                suggestions.append(f"❌ '{keyword}' 키워드가 부족합니다 (밀도: {density}%)")
            elif density > 5:
                suggestions.append(f"⚠️ '{keyword}' 키워드가 과도합니다 (밀도: {density}%)")
            else:
                suggestions.append(f"✅ '{keyword}' 키워드 밀도 적정 ({density}%)")

        # 단락 구조 체크
        paragraphs = text.split('\n\n')
        long_paragraphs = [p for p in paragraphs if len(p) > 500]
        if long_paragraphs:
            suggestions.append(f"⚠️ 너무 긴 단락이 {len(long_paragraphs)}개 있습니다. 나눠주세요")

        # 이미지 언급 체크
        image_mentions = text.count('[이미지')
        if image_mentions < 3:
            suggestions.append(f"❌ 이미지가 부족합니다 ({image_mentions}개). 최소 5개 이상 권장")
        else:
            suggestions.append(f"✅ 이미지 수 적정 ({image_mentions}개)")

        return suggestions


def create_blog_writer(topic: str, keywords: List[str],
                      content_type: str = "howto",
                      target_audience: str = "일반") -> NaverBlogWriter:
    """
    간편하게 블로그 작성기 생성

    Args:
        topic: 주제
        keywords: 키워드 리스트
        content_type: 글 유형 (review, howto, place, comparison)
        target_audience: 타겟 독자

    Returns:
        NaverBlogWriter 인스턴스
    """
    config = BlogConfig(
        title=topic,
        keywords=keywords,
        target_audience=target_audience,
        content_type=content_type,
        min_length=2000,
        max_length=5000,
        image_count=5,
        emoji_level="moderate",
        tone="friendly"
    )

    return NaverBlogWriter(config)
