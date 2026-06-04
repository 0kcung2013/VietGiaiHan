import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Process } from '../components/sections/Process'
import { ProductsSection } from '../components/sections/Products'
import { Representative } from '../components/sections/Representative'
import { useLenis } from '../hooks/useLenis'

export function LandingPage() {
  useLenis()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <ProductsSection />
        <Process />
        <Representative />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
