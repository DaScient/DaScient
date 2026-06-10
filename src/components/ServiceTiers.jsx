import { useState } from 'react'

const TIERS = [
  {
    number: '01',
    label: 'Tier 1',
    title: 'Federal & Commercial Readiness',
    subtitle: 'The Foundation',
    color: '#0ea5e9',
    colorMuted: 'rgba(14,165,233,0.10)',
    colorBorder: 'rgba(14,165,233,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M9 8V6a5 5 0 0 1 10 0v2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="15" r="2" fill="#6366f1" />
      </svg>
    ),
    items: [
      'End-to-end SAM.gov, UEI, CAGE, and NAICS management',
      'Fast-track 8(a), WOSB, SDVOSB, and HUBZone certification',
      'DCAA-compliant accounting & time-tracking systems',
      'IP shielding strategy for proprietary "homebrewed" code',
    ],
  },
  {
    number: '02',
    label: 'Tier 2',
    title: 'Technical Build-out & Security',
    subtitle: 'The Guardrails',
    color: '#22d3ee',
    colorMuted: 'rgba(34,211,238,0.08)',
    colorBorder: 'rgba(34,211,238,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l8 3v7c0 5-4 9-8 10C10 23 6 19 6 14V7l8-3Z" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14l3 3 5-5" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      'Rapid ATO roadmap: FedRAMP and DoD Impact Level (IL) compliance',
      'Agentic governance frameworks: kill-switches & logging for autonomous AI',
      'System Security Plan (SSP) drafting — full 100+ page documentation',
      'DevSecOps CI/CD pipeline integration — "secure by design"',
    ],
  },
  {
    number: '03',
    label: 'Tier 3',
    title: 'Funding & Capture Management',
    subtitle: 'The Growth',
    color: '#6366f1',
    colorMuted: 'rgba(99,102,241,0.08)',
    colorBorder: 'rgba(99,102,241,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 18l5-5 4 4 4-6 5 3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="7" r="3" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M23 4v6M20 7h6" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    items: [
      'SBIR/STTR Proposal Factory: Phase I, II, and III lifecycle management',
      'Other Transaction Authority (OTA) positioning for DoD prototypes',
      'Prime contractor matchmaking & teaming agreement negotiation',
      '"Gov-Speak" translation: white papers to compliant federal proposals',
    ],
  },
  {
    number: '04',
    label: 'Tier 4',
    title: 'Entrepreneurial Concierge',
    subtitle: 'The Game-Changer Suite',
    color: '#8b5cf6',
    colorMuted: 'rgba(139,92,246,0.08)',
    colorBorder: 'rgba(139,92,246,0.22)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M5 24c0-5 4-8 9-8s9 3 9 8" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 6l2-2M22 8h2M20 10l2 2" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    items: [
      'Concept de-risking: stress-test ideas against federal Problem Statements',
      'Prototype-to-product coaching: from script to enterprise-grade SaaS',
      'Intimidation buffer: DaScient acts as your "Front Office" for negotiations',
      'Fractional COO/Compliance Officer — on-call until your first contract',
    ],
  },
]

const ENTRY_POINTS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2" stroke="#0ea5e9" strokeWidth="1.3" />
        <path d="M7 9h8M7 13h5" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: '"Dream-to-Draft" Workshop',
    description:
      'A 48-hour intensive where DaScient converts your rough idea into a professional Executive Summary and Pitch Deck ready for federal reviewers.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" stroke="#6366f1" strokeWidth="1.3" />
        <path d="M4 20c0-4 3-6 7-6s7 2 7 6" stroke="#8b5cf6" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M15 5l2-2M17 7h2" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    title: 'Fractional COO / Compliance Officer',
    description:
      'For a small monthly retainer, DaScient acts as your internal operations and compliance team — managing the bureaucratic load until your first contract lands.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="#22d3ee" strokeWidth="1.3" />
        <path d="M7 11h8M11 7v8" stroke="#0ea5e9" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="17" cy="5" r="2.5" fill="#6366f1" />
      </svg>
    ),
    title: 'The "SandBox" Environment',
    description:
      'A pre-configured, compliance-ready cloud environment where entrepreneurs can build and test AI systems without worrying about security policy violations.',
  },
]

export default function ServiceTiers() {
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <section id="services" aria-labelledby="services-heading" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(14,165,233,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(139,92,246,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-5">
            Service Architecture
          </div>
          <h2
            id="services-heading"
            className="font-display font-800 text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Capabilities Spec Sheet
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-base leading-relaxed">
            A structured four-tier framework that takes your idea from entity registration through
            full federal market integration — end to end.
          </p>
        </div>

        {/* Four-tier grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {TIERS.map((tier, i) => (
            <article
              key={i}
              className="relative overflow-hidden cursor-default transition-all duration-300"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{
                background: activeIdx === i ? tier.colorMuted : 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: activeIdx === i
                  ? `1px solid ${tier.colorBorder}`
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeIdx === i
                  ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5), 0 20px 48px rgba(0,0,0,0.5), 0 0 24px ${tier.colorMuted}`
                  : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.35)',
                transform: activeIdx === i ? 'translateY(-3px)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tier.color}88, transparent)`,
                  opacity: activeIdx === i ? 1 : 0,
                }}
              />

              <div className="p-7 flex flex-col gap-5 h-full">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 border"
                      style={{
                        background: tier.colorMuted,
                        borderColor: tier.colorBorder,
                      }}
                    >
                      {tier.icon}
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-widest mb-0.5"
                        style={{ color: tier.color }}
                      >
                        {tier.label}
                      </p>
                      <h3 className="font-display font-700 text-white text-base leading-snug">
                        {tier.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className="font-display font-800 text-5xl leading-none opacity-10 flex-shrink-0"
                    style={{ color: tier.color }}
                  >
                    {tier.number}
                  </span>
                </div>

                {/* Subtitle badge — sharp */}
                <div
                  className="inline-flex self-start items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border"
                  style={{
                    color: tier.color,
                    borderColor: tier.colorBorder,
                    background: tier.colorMuted,
                  }}
                >
                  {tier.subtitle}
                </div>

                {/* Items */}
                <ul className="flex flex-col gap-2.5">
                  {tier.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="mt-0.5 flex-shrink-0"
                      >
                        <rect x="1" y="1" width="12" height="12" stroke={tier.color} strokeWidth="1" opacity="0.5" />
                        <path
                          d="M4.5 7l2 2 3-3"
                          stroke={tier.color}
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Entrepreneur Support strip */}
        <div id="entrepreneur-support" className="glass-panel p-10 md:p-14">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest text-accent-cyan border border-[rgba(34,211,238,0.22)] bg-[rgba(34,211,238,0.05)] mb-4"
            >
              Entrepreneur Support
            </div>
            <h3
              className="font-display font-800 text-white mb-3 tracking-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
            >
              Low-Barrier Entry Points
            </h3>
            <p className="max-w-xl mx-auto text-slate-500 text-sm leading-relaxed">
              Not ready for a full engagement? These accelerators are designed for founders who
              are just getting started — or simply intimidated by the field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENTRY_POINTS.map((ep, i) => (
              <div
                key={i}
                className="p-6 flex flex-col gap-3 transition-all duration-300 hover:bg-[rgba(255,255,255,0.03)]"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="p-2.5 bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.14)] w-fit"
                >
                  {ep.icon}
                </div>
                <h4 className="font-display font-700 text-white text-sm">{ep.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{ep.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="#contact" className="btn-glow">
              Explore All Options
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
