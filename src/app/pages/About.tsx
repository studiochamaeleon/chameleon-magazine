import LogoBlack from '../../imports/_______Logo_Black.svg';

const paragraphs = [
  '까멜리온 매거진은 2026년에 창간한 음악 중심 문화 콘텐츠 매거진입니다.',
  '우리는 빠르게 변화하는 음악과 문화의 흐름 속에서 단순한 소식 전달을 넘어, 지금의 트렌드가 왜 만들어지고 어떤 감각으로 소비되고 있는지를 함께 이야기합니다.',
  'K-POP과 글로벌 팝, 하우스·테크노를 비롯한 다양한 음악 장르, 아티스트의 서사와 스타일, 공연, 패션, 그리고 인터넷 컬처까지.',
  '까멜리온 매거진은 음악을 중심으로 시대의 분위기와 사람들의 취향을 기록합니다.',
  '우리는 음악이 한 사람의 취향과 색을 가장 솔직하게 보여주는 언어라고 믿습니다.',
  '누군가는 플레이리스트로 자신의 하루를 설명하고, 누군가는 좋아하는 아티스트와 사운드를 통해 자신만의 무드와 감각을 드러냅니다.',
  '하지만 점점 더 비슷해지는 흐름 속에서 자신의 취향과 색을 표현하는 일은 오히려 어려워지고 있습니다.',
  '까멜리온 매거진은 더 많은 사람들이 자신만의 취향과 감각을 자유롭게 발견하고 표현할 수 있도록, 트렌디한 소식부터 깊이 있는 디깅과 문화 이야기까지 다양한 콘텐츠를 만들어갑니다.',
  '현재는 인스타그램과 웹 매거진을 중심으로 운영되고 있으며, 앞으로 음악을 기반으로 한 다양한 프로젝트와 새로운 플랫폼들도 준비하고 있습니다.',
];

export function About() {
  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <header className="border-t-4 border-black pt-6 mb-10">
        <p
          className="text-black mb-5"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
          }}
        >
          ABOUT
        </p>
        <img
          src={LogoBlack}
          alt="까멜리온 매거진 CHAMELEON MAGAZINE"
          className="h-auto w-full max-w-[520px]"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-12 border-t border-black pt-8">
        <aside
          className="text-black"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '0.82rem',
            fontWeight: 900,
            letterSpacing: '0.12em',
            lineHeight: 1.5,
          }}
        >
          DIGGING IS OURS.
          <br />
          TREND IS YOURS.
        </aside>

        <div>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-black mb-5"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2vw, 1.12rem)',
                lineHeight: 1.9,
                wordBreak: 'keep-all',
              }}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-10 pt-7 border-t border-black">
            <p
              className="text-black"
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '0.02em',
              }}
            >
              디깅은 우리가.
              <br />
              트렌드는 당신이.
            </p>
            <p
              className="mt-6 text-black"
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '0.86rem',
                fontWeight: 900,
                letterSpacing: '0.16em',
              }}
            >
              CHAMELEON MAGAZINE
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
