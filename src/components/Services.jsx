import { useState } from 'react'

const SPECIALIZATIONS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L4 9l10 5 10-5-10-5Z" stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 14l10 5 10-5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 19l10 5 10-5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    tag: 'AI / ML',
    title: 'Artificial Intelligence & Machine Learning',
    description:
      'Architecting agentic AI workflows that utilize recursive logic to self-correct and optimize within high-stakes industrial and aerospace environments. We help you structure compelling SBIR/STTR and BAA proposals that articulate your AI capabilities to federal reviewers.',
    fundingNote: 'DOD, DARPA, NSF SBIR/STTR eligible',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="9" cy="14" r="4" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="19" cy="14" r="4" stroke="#22d3ee" strokeWidth="1.5" />
        <path d="M13 14h2" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 8l4 6M14 14l4-6" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    tag: 'HMT',
    title: 'Human-Machine Teaming',
    description:
      'Designing collaborative frameworks where autonomous systems and human operators share decision-making authority. Our methodologies align directly with DoD HMT research priorities, making your proposals highly competitive for AFRL and ARL funding streams.',
    fundingNote: 'AFRL, ARL, ONR funding streams',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 5C9.03 5 5 9.03 5 14s4.03 9 9 9 9-4.03 9-9"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19 5h4v4M23 5l-5 5"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="2" fill="#6366f1" />
      </svg>
    ),
    tag: 'Quantum',
    title: 'Quantum Applications',
    description:
      'Translating quantum computing and sensing research into actionable system architectures for national security and critical infrastructure. We specialize in aligning your quantum capabilities with IARPA, NIST, and DHS funding priorities.',
    fundingNote: 'IARPA, NIST, DHS grant opportunities',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="#0ea5e9" strokeWidth="1.5" />
        <rect x="15" y="5" width="8" height="8" rx="1.5" stroke="#22d3ee" strokeWidth="1.5" />
        <rect x="5" y="15" width="8" height="8" rx="1.5" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="15" y="15" width="8" height="8" rx="1.5" stroke="#8b5cf6" strokeWidth="1.5" />
      </svg>
    ),
    tag: 'V&V',
    title: 'Verification & Validation',
    description:
      'Leading the NIST/ASME V&V 50 subcommittee to establish international benchmarks for data-driven computational models. Our V&V expertise is a critical differentiator when pursuing contracts that require demonstrated systems reliability standards.',
    fundingNote: 'DoE, DoD, NASA contract vehicles',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 14l4-4 4 4 4-6 4 8" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 20h18" stroke="#334155" strokeWidth="1" />
        <circle cx="9" cy="10" r="1.5" fill="#22d3ee" />
        <circle cx="23" cy="16" r="1.5" fill="#6366f1" />
      </svg>
    ),
    tag: 'GNC',
    title: 'Aerospace & GNC Systems',
    description:
      'Precision orbital mechanics and Guidance, Navigation, and Control (GNC) modeling for resilient space infrastructure and hyperspectral analytics. We have a proven track record sustaining 99.7% uptime across critical legacy spacecraft missions.',
    fundingNote: 'NASA, Space Force, MDA programs',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 6v4M14 18v4M6 14h4M18 14h4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="5" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M11 11l6 6M17 11l-6 6" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    tag: 'Intel Ops',
    title: 'Enterprise Intelligence & Analytics',
    description:
      'Modernizing analytics pipelines for national security and enterprise environments, achieving unprecedented savings through systems consolidation. Our NSA-proven methodologies translate directly into persuasive, evidence-based grant narratives.',
    fundingNote: 'IC, NSA, DIA program offices',
  },
]

export default function Services() {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  return (
    <section id="expertise" className="py-28 relative overflow-hidden">
      {/* Subtle section bg tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 20% 80%, rgba(99,102,241,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-5">
            Core Specializations
          </div>
          <h2
            className="font-display font-800 text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Expertise Matrix
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-base leading-relaxed">
            We accelerate government funding submissions across six high-priority domains, combining
            deep technical credibility with strategic proposal development.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIALIZATIONS.map((spec, i) => (
            <article
              key={i}
              className="group relative overflow-hidden cursor-default"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                background:
                  hoveredIdx === i
                    ? 'rgba(255,255,255,0.045)'
                    : 'rgba(255,255,255,0.02)',
                backdropFilter: hoveredIdx === i ? 'blur(32px) saturate(200%)' : 'blur(16px)',
                WebkitBackdropFilter: hoveredIdx === i ? 'blur(32px) saturate(200%)' : 'blur(16px)',
                border: hoveredIdx === i
                  ? '1px solid rgba(255,255,255,0.14)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: hoveredIdx === i
                  ? 'inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(0,0,0,0.5), 0 20px 48px rgba(0,0,0,0.55)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.02), 0 4px 16px rgba(0,0,0,0.3)',
                transform: hoveredIdx === i ? 'translateY(-4px)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.55), transparent)',
                  opacity: hoveredIdx === i ? 1 : 0,
                }}
              />

              <div className="p-7 flex flex-col gap-4 h-full">
                {/* Icon + tag */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[rgba(14,165,233,0.07)] border border-[rgba(14,165,233,0.14)]">
                    {spec.icon}
                  </div>
                  <span className="text-[10px] font-mono font-500 uppercase tracking-widest text-accent-blue px-2.5 py-1 border border-[rgba(14,165,233,0.22)] bg-[rgba(14,165,233,0.05)]">
                    {spec.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display font-700 text-white text-base leading-snug">
                  {spec.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">
                  {spec.description}
                </p>

                {/* Funding note */}
                <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="1" width="10" height="10" stroke="#22d3ee" strokeWidth="1" />
                    <path d="M4 6l1.5 1.5L8 4" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] font-mono text-accent-cyan opacity-70">
                    {spec.fundingNote}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Funding pathways CTA */}
        <div id="funding" className="mt-20 glass-panel p-10 md:p-14 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest text-accent-cyan border border-[rgba(34,211,238,0.22)] bg-[rgba(34,211,238,0.04)] mb-6"
          >
            Funding Pathways
          </div>
          <h3
            className="font-display font-800 text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
          >
            From Concept to Contract
          </h3>
          <p className="max-w-2xl mx-auto text-slate-500 text-base leading-relaxed mb-8">
            DaScient bridges the gap between cutting-edge research and government investment. We
            identify the right solicitations, craft technically compelling narratives, and guide
            submissions through SBIR/STTR, BAA, and OTA pathways.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['SBIR / STTR', 'BAA', 'OTA / Other Transactions', 'DARPA Proposals', 'NASA Grants', 'DoD Contracts'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-xs font-mono text-slate-400 border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)]"
                >
                  {tag}
                </span>
              )
            )}
          </div>
          <a href="#contact" className="btn-glow">
            Start a Funding Conversation
          </a>
        </div>
      </div>
    </section>
  )
}
