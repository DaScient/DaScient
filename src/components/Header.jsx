import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Expertise', href: '#expertise' },
  { label: 'Funding Pathways', href: '#funding' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.07)]'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="DaScient home"
          >
            {/* Minimal SVG wordmark */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect width="32" height="32" rx="6" fill="rgba(14,165,233,0.12)" />
              <rect width="32" height="32" rx="6" stroke="rgba(14,165,233,0.35)" strokeWidth="1" />
              <path
                d="M8 10h8a6 6 0 0 1 0 12H8V10Z"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="22" r="2.5" fill="#22d3ee" />
            </svg>
            <span className="font-display font-800 text-white tracking-tight text-lg leading-none">
              Da<span className="text-accent-blue">Scient</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="ml-2 btn-glow text-xs py-2.5 px-5"
              >
                Get in Touch
              </a>
            </li>
          </ul>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden glass-panel mx-4 mb-4 rounded-xl overflow-hidden">
          <ul className="flex flex-col p-2" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2 pb-1 px-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="btn-glow w-full text-xs py-3"
              >
                Get in Touch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
