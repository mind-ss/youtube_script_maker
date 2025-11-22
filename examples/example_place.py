"""
장소 추천 블로그 예시

부산 여행 가볼만한곳을 소개하는 예시입니다.
"""

import sys
sys.path.append('../src')

from templates import PlaceRecommendationTemplate

# 장소 추천 템플릿 생성
template = PlaceRecommendationTemplate(
    location="부산",
    keywords=["부산여행", "부산가볼만한곳", "부산맛집", "부산핫플", "부산명소"],
    recommendation_count=7
)

# 장소 1: 해운대
template.add_place(
    name="해운대 해수욕장",
    address="부산 해운대구 우동",
    description="""
부산 하면 가장 먼저 떠오르는 곳이죠!
넓은 백사장과 아름다운 바다를 자랑하는 대표 해수욕장입니다.

여름에는 해수욕을, 다른 계절에는 산책로를 따라 걷기 좋아요.
주변에 카페와 맛집이 많아서 하루 종일 있어도 지루하지 않습니다.
""",
    rating=4.7,
    highlights=["백사장", "일출명소", "주변맛집다양"],
    opening_hours="24시간 개방",
    parking="주변 유료 주차장 이용"
)

# 장소 2: 감천문화마을
template.add_place(
    name="감천문화마을",
    address="부산 사하구 감내2로 203",
    description="""
한국의 산토리니라 불리는 알록달록한 마을!
계단식 주거지에 예술 작품들이 어우러져 독특한 분위기를 자랑합니다.

포토존이 정말 많아서 인생샷 건지기 좋고,
골목골목 구경하는 재미가 쏠쏠합니다.
""",
    rating=4.6,
    highlights=["포토존", "예술작품", "언덕마을"],
    opening_hours="09:00 - 18:00",
    parking="입구 공영주차장 이용 (유료)"
)

# 장소 3: 광안리
template.add_place(
    name="광안리 해변",
    address="부산 수영구 광안해변로",
    description="""
광안대교와 함께 보는 야경이 환상적인 곳!
낮에는 해변을 즐기고, 밤에는 광안대교의 아름다운 조명을 감상할 수 있습니다.

주변에 회센터와 카페거리가 발달해 있어서
맛있는 음식과 함께 여유로운 시간을 보낼 수 있어요.
""",
    rating=4.8,
    highlights=["야경명소", "광안대교", "회센터"],
    opening_hours="24시간 개방",
    parking="주변 공영주차장 및 유료주차장"
)

# 장소 4: 자갈치시장
template.add_place(
    name="자갈치시장",
    address="부산 중구 자갈치해안로 52",
    description="""
한국 최대 수산시장이자 부산의 상징!
싱싱한 해산물을 직접 보고 구매할 수 있고,
즉석에서 회를 떠서 먹을 수도 있습니다.

시장 특유의 활기찬 분위기와
부산 아지매들의 호탕한 인심이 느껴지는 곳입니다.
""",
    rating=4.5,
    highlights=["수산시장", "회센터", "부산대표명소"],
    opening_hours="05:00 - 22:00 (점포별 상이)",
    parking="자갈치시장 공영주차장"
)

# 장소 5: 태종대
template.add_place(
    name="태종대",
    address="부산 영도구 전망로 24",
    description="""
부산의 절경을 감상할 수 있는 최고의 명소!
울창한 숲과 기암절벽, 푸른 바다가 어우러진 자연경관이 압권입니다.

전망대에서 보는 일출과 일몰이 정말 아름답고,
다누비 열차를 타고 둘러보는 것도 좋은 경험이에요.
""",
    rating=4.7,
    highlights=["자연경관", "전망대", "다누비열차"],
    opening_hours="04:00 - 24:00",
    parking="태종대 주차장 (무료)"
)

# 장소 6: 송도 해상케이블카
template.add_place(
    name="송도 해상케이블카",
    address="부산 서구 송도해변로 171",
    description="""
바다 위를 가로지르는 스릴 넘치는 케이블카!
송도해수욕장에서 암남공원까지 연결되어 있어
공중에서 바라보는 부산 앞바다 전경이 환상적입니다.

투명 바닥 크리스탈 캐빈은 특히 인기가 많으니
미리 예약하는 것을 추천드려요.
""",
    rating=4.6,
    highlights=["해상케이블카", "바다전망", "크리스탈캐빈"],
    opening_hours="09:00 - 21:00 (날씨에 따라 변동)",
    parking="송도해수욕장 주차장"
)

# 장소 7: 흰여울문화마을
template.add_place(
    name="흰여울문화마을",
    address="부산 영도구 흰여울길 일대",
    description="""
영화 '변호인' 촬영지로 유명한 아름다운 마을!
바다를 바라보는 언덕에 자리한 작은 마을로,
파스텔톤의 벽화와 예쁜 카페들이 가득합니다.

천천히 산책하면서 사진 찍기 좋고,
카페에 앉아 바다를 바라보는 여유도 즐길 수 있어요.
""",
    rating=4.7,
    highlights=["영화촬영지", "바다뷰카페", "벽화마을"],
    opening_hours="상시 개방 (카페별 영업시간 상이)",
    parking="마을 입구 소규모 주차장 (협소)"
)

# 블로그 생성
blog_content = template.build()

# 파일로 저장
output_file = "generated_busan_places.md"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(blog_content)

print(f"✅ 부산 가볼만한곳 추천 글이 생성되었습니다: {output_file}")
print("\n미리보기:")
print("="*50)
print(blog_content[:500])
print("...")
