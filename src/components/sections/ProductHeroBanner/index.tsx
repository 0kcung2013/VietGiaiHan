import { motion, type Variants } from 'framer-motion'
import styles from './index.module.css'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function ProductHeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        <motion.nav className={styles.breadcrumb} variants={fadeUp}>
          <a href="/" className={styles.breadcrumbLink}>
            Trang chủ
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Sản phẩm</span>
        </motion.nav>

        <motion.span className={styles.badge} variants={fadeUp}>
          BỘ SƯU TẬP
        </motion.span>

        <motion.h1 className={styles.heading} variants={fadeUp}>
          Tất Cả Sản Phẩm
        </motion.h1>

        <motion.p className={styles.description} variants={fadeUp}>
          Khám phá bộ sưu tập sản phẩm thủ công mỹ nghệ Việt Nam — nơi tinh
          hoa truyền thống gặp gỡ thiết kế hiện đại.
        </motion.p>
      </motion.div>
    </section>
  )
}
