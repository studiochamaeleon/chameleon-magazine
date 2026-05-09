import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { LogOut, LayoutDashboard, PenLine, Eye } from 'lucide-react';
import LogoBlack from '../../../imports/_______Logo_Black.svg';

const ADMIN_PASSWORD = 'chameleon2025';
const AUTH_KEY = 'chameleon-admin-auth';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setError(false);
      onLogin();
    } else {
      setError(true);
      setPw('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/">
            <img src={LogoBlack} alt="CHAMELEON MAGAZINE" style={{ height: '18px', width: 'auto', display: 'inline-block' }} />
          </Link>
          <div
            className="mt-3 text-gray-500 tracking-widest"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.3em' }}
          >
            ADMIN
          </div>
        </div>

        <div className="border border-black p-8">
          <h1
            className="text-black mb-6"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}
          >
            관리자 로그인
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1.5 text-gray-600"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                비밀번호
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(false); }}
                placeholder="관리자 비밀번호 입력"
                autoFocus
                className="w-full border border-gray-300 focus:border-black focus:outline-none px-3 py-2.5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', borderRadius: 2 }}
              />
              {error && (
                <p className="mt-1.5 text-red-500" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
                  비밀번호가 올바르지 않습니다.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-black text-white hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 700, borderRadius: 2 }}
            >
              로그인
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}
            >
              ← 독자 화면으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminRoot() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuth(false);
    navigate('/admin');
  };

  if (!isAuth) {
    return <AdminLogin onLogin={() => setIsAuth(true)} />;
  }

  const navLinks = [
    { to: '/admin', label: '대시보드', icon: <LayoutDashboard size={15} />, exact: true },
    { to: '/admin/editor', label: '새 기사 작성', icon: <PenLine size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Admin Top Bar */}
      <header className="bg-black text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-12">
          {/* Left: Logo + Admin badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
              <img src={LogoBlack} alt="CHAMELEON MAGAZINE" style={{ height: '13px', width: 'auto', filter: 'invert(1)' }} />
            </Link>
            <span
              className="border border-white px-1.5 py-0.5 text-white"
              style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em' }}
            >
              ADMIN
            </span>
          </div>

          {/* Right: Nav + actions */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to) && link.to !== '/admin';
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors text-white ${
                    isActive ? 'bg-white text-black' : 'hover:bg-white/10'
                  }`}
                  style={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 2 }}
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
            <div className="w-px h-5 bg-white/20 mx-1" />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 transition-colors"
              style={{ fontSize: '0.75rem', borderRadius: 2 }}
              title="독자 화면 열기"
            >
              <Eye size={15} />
              <span className="hidden sm:inline">독자 화면</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 transition-colors"
              style={{ fontSize: '0.75rem', borderRadius: 2 }}
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
