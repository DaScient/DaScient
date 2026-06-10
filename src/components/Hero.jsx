import { useEffect, useRef } from 'react'

function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large ambient orb — top left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '720px',
          height: '720px',
          top: '-200px',
          left: '-120px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)',
          animation: 'float 9s ease-in-out infinite',
        }}
      />
      {/* Medium orb — bottom right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-100px',
          right: '-80px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite reverse',
        }}
      />
      {/* Small accent — center top */}
      <div
        className="absolute rounded-full"
        style={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)',
          animation: 'float 7s ease-in-out infinite 2s',
        }}
      />
    </div>
  )
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14,165,233,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.035) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
    </div>
  )
}

const METRICS = [
  { value: '10+', label: 'Years Intel Ops' },
  { value: 'NIST', label: 'V&V 50 Standard Lead' },
  { value: '07', label: 'Published Assets' },
  { value: 'TS/SCI', label: 'Clearance Level' },
]

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMove = (e) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = ((clientX - left) / width - 0.5) * 20
      const y = ((clientY - top) / height - 0.5) * 20
      el.style.setProperty('--rx', `${y}deg`)
      el.style.setProperty('--ry', `${-x}deg`)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(14,165,233,0.11) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(99,102,241,0.08) 0%, transparent 60%), #030810',
      }}
    >
      <AnimatedOrbs />
      <GridLines />

      <div className="section-container relative z-10 flex flex-col items-center text-center gap-8">
        {/* Identity badge — sharp corners */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-500 uppercase tracking-widest text-accent-blue"
          style={{
            border: '1px solid rgba(14,165,233,0.28)',
            background: 'rgba(14,165,233,0.06)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="w-1.5 h-1.5 bg-accent-cyan animate-pulse-slow" />
          Strategic Quantum Intelligence &amp; Operations
        </div>

        {/* Main headline */}
        <div ref={heroRef} className="max-w-4xl">
          <h1
            className="font-display font-800 leading-[0.9] tracking-tight mb-0"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
          >
            <span className="block text-white">Securing the</span>
            <span className="block gradient-text">Government Funding</span>
            <span className="block text-white">Your Technology Deserves</span>
          </h1>
        </div>

        {/* Sub-headline */}
        <p
          className="max-w-2xl text-slate-400 font-light leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
        >
          DaScient, LLC accelerates grant and contract funding submissions for programs in{' '}
          <span className="text-accent-cyan font-medium">AI &amp; Machine Learning</span>,{' '}
          <span className="text-accent-cyan font-medium">Human-Machine Teaming</span>, and{' '}
          <span className="text-accent-cyan font-medium">Quantum Applications</span> — bridging
          abstract mathematics with mission-critical autonomy.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a href="#contact" className="btn-glow">
            Initiate Consultation
          </a>
          <a href="#services" className="btn-ghost">
            Explore Services
          </a>
        </div>

        {/* Metrics strip */}
        <div
          className="glass-panel mt-6 w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden"
        >
          {METRICS.map(({ value, label }, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 py-5 px-4 hover:bg-[rgba(14,165,233,0.04)] transition-colors"
            >
              <span className="font-display font-800 text-3xl leading-none gradient-text">
                {value}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll indicator — sharp corners */}
        <div className="mt-4 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
            <rect x="6.5" y="4" width="3" height="6" rx="0" fill="#64748b" />
            <rect x="0.5" y="0.5" width="15" height="23" rx="0" stroke="#334155" />
          </svg>
        </div>
      </div>
    </section>
  )
}
