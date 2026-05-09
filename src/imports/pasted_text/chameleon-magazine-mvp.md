CHAMELEON MAGAZINE이라는 음악 중심 문화 콘텐츠 매거진 웹사이트 MVP를 제작해줘.

목표:
음악 뉴스, 뮤직비디오, 라이브 영상, 패션, 음향기기, 트렌드 리포트, 아티스트 집중 콘텐츠를 다루는 독립 웹 매거진이다. 인스타그램에서 운영하던 카테고리 컬러 체계를 웹사이트에 반영하되, 웹에서는 카테고리를 더 간결하게 재구성하고 싶다.

전체 디자인 방향:
- Rolling Stone 홈페이지처럼 클래식한 에디토리얼 매거진/신문형 랜딩 구조를 참고한다.
- 단, 그대로 복제하지 말고 CHAMELEON MAGAZINE만의 현대적인 음악 웹진 느낌으로 재해석한다.
- 기본 색상은 #ffffff와 #000000 중심.
- 텍스트, 헤드라인, 선, 메뉴는 기본적으로 검은색/흰색을 사용한다.
- 카테고리 컬러는 전체 배경을 칠하는 용도가 아니라, 카테고리 라벨, 얇은 상단 라인, hover accent, 태그, 기사 상세 상단 포인트 등에만 제한적으로 사용한다.
- 여러 고채도 색상이 한 화면에서 과하게 충돌하지 않게 한다.
- 분위기는 “흑백 신문형 음악 매거진 위에 컬러 카테고리 신호가 얹힌 느낌”이다.

브랜드:
- 사이트명: CHAMELEON MAGAZINE
- 로고/타이틀은 첫 화면에서 매우 크게 보여야 한다.
- 첫 화면에서 매체명과 매거진 정체성이 바로 느껴져야 한다.
- 음악 중심 문화 매거진이며, 장르보다 장면, 사운드, 아티스트, 비주얼, 문화적 맥락을 다룬다.

폰트:
- Kakao Font 사용.
- 제목/헤드라인: Kakao-Big-Sans
- 본문/UI: Kakao-Small-Sans
- 폰트 소스: https://github.com/kakao/kakao-font
- 웹폰트 적용이 어려운 경우 로컬 assets/fonts 폴더에 폰트 파일을 두고 @font-face로 불러오는 구조를 준비한다.
- fallback은 system-ui, sans-serif로 둔다.
- 헤드라인은 굵고 압축감 있게, 본문은 읽기 좋게 설계한다.

정보 구조:
상단 메인 메뉴는 간결하게 유지한다.

Primary Navigation:
- Editor’s Pick
- News
- Listen
- Visual
- Culture

Hamburger Menu 구조:
- Editor’s Pick

- News
  - Music News
  - Weekly News

- Listen
  - Reviews
  - Playlists

- Visual
  - Music Videos
  - Live

- Culture
  - Fashion
  - Product
  - Trend Report
  - Artist Focus

분류 원칙:
- 신곡/신보/컴백/MV 공개/투어/콜라보/차트/수상 등 빠르게 전하는 음악 소식은 모두 News > Music News에 포함한다.
- New Release는 별도 탭으로 만들지 않는다.
- Weekly News는 매주 주목할 만한 음악 소식을 정리하는 고정 시리즈로 News 안에 둔다.
- MV 공개 “소식”은 Music News에 들어갈 수 있다.
- MV의 연출, 비주얼, 영상미, 미학을 다루는 글은 Visual > Music Videos로 둔다.
- 라이브 영상 소개는 Visual > Live로 둔다.
- 리뷰/플레이리스트처럼 듣는 행위 중심 콘텐츠는 Listen에 둔다.
- 패션, 음향기기, 트렌드 분석, 아티스트 집중 콘텐츠는 Culture에 둔다.
- Editor’s Pick은 카테고리가 아니라 운영자가 선택한 추천/대표 기사 큐레이션 영역이다.

