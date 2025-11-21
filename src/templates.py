"""
네이버 블로그 템플릿 클래스

다양한 유형의 블로그 글을 쉽게 작성할 수 있는 템플릿 제공
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from naver_blog_writer import NaverBlogWriter, create_blog_writer


class BlogTemplate(ABC):
    """블로그 템플릿 베이스 클래스"""

    def __init__(self, topic: str, keywords: List[str], target_audience: str = "일반"):
        self.topic = topic
        self.keywords = keywords
        self.target_audience = target_audience
        self.writer: Optional[NaverBlogWriter] = None

    @abstractmethod
    def generate_intro(self) -> str:
        """서론 생성"""
        pass

    @abstractmethod
    def add_main_content(self):
        """본문 컨텐츠 추가"""
        pass

    @abstractmethod
    def generate_conclusion(self) -> str:
        """결론 생성"""
        pass

    def build(self) -> str:
        """템플릿으로 블로그 글 생성"""
        if not self.writer:
            raise ValueError("Writer not initialized. Call generate() first.")

        intro = self.generate_intro()
        self.add_main_content()
        conclusion = self.generate_conclusion()

        return self.writer.build(self.topic, intro, conclusion)


class ProductReviewTemplate(BlogTemplate):
    """제품 리뷰 템플릿"""

    def __init__(self, product_name: str, keywords: List[str],
                 purchase_reason: str = "", usage_period: str = "1개월",
                 target_audience: str = "제품 구매 예정자"):
        super().__init__(product_name, keywords, target_audience)
        self.product_name = product_name
        self.purchase_reason = purchase_reason
        self.usage_period = usage_period
        self.writer = create_blog_writer(
            topic=f"{product_name} 솔직 리뷰",
            keywords=keywords,
            content_type="review",
            target_audience=target_audience
        )

        # 리뷰 데이터
        self.specs: Dict[str, str] = {}
        self.pros: List[str] = []
        self.cons: List[str] = []
        self.price: str = ""
        self.rating: float = 0.0

    def set_product_info(self, specs: Dict[str, str], price: str, rating: float):
        """제품 정보 설정"""
        self.specs = specs
        self.price = price
        self.rating = rating

    def set_review(self, pros: List[str], cons: List[str]):
        """장단점 설정"""
        self.pros = pros
        self.cons = cons

    def generate_intro(self) -> str:
        intro = f"{self.product_name}, 요즘 많이 알아보고 계시죠?\n\n"

        if self.purchase_reason:
            intro += f"저도 {self.purchase_reason} 이 제품을 구매하게 되었는데요.\n\n"

        intro += f"{self.usage_period} 동안 직접 사용해본 솔직한 후기를 공유합니다!"

        return intro

    def add_main_content(self):
        # 1. 제품 소개
        specs_text = "\n".join([f"- **{k}**: {v}" for k, v in self.specs.items()])
        self.writer.add_section(
            "제품 소개",
            f"{self.product_name}의 주요 스펙입니다.\n\n{specs_text}\n\n"
            f"가격은 {self.price}이며, 제 평가는 **{self.rating}/5.0점**입니다.",
            level=2
        )

        # 2. 첫인상
        self.writer.add_section(
            "첫인상 및 디자인",
            "제품을 처음 받았을 때의 느낌과 디자인적인 부분을 살펴보겠습니다. "
            "박스 개봉부터 실제 디자인까지 상세히 알려드립니다.",
            level=2
        )

        # 3. 실사용 경험
        self.writer.add_section(
            "실제 사용 후기",
            f"{self.usage_period} 동안 실제로 사용하면서 느낀 점들을 정리했습니다. "
            "일상에서 어떻게 활용했는지, 어떤 점이 좋았는지 솔직하게 말씀드립니다.",
            level=2
        )

        # 4. 장점
        if self.pros:
            pros_text = "\n\n".join([f"**{i+1}. {pro}**\n상세 설명을 추가하세요."
                                     for i, pro in enumerate(self.pros)])
            self.writer.add_section(
                "장점",
                f"실제 사용하면서 가장 만족스러웠던 점들입니다.\n\n{pros_text}",
                level=2
            )

        # 5. 단점
        if self.cons:
            cons_text = "\n\n".join([f"**{i+1}. {con}**\n개선되면 좋을 것 같습니다."
                                     for i, con in enumerate(self.cons)])
            self.writer.add_section(
                "단점 (아쉬운 점)",
                f"솔직하게 말씀드리는 아쉬운 부분들입니다.\n\n{cons_text}",
                level=2
            )

        # 6. 가격 대비 만족도
        self.writer.add_section(
            "가격 대비 만족도",
            f"{self.price}라는 가격을 고려했을 때, 이 제품의 가치는 충분하다고 생각합니다. "
            "비슷한 가격대의 다른 제품들과 비교했을 때도 경쟁력이 있습니다.",
            level=2
        )

    def generate_conclusion(self) -> str:
        conclusion = f"{self.product_name}을 {self.usage_period} 동안 사용해본 결과, "

        if self.rating >= 4.0:
            conclusion += "매우 만족스러운 제품이었습니다.\n\n"
        elif self.rating >= 3.0:
            conclusion += "전반적으로 만족스러운 제품이었습니다.\n\n"
        else:
            conclusion += "아쉬운 점들이 있었던 제품입니다.\n\n"

        conclusion += "이런 분들께 추천합니다:\n"
        conclusion += f"- {self.target_audience}\n"
        conclusion += f"- {self.product_name}에 관심 있으신 분\n"

        return conclusion


class HowToTemplate(BlogTemplate):
    """방법/노하우 템플릿"""

    def __init__(self, topic: str, keywords: List[str],
                 difficulty: str = "초급", time_required: str = "10분",
                 target_audience: str = "초보자"):
        super().__init__(topic, keywords, target_audience)
        self.difficulty = difficulty
        self.time_required = time_required
        self.writer = create_blog_writer(
            topic=f"{topic} 하는 법",
            keywords=keywords,
            content_type="howto",
            target_audience=target_audience
        )

        self.materials: List[str] = []
        self.steps: List[Dict[str, str]] = []
        self.tips: List[str] = []

    def set_materials(self, materials: List[str]):
        """준비물 설정"""
        self.materials = materials

    def add_step(self, title: str, description: str, tips: str = ""):
        """단계 추가"""
        self.steps.append({
            "title": title,
            "description": description,
            "tips": tips
        })

    def set_tips(self, tips: List[str]):
        """팁 설정"""
        self.tips = tips

    def generate_intro(self) -> str:
        intro = f"{self.topic}, 어떻게 하시나요?\n\n"
        intro += f"생각보다 어렵지 않습니다! {self.difficulty} 수준이며, "
        intro += f"**{self.time_required}**만 있으면 충분합니다.\n\n"
        intro += "오늘은 제가 직접 해보고 정리한 쉬운 방법을 알려드립니다."

        return intro

    def add_main_content(self):
        # 1. 준비물
        if self.materials:
            materials_text = "\n".join([f"- {m}" for m in self.materials])
            self.writer.add_section(
                "필요한 준비물",
                f"시작하기 전에 다음 항목들을 준비해주세요.\n\n{materials_text}",
                level=2
            )

        # 2. 단계별 설명
        for i, step in enumerate(self.steps, 1):
            step_content = f"{step['description']}\n\n"

            if step.get('tips'):
                step_content += f"**💡 팁**: {step['tips']}"

            self.writer.add_section(
                f"Step {i}: {step['title']}",
                step_content,
                level=2
            )

        # 3. 주의사항 및 추가 팁
        if self.tips:
            tips_text = "\n\n".join([f"**{i+1}. {tip}**" for i, tip in enumerate(self.tips)])
            self.writer.add_section(
                "주의사항 및 꿀팁",
                f"더 잘하기 위한 추가 팁들입니다.\n\n{tips_text}",
                level=2
            )

    def generate_conclusion(self) -> str:
        conclusion = f"{self.topic}, 이제 할 수 있겠죠?\n\n"
        conclusion += f"제가 알려드린 {len(self.steps)}단계만 따라하시면 "
        conclusion += f"{self.time_required} 안에 완성할 수 있습니다.\n\n"
        conclusion += "혹시 따라하시다가 어려운 부분이 있다면 댓글로 알려주세요!"

        return conclusion


class PlaceRecommendationTemplate(BlogTemplate):
    """장소 추천 템플릿"""

    def __init__(self, location: str, keywords: List[str],
                 recommendation_count: int = 5,
                 target_audience: str = "여행 계획자"):
        super().__init__(f"{location} 가볼만한곳", keywords, target_audience)
        self.location = location
        self.recommendation_count = recommendation_count
        self.writer = create_blog_writer(
            topic=f"{location} 가볼만한곳 BEST {recommendation_count}",
            keywords=keywords,
            content_type="place",
            target_audience=target_audience
        )

        self.places: List[Dict[str, any]] = []

    def add_place(self, name: str, address: str, description: str,
                  rating: float, highlights: List[str],
                  opening_hours: str = "", parking: str = ""):
        """장소 추가"""
        self.places.append({
            "name": name,
            "address": address,
            "description": description,
            "rating": rating,
            "highlights": highlights,
            "opening_hours": opening_hours,
            "parking": parking
        })

    def generate_intro(self) -> str:
        intro = f"{self.location} 여행 계획 중이신가요?\n\n"
        intro += f"현지인이 직접 추천하는 {self.location} 가볼만한곳 "
        intro += f"**BEST {self.recommendation_count}**를 소개합니다.\n\n"
        intro += "숨은 명소부터 핫플레이스까지 모두 담았으니 참고하세요!"

        return intro

    def add_main_content(self):
        for i, place in enumerate(self.places, 1):
            # 장소별 섹션
            highlights_text = " / ".join(place["highlights"])

            content = f"**📍 위치**: {place['address']}\n\n"
            content += f"{place['description']}\n\n"
            content += f"**⭐ 평점**: {place['rating']}/5.0\n\n"
            content += f"**✨ 포인트**: {highlights_text}\n\n"

            if place.get("opening_hours"):
                content += f"**🕐 운영시간**: {place['opening_hours']}\n\n"

            if place.get("parking"):
                content += f"**🚗 주차**: {place['parking']}\n\n"

            self.writer.add_section(
                f"{i}. {place['name']}",
                content,
                level=2
            )

    def generate_conclusion(self) -> str:
        conclusion = f"{self.location} 가볼만한곳 {len(self.places)}곳을 소개해드렸습니다.\n\n"
        conclusion += "추천 코스: "
        course = " → ".join([p["name"] for p in self.places[:3]])
        conclusion += f"{course}\n\n"
        conclusion += "시간 여유가 있다면 하루 코스로 돌아보시는 것도 좋습니다!"

        return conclusion


class ComparisonTemplate(BlogTemplate):
    """비교/분석 템플릿"""

    def __init__(self, item_a: str, item_b: str, keywords: List[str],
                 target_audience: str = "구매 고민 중인 분"):
        topic = f"{item_a} vs {item_b} 비교"
        super().__init__(topic, keywords, target_audience)
        self.item_a = item_a
        self.item_b = item_b
        self.writer = create_blog_writer(
            topic=topic,
            keywords=keywords,
            content_type="comparison",
            target_audience=target_audience
        )

        self.similarities: List[str] = []
        self.differences: Dict[str, Dict[str, str]] = {}
        self.item_a_pros: List[str] = []
        self.item_a_cons: List[str] = []
        self.item_b_pros: List[str] = []
        self.item_b_cons: List[str] = []
        self.recommendation: Dict[str, str] = {}

    def set_similarities(self, similarities: List[str]):
        """공통점 설정"""
        self.similarities = similarities

    def add_difference(self, aspect: str, item_a_value: str, item_b_value: str):
        """차이점 추가"""
        self.differences[aspect] = {
            "a": item_a_value,
            "b": item_b_value
        }

    def set_pros_cons(self, item_a_pros: List[str], item_a_cons: List[str],
                      item_b_pros: List[str], item_b_cons: List[str]):
        """장단점 설정"""
        self.item_a_pros = item_a_pros
        self.item_a_cons = item_a_cons
        self.item_b_pros = item_b_pros
        self.item_b_cons = item_b_cons

    def set_recommendation(self, situations: Dict[str, str]):
        """상황별 추천 설정"""
        self.recommendation = situations

    def generate_intro(self) -> str:
        intro = f"{self.item_a}와 {self.item_b}, 둘 중 어떤 걸 선택해야 할까요?\n\n"
        intro += "저도 고민이 많았는데요, 직접 비교 분석해봤습니다.\n\n"
        intro += "어떤 상황에 어떤 제품이 더 좋은지 명확하게 알려드립니다!"

        return intro

    def add_main_content(self):
        # 1. 공통점
        if self.similarities:
            sim_text = "\n".join([f"- {s}" for s in self.similarities])
            self.writer.add_section(
                "공통점",
                f"먼저 두 제품의 공통점을 살펴보겠습니다.\n\n{sim_text}",
                level=2
            )

        # 2. 차이점 (표로 정리)
        if self.differences:
            table = "| 구분 | " + self.item_a + " | " + self.item_b + " |\n"
            table += "|------|------|------|\n"

            for aspect, values in self.differences.items():
                table += f"| **{aspect}** | {values['a']} | {values['b']} |\n"

            self.writer.add_section(
                "차이점 비교",
                f"두 제품의 주요 차이점을 표로 정리했습니다.\n\n{table}",
                level=2
            )

        # 3. A 제품 장단점
        a_pros_text = "\n".join([f"✅ {p}" for p in self.item_a_pros])
        a_cons_text = "\n".join([f"❌ {c}" for c in self.item_a_cons])

        self.writer.add_section(
            f"{self.item_a} 장단점",
            f"**장점**\n{a_pros_text}\n\n**단점**\n{a_cons_text}",
            level=2
        )

        # 4. B 제품 장단점
        b_pros_text = "\n".join([f"✅ {p}" for p in self.item_b_pros])
        b_cons_text = "\n".join([f"❌ {c}" for c in self.item_b_cons])

        self.writer.add_section(
            f"{self.item_b} 장단점",
            f"**장점**\n{b_pros_text}\n\n**단점**\n{b_cons_text}",
            level=2
        )

        # 5. 상황별 추천
        if self.recommendation:
            rec_text = ""
            for situation, choice in self.recommendation.items():
                rec_text += f"**{situation}**\n→ {choice}\n\n"

            self.writer.add_section(
                "상황별 추천",
                f"어떤 상황에 어떤 제품이 좋은지 정리했습니다.\n\n{rec_text}",
                level=2
            )

    def generate_conclusion(self) -> str:
        conclusion = f"{self.item_a} vs {self.item_b}, 비교 분석을 마칩니다.\n\n"
        conclusion += "결론적으로 두 제품 모두 장단점이 있으니, "
        conclusion += "본인의 상황과 필요에 맞춰 선택하시면 됩니다.\n\n"
        conclusion += "저는 개인적으로... (본인의 선택과 이유를 작성하세요)"

        return conclusion


# 편의 함수들
def create_review_template(product_name: str, keywords: List[str]) -> ProductReviewTemplate:
    """제품 리뷰 템플릿 생성"""
    return ProductReviewTemplate(product_name, keywords)


def create_howto_template(topic: str, keywords: List[str]) -> HowToTemplate:
    """방법/노하우 템플릿 생성"""
    return HowToTemplate(topic, keywords)


def create_place_template(location: str, keywords: List[str],
                         count: int = 5) -> PlaceRecommendationTemplate:
    """장소 추천 템플릿 생성"""
    return PlaceRecommendationTemplate(location, keywords, count)


def create_comparison_template(item_a: str, item_b: str,
                              keywords: List[str]) -> ComparisonTemplate:
    """비교/분석 템플릿 생성"""
    return ComparisonTemplate(item_a, item_b, keywords)
