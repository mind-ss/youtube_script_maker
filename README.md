# 네이버 블로그 작성 도구 📝

네이버 검색 최적화(SEO)와 한국 독자의 읽기 습관을 고려한 **고품질 블로그 글 생성 도구**입니다.

## 주요 특징 ✨

- 🎯 **네이버 SEO 최적화**: 검색 상위 노출을 위한 최적화된 구조
- 📱 **모바일 친화적**: 2-3문장 단위 줄바꿈으로 가독성 극대화
- 🎨 **4가지 템플릿**: 제품 리뷰, 방법/노하우, 장소 추천, 비교 분석
- 📊 **SEO 분석**: 키워드 밀도, 글 길이, 구조 자동 분석
- 🚀 **CLI 지원**: 명령줄에서 빠른 생성
- 🐍 **Python API**: 프로그래밍 방식으로 커스터마이징 가능

## 프로젝트 구조 📁

```
youtube_script_maker/
├── src/
│   ├── naver_blog_writer.py   # 메인 블로그 작성 엔진
│   ├── templates.py            # 4가지 템플릿 클래스
│   └── cli.py                  # 명령줄 인터페이스
├── examples/
│   ├── example_review.py       # 제품 리뷰 예시
│   ├── example_howto.py        # 방법/노하우 예시
│   ├── example_place.py        # 장소 추천 예시
│   └── example_comparison.py   # 비교 분석 예시
├── prompts/
│   └── naver_blog_writing.md   # 블로그 작성 가이드라인
├── requirements.txt
└── README.md
```

## 설치 방법 🔧

### 1. 저장소 클론

```bash
git clone https://github.com/mind-ss/youtube_script_maker.git
cd youtube_script_maker
```

### 2. Python 환경 설정

Python 3.8 이상이 필요합니다.

```bash
# 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치 (선택사항)
pip install -r requirements.txt
```

**참고**: 이 도구는 Python 표준 라이브러리만 사용하므로 별도 패키지 설치 없이도 작동합니다.

## 사용 방법 🚀

### CLI 사용

#### 1. 간단한 블로그 생성

```bash
cd src
python cli.py simple \
  --topic "홈트레이닝 방법" \
  --keywords "홈트,운동,다이어트" \
  --output ../output/blog.md \
  --analyze
```

#### 2. 제품 리뷰 생성

```bash
python cli.py review \
  --product "에어팟 프로 2세대" \
  --keywords "에어팟,이어폰,리뷰,노이즈캔슬링" \
  --price "359,000원" \
  --rating 4.5 \
  --pros "노이즈캔슬링,애플연동,착용감" \
  --cons "가격,안드로이드제한" \
  --output ../output/airpods_review.md
```

#### 3. 방법/노하우 생성

```bash
python cli.py howto \
  --topic "블로그 시작하기" \
  --keywords "블로그,시작,방법,네이버" \
  --materials "컴퓨터,네이버 계정,글쓰기 열정" \
  --steps 5 \
  --output ../output/blog_guide.md
```

#### 4. 장소 추천 생성

```bash
python cli.py place \
  --location "부산" \
  --keywords "부산여행,부산맛집,가볼만한곳" \
  --count 7 \
  --output ../output/busan_places.md
```

#### 5. 비교 분석 생성

```bash
python cli.py compare \
  --items "아이폰 vs 갤럭시" \
  --keywords "스마트폰,비교,추천" \
  --output ../output/phone_comparison.md
```

### Python API 사용

#### 제품 리뷰 예시

```python
from templates import create_review_template

# 템플릿 생성
template = create_review_template(
    product_name="에어팟 프로 2세대",
    keywords=["에어팟프로", "무선이어폰", "노이즈캔슬링"]
)

# 제품 정보 설정
template.set_product_info(
    specs={"브랜드": "Apple", "모델": "AirPods Pro 2"},
    price="359,000원",
    rating=4.5
)

# 장단점 설정
template.set_review(
    pros=["탁월한 노이즈 캔슬링", "애플 생태계 연동"],
    cons=["높은 가격", "안드로이드 제한"]
)

# 블로그 생성
blog_content = template.build()

# 파일로 저장
with open("review.md", "w", encoding="utf-8") as f:
    f.write(blog_content)
```

#### 방법/노하우 예시

```python
from templates import create_howto_template

# 템플릿 생성
template = create_howto_template(
    topic="홈카페 인테리어",
    keywords=["홈카페", "인테리어", "카페"],
    difficulty="초급",
    time_required="1시간"
)

# 준비물 설정
template.set_materials(["테이블", "의자", "조명", "소품"])

# 단계별 추가
template.add_step(
    title="공간 선정",
    description="홈카페를 꾸밀 공간을 선택합니다...",
    tips="창가 쪽이 좋아요!"
)

# 블로그 생성
blog_content = template.build()
```

#### 장소 추천 예시

```python
from templates import create_place_template

# 템플릿 생성
template = create_place_template(
    location="부산",
    keywords=["부산여행", "부산맛집"],
    recommendation_count=5
)

# 장소 추가
template.add_place(
    name="해운대 해수욕장",
    address="부산 해운대구 우동",
    description="부산 대표 해수욕장...",
    rating=4.7,
    highlights=["백사장", "일출명소", "주변맛집"],
    opening_hours="24시간",
    parking="유료 주차장"
)

# 블로그 생성
blog_content = template.build()
```

#### 비교 분석 예시