기존 인스타그램 카테고리 컬러 체계:
- NEWS / Music News: #c00707
- MV / Music Videos: #ffda13
- LIVE / Live: #b0fffa
- FASHION / Fashion: #ff66c4
- PRODUCT / Product: #004aad
- TREND REPORT / Trend Report: #cb6ce6
- WEEKLY NEWS / Weekly News: #00bf63
- ARTIST / Artist Focus: #ff751f
- 기본: #ffffff, #000000

웹사이트에서의 컬러 사용:
- Primary category color:
  - News: #c00707
  - Listen: #ffda13
  - Visual: #b0fffa
  - Culture: #cb6ce6
  - Editor’s Pick: black/white inverse

- Secondary tag color:
  - Weekly News: #00bf63
  - Music Videos / MV: #ffda13
  - Live: #b0fffa
  - Fashion: #ff66c4
  - Product: #004aad
  - Trend Report: #cb6ce6
  - Artist Focus: #ff751f

메인 랜딩 레이아웃:
Rolling Stone식 에디토리얼 그리드를 참고한다.

Desktop 첫 화면:
- 상단 중앙에 CHAMELEON MAGAZINE 로고/타이틀 크게 배치
- 좌측 상단 또는 내비게이션 영역에 햄버거 메뉴
- 상단 메뉴에는 Editor’s Pick, News, Listen, Visual, Culture
- 우측에 검색 아이콘
- 메인 콘텐츠 영역은 3-column editorial grid:
  - 왼쪽: Latest News / Music News 짧은 기사 리스트
  - 중앙: Editor’s Pick 대표 기사 카드. 가장 큰 이미지와 가장 큰 헤드라인
  - 오른쪽: Visual 또는 Culture 중심의 추천 콘텐츠 2개 정도
- 카드에는 카테고리 컬러 라벨을 작게 사용
- 헤드라인은 검정색, 배경은 흰색
- 구분선은 검정색 또는 얇은 회색
- 너무 둥근 카드 UI는 피하고, 매거진/신문 같은 직선적 구조를 사용한다.

Mobile:
- 로고/타이틀
- 햄버거 메뉴와 검색
- Editor’s Pick 대표 기사
- Latest News 리스트
- 카테고리 필터 또는 주요 섹션 카드
- 세로 스크롤 피드
- 텍스트가 버튼/카드 밖으로 넘치지 않도록 한다.
- 모바일에서도 첫 화면에서 CHAMELEON MAGAZINE 정체성이 강하게 보여야 한다.

주요 페이지/섹션:
1. Home
   - Editor’s Pick
   - Latest News
   - Visual Picks
   - Culture Picks
   - Latest Articles

2. Category page
   - News / Listen / Visual / Culture 각각의 목록 페이지
   - 소분류 필터 제공

3. Article detail page
   - 카테고리 라벨
   - 제목
   - 부제/요약
   - 작성일
   - 커버 이미지
   - 본문
   - 본문 이미지
   - 유튜브 영상 embed
   - 관련 글

4. Editor page 또는 Admin-like editor MVP
   - 글쓰기 에디터 구현
   - 제목 입력
   - 카테고리 선택
   - 소분류/태그 선택
   - Editor’s Pick 여부 선택
   - 요약 입력
   - 본문 입력
   - 이미지 삽입
   - 유튜브 링크 삽입
   - 작성한 글 미리보기
   - MVP 단계에서는 localStorage 저장 가능
   - 이후 GitHub Pages + Decap CMS 또는 Markdown 저장 구조로 확장 가능하게 설계

글쓰기 에디터 요구사항:
- 블로그처럼 쉽게 글을 쓸 수 있어야 한다.
- 본문에 이미지를 넣을 수 있어야 한다.
- 가능하면 이미지 파일 업로드뿐 아니라 클립보드 이미지 붙여넣기도 지원한다.
- 본문에 유튜브 링크를 넣으면 기사 페이지에서 작은/반응형 유튜브 플레이어로 자동 변환되게 한다.
- 예:
  https://www.youtube.com/watch?v=xxxxx
  또는
  https://youtu.be/xxxxx
  를 넣으면 16:9 iframe embed로 렌더링한다.
