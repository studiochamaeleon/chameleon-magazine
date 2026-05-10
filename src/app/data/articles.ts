import type { Category, Subcategory } from './categories';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: Category;
  subcategory: Subcategory | null;
  tags: string[];
  isEditorsPick: boolean;
  isHomepageHero?: boolean;
  date: string;
  author: string;
  coverType?: 'image' | 'youtube' | 'instagram' | 'embed';
  coverImage: string;
  coverImageCaption?: string;
  coverImageCredit?: string;
  coverYouTubeUrl?: string;
  coverYouTubeCaption?: string;
  coverEmbedUrl?: string;
  coverEmbedTitle?: string;
  coverEmbedCaption?: string;
  coverEmbedHeight?: number;
  body: string;
  bodyBlocks?: unknown[];
  relatedArticles?: string[];
  status?: 'published' | 'draft' | 'scheduled';
  scheduledAt?: string; // ISO datetime string (예약발행 시각)
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: '2026년을 뒤흔들 컴백들 — 상반기 최고의 귀환들',
    slug: '2026-comebacks-first-half',
    excerpt: '압도적인 사운드와 퍼포먼스로 무장한 아티스트들이 돌아왔다. 올 상반기를 정의한 컴백 현장들을 집중 조명한다.',
    category: 'news',
    subcategory: 'music-news',
    tags: ['컴백', '2026', '케이팝', '신보'],
    isEditorsPick: true,
    date: '2026-05-07',
    author: 'CHAMELEON Editorial',
    coverImage: 'https://images.unsplash.com/photo-1635961726947-0f821cf9ba28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0cyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3ODIzNTkxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>2026년 상반기, 음악 씬은 그 어느 때보다 뜨겁게 달아올랐다. 기다렸다는 듯 쏟아진 컴백들은 단순한 신보 발매를 넘어, 각자의 아티스트십을 한 단계 도약시키는 선언에 가까웠다.</p>

<p>가장 먼저 눈에 띄는 것은 사운드의 밀도다. 저마다의 방식으로 장르를 흡수하고 재구성한 아티스트들은, 팬들에게 단순히 "신곡"이 아니라 하나의 세계관을 제시했다. 무대 위에서는 압도적인 퍼포먼스가, 뮤직비디오에서는 치밀하게 설계된 시각적 내러티브가 펼쳐졌다.</p>

<p>이번 컴백 시즌의 또 다른 키워드는 '협업'이다. 장르를 가로지르는 크로스오버 콜라보, 국내외 프로듀서와의 공동 작업이 잇따르며, K-팝의 음악적 지평이 한층 넓어졌음을 실감케 했다.</p>

