#!/usr/bin/env python3
"""
네이버 블로그 작성 CLI

명령줄에서 쉽게 블로그 글을 생성할 수 있는 인터페이스
"""

import argparse
import sys
from pathlib import Path
from typing import List

from naver_blog_writer import create_blog_writer, SEOOptimizer
from templates import (
    create_review_template,
    create_howto_template,
    create_place_template,
    create_comparison_template
)


def parse_keywords(keywords_str: str) -> List[str]:
    """키워드 문자열을 리스트로 변환"""
    return [k.strip() for k in keywords_str.split(',')]


def create_simple_blog(args):
    """간단한 블로그 글 생성"""
    keywords = parse_keywords(args.keywords)

    writer = create_blog_writer(
        topic=args.topic,
        keywords=keywords,
        content_type=args.type,
        target_audience=args.audience
    )

    # 샘플 섹션 추가
    writer.add_section(
        "소개",
        "여기에 본문 내용을 작성하세요. 이것은 샘플 템플릿입니다.",
        level=2
    )

    writer.add_section(
        "상세 내용",
        "더 자세한 내용을 여기에 추가하세요. 단락을 나누고 강조하고 싶은 키워드를 포함하세요.",
        level=2
    )

    # 블로그 생성
    blog_content = writer.build(
        title=args.topic,
        intro="이것은 자동 생성된 서론입니다. 독자의 관심을 끌 수 있도록 수정하세요.",
        conclusion="오늘은 이 주제에 대해 알아봤습니다. 도움이 되셨기를 바랍니다!"
    )

    # 출력 또는 저장
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(blog_content, encoding='utf-8')
        print(f"✅ 블로그 글이 저장되었습니다: {args.output}")
    else:
        print(blog_content)

    # SEO 분석
    if args.analyze:
        print("\n" + "="*50)
        print("📊 SEO 분석 결과")
        print("="*50)
        suggestions = SEOOptimizer.suggest_improvements(blog_content, keywords)
        for suggestion in suggestions:
            print(suggestion)

        stats = writer.get_stats()
        print(f"\n📈 통계:")
        print(f"  - 총 글자 수: {stats['total_characters']}자")
        print(f"  - 섹션 수: {stats['total_sections']}개")
        print(f"  - 예상 읽기 시간: {stats['estimated_reading_time']}분")


def create_review_blog(args):
    """제품 리뷰 블로그 생성"""
    keywords = parse_keywords(args.keywords)

    template = create_review_template(args.product, keywords)

    # 제품 정보 설정
    specs = {}
    if args.specs:
        for spec in args.specs.split(';'):
            if ':' in spec:
                key, value = spec.split(':', 1)
                specs[key.strip()] = value.strip()

    template.set_product_info(
        specs=specs,
        price=args.price or "가격 정보 추가",
        rating=float(args.rating) if args.rating else 4.0
    )

    # 장단점 설정
    pros = args.pros.split(',') if args.pros else ["장점을 추가하세요"]
    cons = args.cons.split(',') if args.cons else ["단점을 추가하세요"]
    template.set_review(pros, cons)

    # 블로그 생성
    blog_content = template.build()

    # 출력 또는 저장
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(blog_content, encoding='utf-8')
        print(f"✅ 리뷰 블로그가 저장되었습니다: {args.output}")
    else:
        print(blog_content)


def create_howto_blog(args):
    """방법/노하우 블로그 생성"""
    keywords = parse_keywords(args.keywords)

    template = create_howto_template(args.topic, keywords)

    # 준비물 설정
    if args.materials:
        materials = [m.strip() for m in args.materials.split(',')]
        template.set_materials(materials)

    # 단계 추가 (샘플)
    steps_count = int(args.steps) if args.steps else 3
    for i in range(1, steps_count + 1):
        template.add_step(
            title=f"{i}단계 제목",
            description=f"{i}단계에 대한 상세한 설명을 여기에 작성하세요.",
            tips=f"{i}단계의 팁을 추가하세요"
        )

    # 블로그 생성
    blog_content = template.build()

    # 출력 또는 저장
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(blog_content, encoding='utf-8')
        print(f"✅ 노하우 블로그가 저장되었습니다: {args.output}")
    else:
        print(blog_content)


def create_place_blog(args):
    """장소 추천 블로그 생성"""
    keywords = parse_keywords(args.keywords)

    count = int(args.count) if args.count else 5
    template = create_place_template(args.location, keywords, count)

    # 샘플 장소 추가
    for i in range(1, count + 1):
        template.add_place(
            name=f"추천 장소 {i}",
            address="주소를 입력하세요",
            description="이 장소에 대한 상세한 설명을 작성하세요.",
            rating=4.5,
            highlights=["특징1", "특징2", "특징3"],
            opening_hours="09:00 - 18:00",
            parking="주차 가능"
        )

    # 블로그 생성
    blog_content = template.build()

    # 출력 또는 저장
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(blog_content, encoding='utf-8')
        print(f"✅ 장소 추천 블로그가 저장되었습니다: {args.output}")
    else:
        print(blog_content)


