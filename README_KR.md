# YouTube Script Writer

AI 기반 유튜브 영상 스크립트 작성 및 관리 도구

## 주요 기능

### 1. AI 스크립트 자동 생성
- Claude AI를 활용한 고품질 스크립트 생성
- 5가지 콘텐츠 타입 지원 (튜토리얼, 리뷰, 브이로그, 뉴스, 엔터테인먼트)
- 타겟 시청자 및 톤앤매너 맞춤 설정
- 핵심 포인트 및 맞춤 CTA 설정 가능

### 2. 타임스탬프 자동 계산
- 텍스트 길이 기반 자동 시간 계산
- 한국어/영어 말하기 속도 자동 감지
- 섹션 전환 시간 자동 추가
- 실시간 타임스탬프 업데이트

### 3. 스크립트 편집
- TipTap 기반 리치 텍스트 에디터
- 드래그 앤 드롭으로 섹션 재정렬
- 섹션별 촬영 노트 및 영상 연출 가이드
- 글자 수 및 예상 시간 실시간 표시

### 4. 타임라인 시각화
- 섹션별 시간 분포 시각화
- 목표 시간 대비 실제 시간 비교
- 촬영 완료 체크리스트

### 5. 다양한 내보내기 옵션
- **유튜브 챕터**: 설명란에 바로 붙여넣기
- **PDF**: 인쇄용 깔끔한 레이아웃
- **텍스트 파일**: 프롬프터 앱 호환
- **마크다운**: 문서 편집용
- **JSON**: 데이터 백업용

### 6. 텔레프롬프터 모드
- 풀스크린 프롬프터
- 자동/수동 스크롤
- 글씨 크기 및 속도 조절
- 키보드 단축키 지원

### 7. 자동 저장 및 버전 관리
- 30초마다 자동 저장
- 여러 스크립트 관리
- 통계 대시보드

### 8. 다크 모드
- 야간 작업에 편안한 다크 테마
- 원클릭 테마 전환

## 기술 스택

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS
- **Editor**: TipTap
- **State**: Zustand
- **AI**: Claude API (Anthropic)
- **Icons**: Lucide React
- **DnD**: @hello-pangea/dnd
- **Export**: jsPDF

## 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 Anthropic API 키를 입력하세요:

```bash
cp .env.example .env
```

`.env` 파일:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_APP_NAME=YouTube Script Writer
VITE_AUTO_SAVE_INTERVAL=30000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 으로 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 사용 방법

### 스크립트 생성

1. 메인 화면에서 "새 스크립트 생성" 버튼 클릭
2. 주제, 콘텐츠 타입, 목표 길이 등 입력
3. "스크립트 생성하기" 버튼 클릭
4. AI가 자동으로 구조화된 스크립트 생성

### 스크립트 편집

1. 생성된 스크립트의 각 섹션 클릭하여 편집
2. 드래그 앤 드롭으로 섹션 순서 변경
3. 타임스탬프가 자동으로 재계산됨
4. 자동 저장 기능으로 작업 내용 보호

### 유튜브 업로드 준비

1. 우측 "내보내기" 패널에서 "유튜브 챕터" 클릭
2. 클립보드에 자동 복사됨
3. 유튜브 업로드 시 설명란에 붙여넣기

### 텔레프롬프터 사용

1. 상단 "텔레프롬프터" 버튼 클릭
2. 풀스크린 모드로 전환
3. Space: 재생/정지
4. ↑↓: 속도 조절
5. Esc: 종료

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ScriptGenerator/ # 스크립트 생성 폼
│   ├── ScriptEditor/    # 에디터 및 섹션 카드
│   ├── Timeline/        # 타임라인 시각화
│   ├── Export/          # 내보내기 메뉴
│   ├── Teleprompter/    # 텔레프롬프터
│   └── Sidebar/         # 사이드바
├── services/            # API 및 서비스
│   ├── claudeAPI.ts     # Claude API 통합
│   └── storageService.ts # LocalStorage 관리
├── templates/           # 콘텐츠 타입별 템플릿
├── utils/               # 유틸리티 함수
│   ├── textAnalyzer.ts  # 시간 계산
│   └── formatters.ts    # 포맷 변환
├── types/               # TypeScript 타입
├── hooks/               # Custom React Hooks
├── store/               # Zustand 상태 관리
└── App.tsx              # 메인 앱
```

## 라이선스

MIT

## 기여

이슈와 풀 리퀘스트를 환영합니다!

## 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