<p>그리고 무엇보다 — 관객들이 돌아왔다. 공연장에 다시 가득 찬 사람들, 음악과 함께 울고 웃는 현장. 2026년 상반기는, 음악이 여전히 살아있다는 가장 생생한 증거였다.</p>`,
    relatedArticles: ['art-004', 'art-005'],
  },
  {
    id: 'art-002',
    title: '시네마의 언어로 말하다 — 이달의 MV 비주얼 리포트',
    slug: 'mv-visual-report-may-2026',
    excerpt: '뮤직비디오는 이제 단순한 홍보 영상이 아니다. 한 편의 단편 영화처럼, 혹은 설치 미술처럼 — 이달의 주목할 뮤직비디오를 선별했다.',
    category: 'visual',
    subcategory: 'music-videos',
    tags: ['MV', '뮤직비디오', '비주얼', '시네마틱'],
    isEditorsPick: true,
    date: '2026-05-05',
    author: 'Visual Team',
    coverImage: 'https://images.unsplash.com/photo-1758390851225-63cbe6306f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHZpZGVvJTIwZmlsbWluZyUyMGNpbmVtYXRpYyUyMHNldHxlbnwxfHx8fDE3NzgyMzU5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>뮤직비디오의 문법이 달라지고 있다. 스토리보드에서 출발하던 작업 방식은 이제 개념 미술, 실험 영화, 패션 필름의 영역까지 뻗어있다. 이달, CHAMELEON은 그 경계를 가장 적극적으로 밀어붙인 작품들을 골랐다.</p>

<p>첫 번째로 주목한 것은 단 세 개의 조명과 한 명의 아티스트로 구성된 MV다. 최소주의적 미장센 속에서 감정의 밀도는 오히려 극대화된다. 카메라는 움직이지 않고, 시간만이 흐른다. 보는 것만으로도 숨이 멎는 느낌.</p>

<p>반면 두 번째 작품은 그 반대다. 색채가 폭발하고, 장면이 쉼없이 전환된다. CGI와 실사가 뒤섞인 이 세계는 분명히 현실이 아니지만, 그 안에서 아티스트의 감정은 너무나 실재한다. 기술이 감정을 압도하지 않는, 드문 균형의 사례.</p>

<p>세 번째는 이 시대의 불안을 가장 솔직하게 담은 MV다. 핸드헬드 카메라, 날것의 조도, 편집 없이 달리는 듯한 호흡. 마치 다큐멘터리처럼 다가오지만, 그 안에 치밀하게 계산된 서사가 있다.</p>

<p>이달의 MV들이 증명하는 것은 하나다 — 음악과 영상이 진정으로 만날 때, 그 결과는 어떤 장르의 틀로도 온전히 설명되지 않는다.</p>`,
    relatedArticles: ['art-007', 'art-011'],
  },
  {
    id: 'art-003',
    title: '앨범 리뷰: 이 앨범이 2026년의 레퍼런스가 될 이유',
    slug: 'album-review-2026-reference',
    excerpt: '소음과 정적 사이, 장르와 장르 사이 — 올해 가장 용기 있는 앨범이 도착했다. 듣는 순간, 기준이 바뀐다.',
    category: 'listen',
    subcategory: 'reviews',
    tags: ['앨범리뷰', '2026', '인디', '실험음악'],
    isEditorsPick: true,
    date: '2026-05-03',
    author: 'Music Critic',
    coverImage: 'https://images.unsplash.com/photo-1659536194219-e6e63b54f35a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMG11c2ljJTIwYWxidW0lMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3ODIzNTkxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p><strong>★★★★★</strong></p>

<p>이 앨범을 처음 들었을 때, 재생을 멈추고 싶지 않았다. 두 번째 들었을 때는, 멈출 수가 없었다. 세 번째에 이르러서야 비로소 이 음악이 무엇인지 조금씩 보이기 시작했다.</p>

<p>장르를 물으면 대답하기 어렵다. 일렉트로닉의 구조 위에 재즈의 호흡이 얹히고, 포크의 감성이 어딘가에 스며있다. 그러나 이것을 "퓨전"이라고 부르는 순간, 이 앨범의 본질을 놓치게 된다. 이 음악은 장르를 섞은 게 아니라, 장르 너머의 어딘가에서 출발한다.</p>

<p>특히 3번 트랙은 올해를 통틀어 가장 강렬한 3분이다. 처음엔 아무 것도 없는 것처럼 시작해 — 숨 소리 하나, 피아노 건반 하나 — 5분이 지나면 당신은 어느 감정의 한복판에 서 있을 것이다. 어떻게 그게 가능한지, 설명하기 어렵다.</p>

<p>이 앨범은 올해 가장 중요한 음악적 사건이다. 당장 들으시라.</p>`,
    relatedArticles: ['art-006', 'art-012'],
  },
  {
    id: 'art-004',
    title: '이번 주 컴백 & 신보 총정리 — 놓치면 안 될 새 음악들',
    slug: 'new-releases-weekly-may-2026',
    excerpt: '이번 주도 쉬지 않는 음악계. 신보, 컴백, MV 공개까지 — 이 주의 릴리즈를 한눈에 정리했다.',
    category: 'news',
    subcategory: 'music-news',
    tags: ['신보', '컴백', '릴리즈', 'MV'],
    isEditorsPick: false,
    date: '2026-05-07',
    author: 'News Desk',
    coverImage: 'https://images.unsplash.com/photo-1582711012153-0ef6ef75d08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBhcnRpc3QlMjBrcG9wJTIwaWRvbCUyMHBlcmZvcm1hbmNlJTIwc3RhZ2UlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzgyMzU5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>이번 주 음악계는 그야말로 폭탄 투하 수준이다. 상반기 최대 기대작들이 동시다발로 공개되며, 스트리밍 차트가 실시간으로 요동치고 있다.</p>

<p><strong>■ 이번 주 주요 신보</strong></p>
<p>국내 인디 씬을 대표하는 밴드의 정규 4집이 드디어 나왔다. 3년의 공백 끝에 발표된 이 앨범은 전작과는 전혀 다른 방향성을 보여준다. 전자음이 대폭 줄어들고, 어쿠스틱 텍스처가 전면으로 나왔다. 많은 팬들의 예상을 벗어난, 그래서 더욱 흥미로운 선택.</p>

<p><strong>■ 컴백 하이라이트</strong></p>
<p>오랜 공백 끝에 돌아온 솔로 아티스트의 컴백은 이번 주 가장 큰 화제다. 뮤직비디오 공개 6시간 만에 조회수 500만을 돌파했으며, 동시간대 실검 1위를 기록했다. 음악적으로도 이전과는 확연히 다른 결의 사운드를 보여줬다는 평가다.</p>

<p><strong>■ MV 공개</strong></p>
<p>해외 유명 감독과 협업한 MV가 공개되며 비주얼 팀의 주목을 받고 있다. 영상미보다 서사에 집중한 이번 MV는, 노래를 듣는 경험과 영상을 보는 경험을 완전히 다른 층위에서 제공한다.</p>`,
    relatedArticles: ['art-001', 'art-005'],
  },
  {
    id: 'art-005',
    title: 'WEEKLY NEWS: 이번 주 음악계 핫 이슈 5가지',
    slug: 'weekly-news-may-week1-2026',
    excerpt: '투어 발표부터 콜라보 확정, 차트 역주행까지. 이번 주 놓치면 아쉬울 음악 소식을 다섯 가지로 정리했다.',
    category: 'news',
    subcategory: 'weekly-news',
    tags: ['위클리뉴스', '투어', '차트', '콜라보'],
    isEditorsPick: false,
    date: '2026-05-06',
    author: 'News Desk',
    coverImage: 'https://images.unsplash.com/photo-1760965824369-1a867927c1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2QlMjBhdG1vc3BoZXJlfGVufDF8fHx8MTc3ODIzNTkyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>매주 쏟아지는 음악 소식 속에서, 정말 중요한 것들만 골라 드립니다. 이번 주의 다섯 가지 핫 이슈입니다.</p>

<p><strong>1. 글로벌 투어 발표</strong><br/>국내 대형 아티스트가 올 하반기 북미·유럽 투어를 공식 발표했다. 총 23개 도시, 31개 공연 일정이 예정되어 있으며, 한국 공연도 서울·부산 양일 개최된다.</p>

<p><strong>2. 예상치 못한 콜라보 확정</strong><br/>장르 팬덤에서 "절대 없을 것"이라 여겼던 두 아티스트의 협업이 공식화됐다. 힙합과 트로트의 만남 — 이미 SNS는 뜨겁다.</p>

<p><strong>3. 5년 전 앨범의 역주행</strong><br/>특정 드라마 OST 삽입 이후, 5년 전 발매된 노래가 음원 차트 10위권에 재진입했다. 아티스트도, 팬들도 당황스럽다는 반응. 그래도 기분은 좋다고.</p>

<p><strong>4. 수상 소식</strong><br/>한 국내 인디 밴드가 프랑스 음악 비평가 협회 선정 '올해의 아시아 앨범'에 선정됐다. K-팝이 아닌 K-인디의 존재감을 세계에 알린 쾌거.</p>

<p><strong>5. 음악 페스티벌 라인업 공개</strong><br/>6월 개최 예정인 국내 최대 인디 뮤직 페스티벌의 라인업이 공개됐다. 국내외 아티스트 40팀 이상이 참가하는 이번 페스티벌, 티켓 오픈 5분 만에 매진됐다.</p>`,
    relatedArticles: ['art-004', 'art-001'],
  },
  {
    id: 'art-006',
    title: '새벽 감성 플레이리스트 — 지금 이 순간을 위한 20곡',
    slug: 'late-night-playlist-20-songs',
    excerpt: '밤이 깊어질수록 음악은 더 솔직해진다. 새벽 두 시, 이어폰을 꽂고 싶은 순간을 위한 20곡의 큐레이션.',
    category: 'listen',
    subcategory: 'playlists',
    tags: ['플레이리스트', '새벽', '감성', '큐레이션'],
    isEditorsPick: false,
    date: '2026-05-04',
    author: 'Listen Team',
    coverImage: 'https://images.unsplash.com/photo-1638805316457-791c0dffbd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHBsYXlsaXN0JTIwbGlzdGVuaW5nJTIwY3VsdHVyZSUyMG5pZ2h0fGVufDF8fHx8MTc3ODIzNTkyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>밤이 깊어지면 음악의 질감이 달라진다. 낮 동안 지나쳤던 음절들이 새롭게 들리고, 평소엔 무감각했던 코드 진행이 심장을 건드린다. 이 플레이리스트는 그런 새벽을 위해 만들었다.</p>

<p>선곡 기준은 단 하나였다 — "혼자 들어도 외롭지 않은 음악". 너무 시끄럽지 않으면서도 공허하지 않고, 혼자이지만 혼자가 아닌 느낌을 주는 곡들.</p>

<p><strong>01. 숨 — 수면 위의 목소리</strong><br/>시작은 여기서. 아무것도 없는 것 같은데, 모든 게 있다.</p>

<p><strong>02. 창문 밖 빗소리 — 어쿠스틱 소품</strong><br/>비가 오는 날 밤이라면 더욱 완벽할 곡.</p>

<p><strong>03. Midnight Run — 전자음 + 보컬</strong><br/>달리고 싶은 밤을 위한 음악. 달리지 않아도 달리는 기분이 든다.</p>

<p>...이하 20곡 전체 목록은 CHAMELEON MAGAZINE 공식 스포티파이 플레이리스트에서 확인 가능합니다.</p>`,
    relatedArticles: ['art-003', 'art-012'],
  },
  {
    id: 'art-007',
    title: '압도적인 현장 — 올해 가장 인상적인 라이브 5선',
    slug: 'best-live-performances-2026',
    excerpt: '무대 위, 그 몇 초의 순간이 모든 것을 바꾼다. 올해 목격된 가장 인상적인 라이브 퍼포먼스 다섯 장면.',
    category: 'visual',
    subcategory: 'live',
    tags: ['라이브', '공연', '퍼포먼스', '2026'],
    isEditorsPick: false,
    date: '2026-05-02',
    author: 'Visual Team',
    coverImage: 'https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMHJvY2slMjBwZXJmb3JtYW5jZSUyMHN0YWdlfGVufDF8fHx8MTc3ODIzNTkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>라이브 공연은 기록될 수 없다. 녹화 영상은 그 순간의 공기를 담지 못하고, 사진은 그 떨림을 잡아내지 못한다. 그럼에도 우리는 최대한 그 감각에 가깝게 다가가려 한다.</p>

<p><strong>1. 서울 올림픽 체조경기장 — 3월 22일</strong><br/>첫 음이 울리기도 전에 1만 명이 숨을 참았다. 침묵과 소음 사이의 그 순간을 만들어낸 것은 오직 음악과 조명이었다. 세트 중반, 전석이 불빛을 들었을 때 — 그것은 공연이 아니라 의식이었다.</p>

<p><strong>2. 부산 야외 공연장 — 4월 5일</strong><br/>바람이 강하게 불던 날, 보컬은 마이크를 잠시 내렸다. 그리고 그대로 불렀다. 4천 명의 관객이 따라 불렀고, 그 소리는 마이크 없이도 공연장 전체를 채웠다.</p>

<p><strong>3. 클럽 공연 — 서울 홍대 4월 15일</strong><br/>300명 앞에서의 공연이 이렇게 거대한 에너지를 만들 수 있다는 것. 밀착된 몸들, 공기 중에 스민 땀, 그 속에서 울려퍼지던 베이스라인.</p>`,
    relatedArticles: ['art-002', 'art-011'],
  },
  {
    id: 'art-008',
    title: '뮤지션이 만드는 패션 모멘트 — 무대 위 스타일의 정치학',
    slug: 'musician-fashion-moments-2026',
    excerpt: '아티스트의 옷은 단순한 의상이 아니다. 무대 위의 스타일은 하나의 발언이고, 때로는 선언이다.',
    category: 'culture',
    subcategory: 'fashion',
    tags: ['패션', '무대의상', '스타일', '아티스트'],
    isEditorsPick: false,
    date: '2026-05-01',
    author: 'Culture Team',
    coverImage: 'https://images.unsplash.com/photo-1596662678434-186ae19d2879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwdXJiYW4lMjBzdHlsZSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzgyMzU5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>뮤지션의 패션을 단순히 "패션"으로 보는 시대는 지났다. 무대 위에서 아티스트가 선택하는 옷, 색, 소재, 실루엣은 그 자체로 하나의 언어다.</p>

<p>올해 가장 화제가 된 무대 의상들을 돌아보면, 공통점이 있다. 과감한 젠더 플루이드 스타일링, 한국 전통 소재의 현대적 재해석, 그리고 로고 대신 메시지를 새긴 아이템들. 더 이상 아티스트는 브랜드의 홍보대사가 아니라, 스타일의 주체로서 자신의 이야기를 입는다.</p>

<p>특히 주목할 만한 것은 젊은 아티스트들이 신진 디자이너와 협업하는 경향이 강해졌다는 점이다. 대형 하우스 대신, 국내외의 이름 없는 브랜드를 무대에 올리는 선택. 그 안에 담긴 메시지는 분명하다 — "나는 만들어진 이미지가 아니라 내가 선택한 이미지를 입는다."</p>

<p>패션은 음악의 시각적 확장이다. 그리고 지금의 뮤지션들은 그 가능성을 누구보다 잘 이해하고 있다.</p>`,
    relatedArticles: ['art-010', 'art-011'],
  },
  {
    id: 'art-009',
    title: '귀를 위한 투자 — 오디오파일을 위한 헤드폰 선택 가이드',
    slug: 'audiophile-headphone-guide-2026',
    excerpt: '음악을 제대로 듣기 위한 장비가 궁금하다면. 예산별로 정리한 헤드폰 & 이어폰 추천 가이드.',
    category: 'culture',
    subcategory: 'product',
    tags: ['헤드폰', '이어폰', '오디오', '장비리뷰'],
    isEditorsPick: false,
    date: '2026-04-30',
    author: 'Product Team',
    coverImage: 'https://images.unsplash.com/photo-1737885197886-9e34a03ad226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBlcXVpcG1lbnQlMjBzdHVkaW98ZW58MXx8fHwxNzc4MjM1OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>좋은 음악을 좋은 장비로 듣는 것 — 이것이 사치인 시대는 지났다. 이제 적절한 예산만 있다면 누구나 스튜디오 수준의 청음 경험을 집에서 할 수 있다.</p>

<p><strong>10만원 이하: 입문의 시작</strong><br/>이 구간에서 놀라운 성능을 보여주는 모델들이 등장하고 있다. 특히 국내 브랜드의 약진이 두드러진다. 중립적인 음색, 편안한 착용감, 그리고 내구성까지 — 음악을 처음 진지하게 듣기 시작한 분들께 적극 추천한다.</p>

<p><strong>30만원대: 본격적인 시작</strong><br/>이 구간부터는 "음악을 듣는다"와 "음악을 경험한다"의 차이가 느껴지기 시작한다. 해상도가 높아지고, 음장감이 달라진다. 이 구간의 베스트셀러들은 실제로 오랫동안 쓸 수 있는 스테디셀러가 많다.</p>

<p><strong>100만원 이상: 오디오파일의 세계</strong><br/>이 세계에 발을 들이면, 돌아오기 어렵다. 모든 음이 분리되어 들리고, 아티스트의 숨소리가 들리고, 레코딩의 공간감이 느껴진다. 음악을 사랑하는 분들께는, 인생에 한 번쯤 경험해볼 가치가 있는 영역이다.</p>`,
    relatedArticles: ['art-010', 'art-008'],
  },
  {
    id: 'art-010',
    title: '2026 음악 트렌드 리포트 — 장르의 경계가 사라지고 있다',
    slug: 'music-trend-report-2026',
    excerpt: '올해 음악 씬을 관통하는 키워드는 무엇인가. 장르, 플랫폼, 소비 방식의 변화를 분석한 CHAMELEON의 트렌드 리포트.',
    category: 'culture',
    subcategory: 'trend-report',
    tags: ['트렌드리포트', '2026', '장르', '음악산업'],
    isEditorsPick: false,
    date: '2026-04-28',
    author: 'CHAMELEON Editorial',
    coverImage: 'https://images.unsplash.com/photo-1563721465742-cc3ead9deb36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZCUyMHJlcG9ydCUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBtYWdhemluZXxlbnwxfHx8fDE3NzgyMzU5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>2026년 음악 씬에서 가장 자주 들리는 말은 "이게 무슨 장르야?"다. 그리고 그것은 부정적인 반응이 아니다.</p>

<p><strong>1. 탈장르화의 가속</strong><br/>K-팝, 힙합, 인디, 발라드 — 이 경계들이 점점 흐려지고 있다. 아티스트들은 더 이상 한 장르의 공식을 따르지 않는다. 대신, 각자가 만든 고유한 세계를 구축한다. 이를 "장르리스"라고 부르는 것조차 무의미할 정도다.</p>

<p><strong>2. 숏폼 vs. 딥 리스닝</strong><br/>TikTok과 Reels가 만들어낸 숏폼 음악 소비 문화 속에서, 역설적으로 긴 앨범과 깊은 감상을 추구하는 움직임도 강해지고 있다. 두 트렌드는 공존하며, 서로 다른 욕구를 충족시킨다.</p>

<p><strong>3. 라이브의 귀환</strong><br/>스트리밍이 지배하는 시대에, 라이브 공연의 가치는 오히려 높아졌다. "그 순간 그 공간에 있었다"는 경험은 어떤 디지털 파일로도 대체되지 않는다. 공연 티켓 가격은 오르고, 매진 속도는 빨라지고 있다.</p>

<p><strong>4. 아티스트 주도 경제</strong><br/>음반사 중심의 구조에서 아티스트 중심으로의 이동이 가속화되고 있다. 독립 레이블, 직접 배급, 팬과의 직접 소통이 주류가 되어가고 있다.</p>`,
    relatedArticles: ['art-008', 'art-011'],
  },
  {
    id: 'art-011',
    title: 'ARTIST FOCUS: 경계 없는 음악 세계를 구축하는 아티스트',
    slug: 'artist-focus-may-2026',
    excerpt: '한 아티스트의 음악을 깊이 파고들면, 하나의 우주가 보인다. 이번 달 CHAMELEON의 아티스트 포커스.',
    category: 'culture',
    subcategory: 'artist-focus',
    tags: ['아티스트포커스', '인터뷰', '아티스트', '독점'],
    isEditorsPick: false,
    date: '2026-04-25',
    author: 'CHAMELEON Editorial',
    coverImage: 'https://images.unsplash.com/photo-1762287929145-b09f2610cd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGFydGlzdCUyMHBvcnRyYWl0JTIwbW9vZHklMjBkYXJrfGVufDF8fHx8MTc3ODIzNTkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p>"저는 음악을 만들 때 장르를 먼저 생각하지 않아요. 오히려 그 반대예요 — 어떤 감정인지를 먼저 생각하고, 그 감정에 가장 솔직한 소리를 찾아가는 과정이 저의 작업 방식이에요."</p>

<p>이 아티스트를 처음 만난 건 2년 전 소규모 클럽 공연에서였다. 50명 남짓한 관객 앞에서, 그는 기타와 루프 페달 하나만으로 공간 전체를 채웠다. 그 날의 기억이 아직도 선명하다.</p>

<p>2년이 지난 지금, 그의 음악은 더 정교해지고 더 대담해졌다. 첫 정규 앨범은 발매 첫 주 차트 5위에 올랐고, 해외 음악 매체의 주목을 받았다. 그러나 그는 조금도 달라 보이지 않았다.</p>

<p>"성공이라는 게 뭔지 잘 모르겠어요. 지금 가장 행복한 건, 음악을 들어주는 사람들이 늘었다는 거예요. 제 세계에 같이 있어주는 사람들이 많아진 것 — 그게 전부예요."</p>

<p>그의 다음 앨범은 올 하반기 발매 예정이다. 우리는 기다릴 것이다.</p>`,
    relatedArticles: ['art-008', 'art-010'],
  },
  {
    id: 'art-012',
    title: '리뷰: 소음과 침묵 사이 — 실험적 사운드스케이프의 전위',
    slug: 'review-experimental-soundscape-2026',
    excerpt: '이 음악은 쉽지 않다. 하지만 한번 들어보면 — 다시 예전 귀로 돌아가기 어렵다.',
    category: 'listen',
    subcategory: 'reviews',
    tags: ['앨범리뷰', '실험음악', '사운드스케이프', '전위'],
    isEditorsPick: false,
    date: '2026-04-22',
    author: 'Music Critic',
    coverImage: 'https://images.unsplash.com/photo-1552174588-6733961c358e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZyUyMHNlc3Npb24lMjBkYXJrfGVufDF8fHx8MTc3ODIzNTkyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    body: `<p><strong>★★★★☆</strong></p>

<p>이 앨범을 설명하려면 먼저 규칙을 잊어야 한다. 멜로디가 있다고 생각하면 사라지고, 리듬이 잡힌다고 생각하면 무너진다. 그것은 의도적인 해체다.</p>

<p>1번 트랙은 17분이다. 17분 동안 아무것도 "일어나지 않는" 것처럼 들리지만, 17분이 끝났을 때 당신은 무언가 변해 있음을 느낄 것이다. 그것이 이 음악의 작동 방식이다.</p>

<p>3번 트랙에서 갑작스럽게 등장하는 클라리넷은 이 앨범에서 가장 인간적인 순간이다. 그것이 지나가고 다시 전자음의 세계로 돌아갈 때, 그 클라리넷의 부재가 오히려 더 크게 들린다.</p>

<p>이 앨범을 즐기려면 "즐기려는" 노력을 포기해야 한다. 그냥 틀어놓아라. 배경음악으로 들어도 좋고, 귀를 집중해도 좋다. 이 음악은 어떤 방식으로 들어도 무언가를 건네준다.</p>`,
    relatedArticles: ['art-003', 'art-006'],
  },
];
