import { Navbar } from '../components/layout/Navbar'
import { ProductHeroBanner } from '../components/sections/ProductHeroBanner'
import { ProductsSection } from '../components/sections/Products'
import styles from './LandingPage.module.css'

export function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.pageContent}>
        <ProductHeroBanner />
        <ProductsSection />
      </main>
    </>
  )
}
