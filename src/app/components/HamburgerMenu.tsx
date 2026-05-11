import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ALL_CATEGORIES } from '../data/categories';
import LogoWhite from '../../imports/_______Logo_White.svg';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — dark mode */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-black z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="전체 메뉴"
        role="navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link
            to="/"
            onClick={onClose}
            className="hover:opacity-60 transition-opacity"
            aria-label="CHAMELEON MAGAZINE 홈"
          >
            <img
              src={LogoWhite}
              alt="CHAMELEON MAGAZINE"
              style={{ height: '14px', width: 'auto' }}
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white/10 focus:outline-none transition-colors"
            aria-label="메뉴 닫기"
            style={{ borderRadius: 2 }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4">
          {/* Editor's Pick */}
          <Link
            to="/category/editors-pick"
            onClick={onClose}
            className="flex items-center justify-between px-6 py-3 hover:bg-white/5 border-b border-white/5 group transition-colors"
          >
            <span
              className="text-white"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 700 }}
            >
              Editor's Pick
            </span>
            <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
          </Link>

          {/* Categories */}
          {ALL_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                onClick={onClose}
                className="flex items-center justify-between px-6 py-3 hover:bg-white/5 group transition-colors"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: cat.color,
                  }}
                >
                  {cat.label}
                </span>
                <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
              </Link>

              {/* Subcategories */}
              {cat.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${cat.id}?sub=${sub.id}`}
                  onClick={onClose}
                  className="flex items-center px-8 py-2 hover:bg-white/5 group transition-colors"
                >
                  <span
                    className="text-white/40 group-hover:text-white/70 transition-colors"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
                  >
                    {sub.label}
                  </span>
                </Link>
              ))}

              <div className="border-b border-white/5 mx-6 my-1" />
            </div>
          ))}

          <div className="mt-4 border-t border-white/10 pt-4">
            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 hover:bg-white/5 group transition-colors"
            >
              <span
                className="text-white"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 700 }}
              >
                About
              </span>
              <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
            </Link>
            <a
              href="https://www.instagram.com/chameleon_magazine/"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 hover:bg-white/5 group transition-colors"
            >
              <span
                className="text-white"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 700 }}
              >
                Instagram
              </span>
              <ChevronRight size={14} className="text-white/30 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
