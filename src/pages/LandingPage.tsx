import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/sections/Hero'
import styles from './LandingPage.module.css'

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main className={styles.pageContent}>
        <Hero />
      </main>
    </>
  )
}
