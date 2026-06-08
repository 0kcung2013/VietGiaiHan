import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import { IconChevronDown, IconHammer, IconLeaf, IconShieldCheck } from '@tabler/icons-react'
import heroWood from '../../../assets/images/hero-wood.jpg'
import styles from './index.module.css'

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

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 3 + (i % 4) * 2,
  x: 5 + (i * 8.3) % 90,
  y: 10 + (i * 13.7) % 80,
  duration: 4 + (i % 5),
  delay: i * 0.4,
}))

const trustBadges = [
  { icon: IconShieldCheck, number: '10+', label: 'Năm kinh nghiệm' },
  { icon: IconHammer, number: '500+', label: 'Sản phẩm hoàn thiện' },
  { icon: IconLeaf, number: '100%', label: 'Thủ công' },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 80, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)

  function handleMouseMove(e: MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section className={styles.hero} id="hero">
      <svg className={styles.texture} aria-hidden="true">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <div className={styles.particles} aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className={styles.particle}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={styles.label} variants={labelVariants}>
            Việt Giai Hân studio
          </motion.p>

          <motion.h1 className={styles.heading} variants={headingVariants}>
            <span className={styles.headingLines}>
              <span className={styles.headingLine1}>Nghệ thuật từ</span>
              <span className={styles.headingLine2}>gỗ Việt Nam</span>
            </span>
          </motion.h1>

          <motion.p className={styles.description} variants={paragraphVariants}>
            Chúng tôi chế tác đồ gỗ mỹ nghệ, nội thất và vật dụng gia đình từ gỗ tự nhiên,
            hoàn thiện thủ công theo yêu cầu để mỗi sản phẩm vừa bền, vừa mang dấu ấn riêng.
          </motion.p>

          <motion.div className={styles.actions} variants={buttonVariants}>
            <a className={styles.primaryButton} href="#products">
              Xem bộ sưu tập
            </a>
            <a className={styles.ghostButton} href="#contact">
              Nhận tư vấn
            </a>
          </motion.div>

          <motion.div className={styles.trustList} variants={buttonVariants}>
            {trustBadges.map((badge) => (
              <div className={styles.trustItem} key={badge.label}>
                <badge.icon size={20} stroke={1.5} />
                <span className={styles.trustNumber}>{badge.number}</span>
                <span className={styles.trustLabel}>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          className={styles.visual}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
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
          <div className={styles.imageCaption}>
            <span>Xưởng chế tác thủ công</span>
            <strong>Gỗ tự nhiên tuyển chọn</strong>
          </div>
        </motion.div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <IconChevronDown size={22} stroke={1.5} />
      </div>
    </section>
  )
}
