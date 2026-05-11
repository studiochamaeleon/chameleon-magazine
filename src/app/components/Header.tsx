import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, Search, X } from 'lucide-react';
import { HamburgerMenu } from './HamburgerMenu';
import { ALL_CATEGORIES } from '../data/categories';
import LogoBlack from '../../imports/_______Logo_Black.svg';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="sticky top-0 z-30 bg-white border-b border-black">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3">
          {/* Left: Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="전체 메뉴 열기"
            style={{ borderRadius: 2 }}
          >
            <Menu size={20} />
          </button>

          {/* Center: Logo */}
          <Link
            to="/"
            className="flex-1 flex justify-center items-center hover:opacity-70 transition-opacity"
            aria-label="CHAMELEON MAGAZINE 홈"
          >
            <img
              src={LogoBlack}
              alt="CHAMELEON MAGAZINE"
              style={{ height: 'clamp(16px, 2.8vw, 26px)', width: 'auto' }}
            />
          </Link>

          {/* Right: Search only */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
              aria-label="검색"
              style={{ borderRadius: 2 }}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-200 px-4 md:px-6 py-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="기사 검색..."
                autoFocus
                className="flex-1 border border-gray-300 px-3 py-1.5 focus:outline-none focus:border-black"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', borderRadius: 2 }}
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', borderRadius: 2 }}
              >
                검색
              </button>
            </form>
          </div>
        )}

        {/* Primary navigation */}
        <nav
          className="hidden md:flex justify-center items-center border-t border-gray-200 px-6"
          aria-label="주요 카테고리"
        >
          <Link
            to="/about"
            className="px-4 py-2 text-black hover:bg-black hover:text-white transition-colors border-r border-gray-200 focus:outline-none focus:bg-black focus:text-white"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            ABOUT
          </Link>
          <Link
            to="/category/editors-pick"
            className="px-4 py-2 text-black hover:bg-black hover:text-white transition-colors border-r border-gray-200 focus:outline-none focus:bg-black focus:text-white"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            EDITOR'S PICK
          </Link>
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="px-4 py-2 text-black transition-colors border-r border-gray-200 last:border-r-0 focus:outline-none"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = cat.color;
                (e.currentTarget as HTMLElement).style.color = cat.textColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '';
                (e.currentTarget as HTMLElement).style.color = '#000000';
              }}
            >
              {cat.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
