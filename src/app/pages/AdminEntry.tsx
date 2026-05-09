const STUDIO_URL = import.meta.env.VITE_SANITY_STUDIO_URL || 'https://chameleon-magazine.sanity.studio/';

export function AdminEntry() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="border-t-4 border-black pt-8">
        <p
          className="mb-3 text-gray-500"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', letterSpacing: '0.08em' }}
        >
          CHAMELEON MAGAZINE ADMIN
        </p>
        <h1
          className="text-black mb-5"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2.4rem, 7vw, 5.8rem)',
            fontWeight: 900,
            lineHeight: 0.92,
          }}
        >
          글 작성과 발행은 Sanity Studio에서 진행합니다
        </h1>
        <p className="max-w-2xl text-gray-600 mb-8" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          이 페이지에는 관리자 비밀번호나 발행 토큰을 저장하지 않습니다. Sanity 계정 권한이 있는 사용자만
          Studio에 로그인해 기사 작성, 이미지 업로드, 유튜브 임베드, 발행 관리를 할 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-black text-white hover:bg-neutral-800 transition-colors px-5 py-3"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, letterSpacing: '0.04em' }}
          >
            SANITY STUDIO 열기
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-colors px-5 py-3"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, letterSpacing: '0.04em' }}
          >
            독자 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
