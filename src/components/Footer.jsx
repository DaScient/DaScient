const FOOTER_LINKS = {
  Company: [
    { label: 'About DaScient', href: '#' },
    { label: 'Founder Dossier', href: '#' },
    { label: 'Publications', href: 'https://www.amazon.com/s?k=Don+D.M.+Tadaya' },
    { label: 'Press & Media', href: 'mailto:press@dascient.com' },
  ],
  Services: [
    { label: 'Federal Readiness', href: '#services' },
    { label: 'Technical Build-out', href: '#services' },
    { label: 'Funding & Capture', href: '#services' },
    { label: 'Entrepreneur Concierge', href: '#entrepreneur-support' },
  ],
  Expertise: [
    { label: 'AI / ML Consulting', href: '#expertise' },
    { label: 'Human-Machine Teaming', href: '#expertise' },
    { label: 'Quantum Applications', href: '#expertise' },
    { label: 'Funding Pathways', href: '#funding' },
  ],
  Products: [
    { label: 'RoboVet™', href: 'https://apps.apple.com/us/app/robovet-24-7-ai-veterinarian/id6753560467' },
    { label: 'GoZaddy.ai™', href: 'https://dascient.com/gozaddy-ai' },
    { label: 'DaScient Press', href: 'https://dascient.com/press' },
    { label: 'Kaggle Notebooks', href: 'https://kaggle.com/dascient/code' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden border-t border-[rgba(255,255,255,0.06)]"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(40px)',
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.4) 40%, rgba(34,211,238,0.3) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container py-16 md:py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[rgba(255,255,255,0.05)]">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <a href="/" className="flex items-center gap-2.5 group w-fit">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="rgba(14,165,233,0.10)" />
                <rect width="32" height="32" rx="6" stroke="rgba(14,165,233,0.30)" strokeWidth="1" />
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
            <p className="text-xs text-slate-600 leading-relaxed max-w-[220px]">
              Strategic Quantum Intelligence &amp; Operations. Bridging abstract mathematics with
              mission-critical autonomy.
            </p>
            <div className="flex flex-col gap-2 text-xs font-mono text-slate-600">
              <a href="mailto:contact@dascient.com" className="hover:text-accent-blue transition-colors">
                contact@dascient.com
              </a>
              <a href="tel:+13102200142" className="hover:text-accent-blue transition-colors">
                +1 310-220-0142
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Locations strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 border-b border-[rgba(255,255,255,0.05)]">
          {['Los Angeles, CA', 'Denver, CO', 'Columbia, MD'].map((loc, i) => (
            <span key={loc} className="flex items-center gap-2 text-xs font-mono text-slate-600">
              {i > 0 && <span className="text-slate-800">·</span>}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="4.5" r="1.5" stroke="#334155" strokeWidth="1" />
                <path d="M5 1C3.07 1 1.5 2.57 1.5 4.5c0 2.5 3.5 5.5 3.5 5.5S8.5 7 8.5 4.5C8.5 2.57 6.93 1 5 1Z" stroke="#334155" strokeWidth="1" />
              </svg>
              {loc}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-[11px] font-mono text-slate-700 text-center md:text-left">
            © {year} DaScient, LLC. Founded by Don D.M. Tadaya. All rights reserved.
          </p>
          <p className="text-[11px] font-mono text-slate-800 text-center">
            CLASSIFICATION: UNCLASSIFIED // DISTRIBUTION A: PUBLIC RELEASE
          </p>
        </div>
      </div>
    </footer>
  )
}
