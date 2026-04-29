import { useState, useRef } from 'react'

// Formspree endpoint — owner should replace with their own Formspree form ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

const INQUIRY_SUBJECTS = [
  { value: '', label: 'Select an inquiry type…' },
  { value: 'funding', label: 'Government Funding & Grant Strategy — funding@dascient.com' },
  { value: 'ai', label: 'AI / ML Consulting — ai@dascient.com' },
  { value: 'hmt', label: 'Human-Machine Teaming — hmt@dascient.com' },
  { value: 'quantum', label: 'Quantum Applications — quantum@dascient.com' },
  { value: 'aerospace', label: 'Aerospace & GNC — aerospace@dascient.com' },
  { value: 'press', label: 'Press & Media — press@dascient.com' },
  { value: 'general', label: 'General Inquiry — contact@dascient.com' },
]

function InputField({ label, id, type = 'text', required, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-mono uppercase tracking-widest text-slate-500">
        {label}{required && <span className="text-accent-blue ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[rgba(14,165,233,0.5)] focus:bg-[rgba(14,165,233,0.04)] transition-all duration-200"
      />
    </div>
  )
}

export default function Contact() {
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject) return
    setStatus('sending')

    // Map subject to routing alias
    const subjectEntry = INQUIRY_SUBJECTS.find((s) => s.value === formData.subject)
    const routingEmail = subjectEntry ? subjectEntry.label.split('— ')[1] : 'contact@dascient.com'

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: `[DaScient] ${subjectEntry?.label.split(' —')[0] ?? 'Inquiry'} from ${formData.name}`,
          _routing: routingEmail,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', organization: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 20%, rgba(14,165,233,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left column — context */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-accent-blue border border-[rgba(14,165,233,0.25)] bg-[rgba(14,165,233,0.05)] mb-5">
                Contact
              </div>
              <h2
                className="font-display font-800 text-white tracking-tight mb-4"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              >
                Secure the<br />
                <span className="gradient-text">Future Together</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Ready to discuss how DaScient can accelerate your government funding strategy?
                Select the most relevant inquiry type and our routing system will connect you
                with the right specialist automatically.
              </p>
            </div>

            {/* Contact info */}
            <div className="glass-panel p-6 flex flex-col gap-5">
              <ContactRow
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4l6 5 6-5" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" />
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#0ea5e9" strokeWidth="1.2" />
                  </svg>
                }
                label="Email"
                value="contact@dascient.com"
                href="mailto:contact@dascient.com"
              />
              <ContactRow
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5.5 2.5C5.7 3.5 6.2 4.4 6.9 5.1L5.5 6.5C6.5 8.1 7.9 9.5 9.5 10.5L10.9 9.1C11.6 9.8 12.5 10.3 13.5 10.5L12.5 14C8 13.5 2.5 8 2 3.5L5.5 2.5Z"
                      stroke="#0ea5e9"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="Phone"
                value="+1 310-220-0142"
                href="tel:+13102200142"
              />
              <ContactRow
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="7" r="2.5" stroke="#0ea5e9" strokeWidth="1.2" />
                    <path
                      d="M8 2C5.24 2 3 4.24 3 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5Z"
                      stroke="#0ea5e9"
                      strokeWidth="1.2"
                    />
                  </svg>
                }
                label="Locations"
                value="Los Angeles, CA · Denver, CO · Columbia, MD"
              />
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              <SocialLink href="https://www.linkedin.com/company/dascient/" label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialLink>
              <SocialLink href="https://medium.com/@dascient" label="Medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://kaggle.com/dascient/code" label="Kaggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-8 md:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L19 7" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-display font-700 text-white text-xl">Message Transmitted</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Your inquiry has been routed to the correct specialist. We'll respond within
                    24 hours.
                  </p>
                  <button
                    className="btn-ghost text-xs mt-2"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      label="Full Name"
                      id="name"
                      required
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Email Address"
                      id="email"
                      type="email"
                      required
                      placeholder="jane@company.gov"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <InputField
                    label="Organization"
                    id="organization"
                    placeholder="DARPA / DoD / Private Company"
                    value={formData.organization}
                    onChange={handleChange}
                  />

                  {/* Subject / routing dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-xs font-mono uppercase tracking-widest text-slate-500">
                      Inquiry Type <span className="text-accent-blue">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[rgba(14,165,233,0.5)] focus:bg-[rgba(14,165,233,0.04)] transition-all duration-200 appearance-none cursor-pointer"
                      style={{ color: formData.subject ? '#fff' : '#475569' }}
                    >
                      {INQUIRY_SUBJECTS.map(({ value, label }) => (
                        <option key={value} value={value} style={{ background: '#111', color: '#fff' }}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-slate-500">
                      Message <span className="text-accent-blue">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Describe your project, funding goals, or technical challenge…"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[rgba(14,165,233,0.5)] focus:bg-[rgba(14,165,233,0.04)] transition-all duration-200 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-xs font-mono">
                      Transmission failed. Please try again or email contact@dascient.com directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-3 h-3 border border-accent-blue border-t-transparent rounded-full animate-spin" />
                        Transmitting…
                      </>
                    ) : (
                      'Send Transmission'
                    )}
                  </button>

                  <p className="text-center text-[11px] font-mono text-slate-600">
                    Your message will be routed to the appropriate specialist based on your selection.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ icon, label, value, href }) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-md bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.15)] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-0.5">{label}</p>
        <p className="text-sm text-slate-300">{value}</p>
      </div>
    </div>
  )
  return href ? (
    <a href={href} className="hover:text-accent-cyan transition-colors">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2.5 rounded-lg text-slate-500 hover:text-accent-blue border border-[rgba(255,255,255,0.07)] hover:border-[rgba(14,165,233,0.35)] hover:bg-[rgba(14,165,233,0.05)] transition-all duration-200"
    >
      {children}
    </a>
  )
}
