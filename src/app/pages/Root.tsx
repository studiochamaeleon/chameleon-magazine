import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { ChameleonIntro } from '../components/ChameleonIntro';
import LogoBlack from '../../imports/_______Logo_Black.svg';

export function Root() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
      <ChameleonIntro />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-black mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-3">
                <img
                  src={LogoBlack}
                  alt="CHAMELEON MAGAZINE"
                  style={{ height: '16px', width: 'auto' }}
                />
              </div>
              <p className="text-gray-500" style={{ fontSize: '0.8rem', lineHeight: 1.7 }}>
                디깅은 우리가. 트렌드는 당신이.<br />
                까멜리온 매거진은 음악 뉴스, 신곡 소식, 뮤직비디오, 라이브 영상,
                아티스트 문화와 음악 트렌드를 다루는 음악 중심 문화 콘텐츠 매거진입니다.
              </p>
            </div>
            <div>
              <div
                className="text-black mb-3"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' }}
              >
                카테고리
              </div>
              <ul className="space-y-1">
                {['News', 'Listen', 'Visual', 'Culture'].map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/category/${cat.toLowerCase()}`}
                      className="text-gray-500 hover:text-black transition-colors"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div
                className="text-black mb-3"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' }}
              >
                문의
              </div>
              <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>
                <a
                  href="mailto:create@chameleonstudio.xyz"
                  className="hover:text-black transition-colors underline underline-offset-2"
                >
                  create@chameleonstudio.xyz
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-4 text-gray-400 text-center" style={{ fontSize: '0.72rem' }}>
            © 2025 CHAMELEON MAGAZINE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
