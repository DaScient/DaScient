import Header from './components/Header'
import Hero from './components/Hero'
import ServiceTiers from './components/ServiceTiers'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-obsidian text-slate-100">
      <Header />
      <main>
        <Hero />
        <ServiceTiers />
        <Services />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
