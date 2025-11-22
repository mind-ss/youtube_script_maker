"""
제품 리뷰 블로그 예시

에어팟 프로 리뷰를 작성하는 예시입니다.
"""

import sys
sys.path.append('../src')

from templates import ProductReviewTemplate

# 제품 리뷰 템플릿 생성
template = ProductReviewTemplate(
    product_name="애플 에어팟 프로 2세대",
    keywords=["에어팟프로", "에어팟프로2세대", "무선이어폰", "노이즈캔슬링", "애플이어폰"]
)

# 제품 정보 설정
template.set_product_info(
    specs={
        "브랜드": "Apple",
        "모델명": "AirPods Pro (2nd generation)",
        "연결 방식": "블루투스 5.3",
        "배터리": "최대 6시간 (ANC 켜짐 시)",
        "방수": "IPX4",
        "무게": "5.3g (이어버드 하나)"
    },
    price="359,000원",
    rating=4.5
)

# 장단점 설정
template.pros = [
    "탁월한 노이즈 캔슬링 기능",
    "애플 생태계와의 완벽한 연동",
    "편안한 착용감",
    "공간 오디오 지원으로 입체적인 사운드",
    "MagSafe 충전 지원"
]

template.cons = [
    "다른 무선이어폰 대비 높은 가격",
    "안드로이드에서는 기능 제한"
]

# 구매 이유 설정
template.purchase_reason = "기존 에어팟의 배터리가 약해져서"
template.usage_period = "3개월"

# 블로그 생성
blog_content = template.build()

# 파일로 저장
output_file = "generated_airpods_review.md"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(blog_content)

print(f"✅ 에어팟 프로 리뷰가 생성되었습니다: {output_file}")
print("\n미리보기:")
print("="*50)
print(blog_content[:500])
print("...")