def create_comparison_blog(args):
    """비교 분석 블로그 생성"""
    keywords = parse_keywords(args.keywords)

    items = args.items.split('vs')
    if len(items) != 2:
        print("❌ 오류: --items는 'A vs B' 형식이어야 합니다")
        sys.exit(1)

    item_a = items[0].strip()
    item_b = items[1].strip()

    template = create_comparison_template(item_a, item_b, keywords)

    # 샘플 데이터 설정
    template.set_similarities(["공통점 1", "공통점 2", "공통점 3"])

    template.add_difference("가격", "A의 가격", "B의 가격")
    template.add_difference("성능", "A의 성능", "B의 성능")
    template.add_difference("디자인", "A의 디자인", "B의 디자인")

    template.set_pros_cons(
        item_a_pros=["A의 장점 1", "A의 장점 2"],
        item_a_cons=["A의 단점 1"],
        item_b_pros=["B의 장점 1", "B의 장점 2"],
        item_b_cons=["B의 단점 1"]
    )

    template.set_recommendation({
        "예산이 중요하다면": f"{item_a} 추천",
        "성능이 중요하다면": f"{item_b} 추천"
    })

    # 블로그 생성
    blog_content = template.build()

    # 출력 또는 저장
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(blog_content, encoding='utf-8')
        print(f"✅ 비교 블로그가 저장되었습니다: {args.output}")
    else:
        print(blog_content)


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description='네이버 블로그 글 작성 도구',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  # 간단한 블로그 생성
  %(prog)s simple --topic "홈트레이닝 방법" --keywords "홈트,운동,다이어트"

  # 제품 리뷰 생성
  %(prog)s review --product "에어팟 프로" --keywords "에어팟,이어폰,리뷰" --rating 4.5

  # 방법/노하우 생성
  %(prog)s howto --topic "블로그 시작" --keywords "블로그,시작,방법" --steps 5

  # 장소 추천 생성
  %(prog)s place --location "부산" --keywords "부산,여행,맛집" --count 7

  # 비교 분석 생성
  %(prog)s compare --items "아이폰 vs 갤럭시" --keywords "스마트폰,비교,추천"
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='명령어')

    # Simple 명령어
    parser_simple = subparsers.add_parser('simple', help='간단한 블로그 생성')
    parser_simple.add_argument('--topic', required=True, help='주제')
    parser_simple.add_argument('--keywords', required=True, help='키워드 (쉼표로 구분)')
    parser_simple.add_argument('--type', default='howto',
                              choices=['review', 'howto', 'place', 'comparison'],
                              help='글 유형')
    parser_simple.add_argument('--audience', default='일반', help='타겟 독자')
    parser_simple.add_argument('--output', '-o', help='출력 파일 경로')
    parser_simple.add_argument('--analyze', action='store_true', help='SEO 분석 수행')

    # Review 명령어
    parser_review = subparsers.add_parser('review', help='제품 리뷰 블로그 생성')
    parser_review.add_argument('--product', required=True, help='제품명')
    parser_review.add_argument('--keywords', required=True, help='키워드 (쉼표로 구분)')
    parser_review.add_argument('--specs', help='스펙 (key:value;key:value 형식)')
    parser_review.add_argument('--price', help='가격')
    parser_review.add_argument('--rating', help='평점 (0-5)')
    parser_review.add_argument('--pros', help='장점 (쉼표로 구분)')
    parser_review.add_argument('--cons', help='단점 (쉼표로 구분)')
    parser_review.add_argument('--output', '-o', help='출력 파일 경로')

    # HowTo 명령어
    parser_howto = subparsers.add_parser('howto', help='방법/노하우 블로그 생성')
    parser_howto.add_argument('--topic', required=True, help='주제')
    parser_howto.add_argument('--keywords', required=True, help='키워드 (쉼표로 구분)')
    parser_howto.add_argument('--materials', help='준비물 (쉼표로 구분)')
    parser_howto.add_argument('--steps', help='단계 수', default='3')
    parser_howto.add_argument('--output', '-o', help='출력 파일 경로')

    # Place 명령어
    parser_place = subparsers.add_parser('place', help='장소 추천 블로그 생성')
    parser_place.add_argument('--location', required=True, help='지역명')
    parser_place.add_argument('--keywords', required=True, help='키워드 (쉼표로 구분)')
    parser_place.add_argument('--count', help='추천 장소 수', default='5')
    parser_place.add_argument('--output', '-o', help='출력 파일 경로')

    # Compare 명령어
    parser_compare = subparsers.add_parser('compare', help='비교 분석 블로그 생성')
    parser_compare.add_argument('--items', required=True, help='비교 대상 (A vs B)')
    parser_compare.add_argument('--keywords', required=True, help='키워드 (쉼표로 구분)')
    parser_compare.add_argument('--output', '-o', help='출력 파일 경로')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # 명령어별 처리
    try:
        if args.command == 'simple':
            create_simple_blog(args)
        elif args.command == 'review':
            create_review_blog(args)
        elif args.command == 'howto':
            create_howto_blog(args)
        elif args.command == 'place':
            create_place_blog(args)
        elif args.command == 'compare':
            create_comparison_blog(args)
    except Exception as e:
        print(f"❌ 오류 발생: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