- 에디터는 MVP에서는 로그인 없이 구현해도 되지만, 나중에 CMS로 전환하기 쉽게 데이터 구조를 분리한다.

데이터 모델:
Article:
- id
- title
- slug
- excerpt
- category: Editor’s Pick / News / Listen / Visual / Culture 중 하나 또는 primary category
- subcategory:
  - Music News
  - Weekly News
  - Reviews
  - Playlists
  - Music Videos
  - Live
  - Fashion
  - Product
  - Trend Report
  - Artist Focus
- tags: string[]
- isEditorsPick: boolean
- date
- author
- coverImage
- body
- youtubeEmbeds optional
- relatedArticles optional

기술 스택:
MVP는 무료 호스팅과 유지비 0원을 고려한다.

권장 옵션 1:
- HTML / CSS / Vanilla JavaScript
- GitHub Pages 배포 가능
- 빌드 과정 없음
- localStorage 기반 에디터 MVP
- 가장 단순하고 무료

권장 옵션 2:
- Astro
- Markdown/MDX 기반 콘텐츠
- GitHub Pages 또는 Cloudflare Pages 무료 배포
- 추후 Decap CMS 연결 가능
- 매거진/블로그 구조에 적합

권장 옵션 3:
- Next.js
- Vercel 무료 배포
- CMS 확장성 좋음
- 다만 GitHub Pages 정적 배포보다 구조가 조금 복잡할 수 있음

이번 MVP에서는 가능하면 옵션 1 또는 옵션 2를 우선한다.
운영비가 들지 않는 구조가 중요하다.

호스팅 방향:
- 최종 도메인은 magazine.chameleonstudio.xyz 사용 예정
- GitHub Pages, Cloudflare Pages, Netlify, Vercel 중 무료 호스팅 가능
- 도메인은 Squarespace에서 보유 중
- DNS에서 magazine CNAME을 연결하는 구조를 전제로 한다.
- www.chameleonstudio.xyz/magazine 경로보다 magazine.chameleonstudio.xyz 서브도메인 구조를 우선한다.

디자인 디테일:
- 카드 radius는 0~8px 이내로 작게 유지
- 신문/매거진 느낌의 선, 그리드, 섹션 구분 사용
- 과한 gradient, orb, bokeh 장식은 사용하지 않는다.
- 색상은 카테고리 신호로만 절제해서 사용한다.
- 헤드라인은 매우 강하게, 본문은 읽기 쉽게
- 기사 목록은 스캔하기 쉬워야 한다.
- 검색, 햄버거 메뉴, 카테고리 필터는 직관적으로 구성
- 아이콘은 가능하면 lucide icons 사용
- 접근성 고려:
  - 충분한 contrast
  - 버튼/링크 focus state
  - 이미지 alt
  - 키보드 접근 가능

반응형 요구사항:
- Desktop: 3-column editorial grid
- Tablet: 2-column grid
- Mobile: 1-column feed
- 모든 텍스트는 컨테이너 밖으로 넘치지 않아야 한다.
- 헤더는 모바일에서 로고와 메뉴가 안정적으로 배치되어야 한다.
- 유튜브 iframe은 16:9 비율로 반응형 처리한다.
- 이미지도 폭에 맞게 반응형 처리한다.

최종 결과물:
- CHAMELEON MAGAZINE MVP 웹사이트
- 반응형 홈 화면
- 햄버거 메뉴
- 카테고리/소분류 구조
- Editor’s Pick 영역
- 기사 카드/리스트
- 기사 상세 보기
- 글쓰기 에디터 MVP
- 이미지 삽입 및 붙여넣기 지원
- 유튜브 링크 자동 embed
- 흰색/검은색 기반 + 카테고리 컬러 악센트
- Kakao Big Sans / Kakao Small Sans 적용
- GitHub Pages 등 무료 정적 호스팅에 올릴 수 있는 구조
