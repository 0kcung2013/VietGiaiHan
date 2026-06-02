import { motion, type Variants } from 'framer-motion'
import { IconChevronDown } from '@tabler/icons-react'
import heroWood from '../../assets/images/hero-wood.jpg'
import styles from './Hero.module.css'

const textContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const labelVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.2, duration: 0.5, ease: 'easeOut' },
  },
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.7, ease: 'easeOut' },
  },
}

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.5, ease: 'easeOut' },
  },
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.7, duration: 0.5, ease: 'easeOut' },
  },
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <svg className={styles.texture} aria-hidden="true">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={styles.label} variants={labelVariants}>
            Thủ công từ gỗ tự nhiên
          </motion.p>

          <motion.h1 className={styles.heading} variants={headingVariants}>
            Nghệ thuật từ
            <br />
            gỗ Việt Nam
          </motion.h1>

          <motion.p className={styles.description} variants={paragraphVariants}>
            Việt Giai Hân chuyên sản xuất đồ gỗ mỹ nghệ cao cấp — từ đồ gia dụng đến trang trí nội
            thất, mỗi sản phẩm là một tác phẩm được chế tác tỉ mỉ từ gỗ tự nhiên chọn lọc.
          </motion.p>

          <motion.div className={styles.actions} variants={buttonVariants}>
            <a className={styles.primaryButton} href="/san-pham">
              Xem sản phẩm
            </a>
            <a className={styles.ghostButton} href="/ve-chung-toi">
              Tìm hiểu thêm →
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
        >
          <div className={styles.visualFrame}>
            <img
              src={heroWood}
              alt="Đồ gỗ mỹ nghệ Việt Giai Hân"
              className={styles.heroImage}
            />
          </div>
        </motion.div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <IconChevronDown size={22} stroke={1.5} />
      </div>
    </section>
  )
}