```python
from templates import create_comparison_template

# 템플릿 생성
template = create_comparison_template(
    item_a="아이폰 15 Pro",
    item_b="갤럭시 S24 Ultra",
    keywords=["스마트폰", "비교", "아이폰", "갤럭시"]
)

# 공통점 설정
template.set_similarities(["플래그십 모델", "고성능 프로세서"])

# 차이점 추가
template.add_difference("OS", "iOS", "Android")
template.add_difference("가격", "155만원", "160만원")

# 장단점 설정
template.set_pros_cons(
    item_a_pros=["iOS 안정성", "생태계"],
    item_a_cons=["작은 배터리"],
    item_b_pros=["큰 화면", "S펜"],
    item_b_cons=["무거움"]
)

# 상황별 추천
template.set_recommendation({
    "애플 생태계 사용자": "아이폰 15 Pro",
    "필기가 필요하다면": "갤럭시 S24 Ultra"
})

# 블로그 생성
blog_content = template.build()
```

### 커스텀 블로그 작성

```python
from naver_blog_writer import create_blog_writer

# 블로그 작성기 생성
writer = create_blog_writer(
    topic="나만의 주제",
    keywords=["키워드1", "키워드2", "키워드3"],
    content_type="howto",
    target_audience="초보자"
)

# 섹션 추가
writer.add_section(
    heading="첫 번째 섹션",
    content="여기에 내용을 작성합니다...",
    level=2
)

writer.add_section(
    heading="두 번째 섹션",
    content="추가 내용...",
    level=2
)

# 블로그 생성
blog = writer.build(
    title="최종 제목",
    intro="서론 내용...",
    conclusion="결론 내용..."
)

print(blog)
```

## 예시 실행 🎬

예시 스크립트를 직접 실행해보세요:

```bash
cd examples

# 에어팟 프로 리뷰 생성
python example_review.py

# 홈카페 인테리어 가이드 생성
python example_howto.py

# 부산 여행지 추천 생성
python example_place.py

# 아이폰 vs 갤럭시 비교 생성
python example_comparison.py
```

각 스크립트는 완성된 블로그 글을 `.md` 파일로 저장합니다.

## SEO 분석 기능 📊

```python
from naver_blog_writer import SEOOptimizer

# 키워드 밀도 확인
density = SEOOptimizer.check_keyword_density(
    text="블로그 글 전체 내용...",
    keyword="키워드"
)
print(f"키워드 밀도: {density}%")  # 이상적: 1-3%

# SEO 개선 제안
suggestions = SEOOptimizer.suggest_improvements(
    text="블로그 글 전체 내용...",
    keywords=["키워드1", "키워드2"]
)
for suggestion in suggestions:
    print(suggestion)
```

## 네이버 블로그 작성 가이드라인 📖

상세한 블로그 작성 가이드라인은 `prompts/naver_blog_writing.md`를 참고하세요.

주요 내용:
- ✅ 제목 최적화 (키워드, 숫자, 감정)
- ✅ 서론/본론/결론 구조
- ✅ 이미지 및 미디어 활용
- ✅ SEO 최적화 전략
- ✅ 독자 참여 유도
- ✅ 피해야 할 사항

## 생성된 블로그 글 특징 🎨

### 1. 최적화된 제목
- 키워드 앞부분 배치
- 숫자 활용 (BEST 7, 5가지 등)
- 25-35자 길이

### 2. 구조화된 본문
- 2-3문장 단위 줄바꿈
- 소제목으로 위계 구조
- 강조 표현 (굵게, 리스트)

### 3. SEO 요소
- 키워드 자연스럽게 3-5회 반복
- 5-10개의 관련 태그
- 메타 설명 자동 생성

### 4. 독자 참여
- 공감 요청
- 댓글 유도
- 이웃 추가 권유

## 커스터마이징 🎨

### 블로그 설정 변경

```python
from naver_blog_writer import BlogConfig, NaverBlogWriter

config = BlogConfig(
    title="나만의 블로그",
    keywords=["키워드1", "키워드2"],
    target_audience="20-30대 직장인",
    content_type="review",
    min_length=2000,
    max_length=5000,
    image_count=7,
    emoji_level="moderate",  # none, light, moderate, heavy
    tone="friendly"  # formal, friendly, casual
)

writer = NaverBlogWriter(config)
```

### 템플릿 확장

새로운 템플릿 타입을 만들 수 있습니다:

```python
from templates import BlogTemplate

class MyCustomTemplate(BlogTemplate):
    def generate_intro(self) -> str:
        return "커스텀 서론..."

    def add_main_content(self):
        self.writer.add_section("섹션1", "내용...")

    def generate_conclusion(self) -> str:
        return "커스텀 결론..."
```

## 통계 정보 확인 📈

```python
stats = writer.get_stats()
print(f"총 글자 수: {stats['total_characters']}자")
print(f"섹션 수: {stats['total_sections']}개")
print(f"예상 읽기 시간: {stats['estimated_reading_time']}분")
```

## 팁 💡

1. **키워드 선정**: 네이버 검색 트렌드에서 인기 키워드 확인
2. **제목 작성**: 숫자와 구체성을 담아 클릭률 향상
3. **이미지**: 최소 5개 이상, 고해상도 이미지 사용
4. **글 길이**: 2,000-3,000자가 적정 (전문 정보는 5,000자 이상)
5. **발행 시간**: 평일 오전 7-9시, 점심 12-1시, 저녁 6-8시

## 문제 해결 🔧

### ImportError 발생 시

```bash
# src 디렉토리를 Python 경로에 추가
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"

# 또는 스크립트에서
import sys
sys.path.append('src')
```

### 한글 인코딩 문제

파일 저장 시 반드시 `encoding='utf-8'` 지정:

```python
with open("blog.md", "w", encoding="utf-8") as f:
    f.write(blog_content)
```

## 라이선스 📄

MIT License

## 기여 🤝

Pull Request와 Issue는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처 📧

프로젝트 링크: [https://github.com/mind-ss/youtube_script_maker](https://github.com/mind-ss/youtube_script_maker)

---

**Happy Blogging! 📝✨**
