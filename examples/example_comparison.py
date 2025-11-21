"""
비교 분석 블로그 예시

아이폰 vs 갤럭시 비교를 작성하는 예시입니다.
"""

import sys
sys.path.append('../src')

from templates import create_comparison_template

# 비교 템플릿 생성
template = create_comparison_template(
    item_a="아이폰 15 Pro",
    item_b="갤럭시 S24 Ultra",
    keywords=["아이폰", "갤럭시", "스마트폰비교", "아이폰vs갤럭시", "플래그십폰"]
)

# 공통점 설정
template.set_similarities([
    "둘 다 각 회사의 최고급 플래그십 모델",
    "고성능 프로세서 탑재 (A17 Pro vs Snapdragon 8 Gen 3)",
    "120Hz 고주사율 디스플레이 지원",
    "고급 카메라 시스템 (멀티 렌즈)",
    "프리미엄 디자인과 내구성",
    "빠른 충전 및 무선 충전 지원"
])

# 차이점 추가
template.add_difference(
    "운영체제",
    "iOS 17 (폐쇄형 생태계)",
    "Android 14 (개방형 생태계)"
)

template.add_difference(
    "디스플레이",
    "6.1인치 OLED, 2556x1179",
    "6.8인치 Dynamic AMOLED 2X, 3120x1440"
)

template.add_difference(
    "카메라",
    "48MP 메인 + 12MP 울트라와이드 + 12MP 망원(3배)",
    "200MP 메인 + 12MP 울트라와이드 + 50MP 망원(5배) + 10MP 망원(3배)"
)

template.add_difference(
    "배터리",
    "3,274mAh",
    "5,000mAh"
)

template.add_difference(
    "S펜",
    "미지원",
    "S펜 내장 (필기 및 그리기)"
)

template.add_difference(
    "가격",
    "약 155만원 (256GB)",
    "약 160만원 (256GB)"
)

template.add_difference(
    "생태계",
    "애플 생태계 (MacBook, iPad, AirPods 연동 우수)",
    "안드로이드 생태계 (다양한 기기 호환)"
)

# 장단점 설정
template.set_pros_cons(
    item_a_pros=[
        "iOS의 안정성과 최적화",
        "애플 생태계 완벽 연동",
        "오래가는 소프트웨어 지원 (5년 이상)",
        "우수한 영상 촬영 성능",
        "높은 리세일 가치",
        "프리미엄 빌드 퀄리티"
    ],
    item_a_cons=[
        "상대적으로 작은 배터리",
        "USB-C 전송 속도 제한 (Pro 모델 제외)",
        "커스터마이징 제한적",
        "S펜 같은 스타일러스 미지원"
    ],
    item_b_pros=[
        "큰 화면과 S펜 지원으로 생산성 우수",
        "압도적인 카메라 성능 (200MP, 100배 줌)",
        "대용량 배터리",
        "높은 커스터마이징 자유도",
        "최신 AI 기능 탑재",
        "더 밝은 디스플레이"
    ],
    item_b_cons=[
        "큰 크기와 무게 (232g)",
        "높은 가격",
        "One UI가 iOS보다 복잡할 수 있음",
        "iOS 앱보다 최적화가 덜 될 수 있음"
    ]
)

# 상황별 추천
template.set_recommendation({
    "애플 생태계를 사용 중이라면": "아이폰 15 Pro - MacBook, iPad, AirPods와의 연동이 압도적",
    "큰 화면과 필기가 필요하다면": "갤럭시 S24 Ultra - S펜과 큰 디스플레이 활용",
    "사진/영상 촬영이 중요하다면": "둘 다 우수하지만 갤럭시는 줌, 아이폰은 영상에 강점",
    "배터리 수명이 중요하다면": "갤럭시 S24 Ultra - 5,000mAh 대용량 배터리",
    "오래 쓸 계획이라면": "아이폰 15 Pro - 긴 소프트웨어 지원과 높은 리세일",
    "커스터마이징을 즐긴다면": "갤럭시 S24 Ultra - 안드로이드의 자유도",
    "간편하고 직관적인 사용을 원한다면": "아이폰 15 Pro - iOS의 단순함과 직관성"
})

# 블로그 생성
blog_content = template.build()

# 파일로 저장
output_file = "generated_iphone_vs_galaxy.md"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(blog_content)

print(f"✅ 아이폰 vs 갤럭시 비교 글이 생성되었습니다: {output_file}")
print("\n미리보기:")
print("="*50)
print(blog_content[:500])
print("...")
