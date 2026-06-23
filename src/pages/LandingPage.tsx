import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { About } from '../components/sections/About'
import { CategoriesShowcase } from '../components/sections/CategoriesShowcase'
import { Contact } from '../components/sections/Contact'
import { JobApplication } from '../components/sections/JobApplication'
import { GalleryShowcase } from '../components/sections/GalleryShowcase'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Process } from '../components/sections/Process'
import { ProductsSection } from '../components/sections/Products'
import { Representative } from '../components/sections/Representative'
import { Testimonials } from '../components/sections/Testimonials'
import { TrustStats } from '../components/sections/TrustStats'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
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
        <CategoriesShowcase />
        <ProductsSection />
        <WhyChooseUs />
        <Process />
        <GalleryShowcase />
        <Testimonials />
        <TrustStats />
        <Representative />
        <JobApplication />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
