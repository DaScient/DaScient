const PLANS = [
  {
    id: 'spark',
    label: 'Tier 1',
    name: 'The Spark',
    tagline: 'Bootstrap',
    target: 'Solo founders and homebrewed projects',
    price: '$250',
    period: '/ month',
    equity: '+ 2% equity / success fee on first contract',
    color: '#0ea5e9',
    colorMuted: 'rgba(14,165,233,0.08)',
    colorBorder: 'rgba(14,165,233,0.25)',
    featured: false,
    items: [
      'SAM.gov and UEI registration management',
      'Access to DaScient Private GitHub Knowledge Base',
      'Bi-weekly SBIR/STTR opportunity pipeline reports',
      'Basic capability statement template',
    ],
  },
  {
    id: 'ascent',
    label: 'Tier 2',
    name: 'The Ascent',
    tagline: 'Growth',
    target: 'Seed-stage teams and engineering boutiques',
    price: '$1,200',
    period: '/ month',
    equity: '+ 1% success fee on awarded contracts',
    color: '#22d3ee',
    colorMuted: 'rgba(34,211,238,0.10)',
    colorBorder: 'rgba(34,211,238,0.35)',
    featured: true,
    items: [
      'Everything in The Spark',
      'Full socio-economic certification filing (8(a), SDVOSB, etc.)',
      'Dedicated System Security Plan (SSP) drafting',
      'Monthly strategy call for proposal architecture',
      'Prime contractor matchmaking & teaming agreement templates',
    ],
  },
  {
    id: 'vanguard',
    label: 'Tier 3',
    name: 'The Vanguard',
    tagline: 'Enterprise / Scale',
    target: 'Organizations ready for multi-million dollar federal integration',
    price: '$4,500',
    period: '/ month',
    equity: null,
    color: '#8b5cf6',
    colorMuted: 'rgba(139,92,246,0.08)',
    colorBorder: 'rgba(139,92,246,0.30)',
    featured: false,
    items: [
      'Everything in The Ascent',
      'Full-cycle SBIR/STTR proposal management (Technical & Cost Volumes)',
      'White-glove FedRAMP / CMMC compliance audit and build-out',
      'On-call representation during agency negotiations',
      'Custom automated reporting dashboard for contract performance',
    ],
  },
]

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
      <rect x="1" y="1" width="12" height="12" stroke={color} strokeWidth="1" opacity="0.5" />
      <path
        d="M4.5 7l2 2 3-3"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-5">
            Engagement Model
          </div>
          <h2
            id="pricing-heading"
            className="font-display font-800 text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Tiered Pricing
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-base leading-relaxed">
            Designed to scale with the entrepreneur. Cost is never a barrier to world-changing
            innovation — DaScient shares in your success.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative overflow-hidden flex flex-col transition-all duration-300"
              style={{
                background: plan.featured
                  ? plan.colorMuted
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${plan.featured ? plan.colorBorder : 'rgba(255,255,255,0.06)'}`,
                boxShadow: plan.featured
                  ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(0,0,0,0.5), 0 24px 56px rgba(0,0,0,0.55), 0 0 32px ${plan.colorMuted}`
                  : 'inset 0 1px 0 rgba(255,255,255,0.02), 0 4px 16px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              }}
            >
              {/* Featured top accent line */}
              {plan.featured && (
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${plan.color}bb, transparent)`,
                  }}
                />
              )}
              {/* Featured badge — sharp */}
              {plan.featured && (
                <div className="absolute top-4 right-4">
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 border"
                    style={{
                      color: plan.color,
                      borderColor: plan.colorBorder,
                      background: plan.colorMuted,
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex flex-col gap-6 flex-1">
                {/* Plan header */}
                <div>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-1"
                    style={{ color: plan.color }}
                  >
                    {plan.label} · {plan.tagline}
                  </p>
                  <h3 className="font-display font-800 text-white text-xl mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{plan.target}</p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-[rgba(255,255,255,0.05)] py-5">
                  <div className="flex items-end gap-1">
                    <span
                      className="font-display font-800 leading-none"
                      style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: plan.color }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-slate-500 text-sm mb-1 font-mono">{plan.period}</span>
                  </div>
                  {plan.equity && (
                    <p className="text-[11px] font-mono text-slate-600 mt-1">{plan.equity}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckIcon color={plan.color} />
                      <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={plan.featured ? 'btn-glow w-full mt-4' : 'btn-ghost w-full mt-4'}
                  style={
                    !plan.featured
                      ? {
                          borderColor: plan.colorBorder,
                          color: plan.color,
                        }
                      : {}
                  }
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-center text-[11px] font-mono text-slate-700 mt-8">
          All plans are month-to-month. Equity and success fees are negotiated at engagement.
          Custom enterprise arrangements available upon request.
        </p>
      </div>
    </section>
  )
}
