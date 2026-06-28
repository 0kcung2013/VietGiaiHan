import { useRef, useCallback, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, type Variants } from 'framer-motion'
import { IconChevronDown, IconHammer, IconLeaf, IconShieldCheck, IconArrowRight } from '@tabler/icons-react'
import heroWood from '../../../assets/images/hero-wood.jpg'
import styles from './index.module.css'

/* ─── Variants ────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const cubicSmooth: [number, number, number, number] = [0.23, 1, 0.32, 1]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: cubicSmooth },
  },
}

const scaleLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.85, ease: cubicSmooth, delay: 0.6 },
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: cubicSmooth },
  },
}

/* ─── Data ────────────────────────────────────────────────────── */

const trustCards = [
  {
    icon: IconShieldCheck,
    number: '10+',
    label: 'Năm Nghệ Nhân',
    desc: 'Kinh nghiệm chế tác',
  },
  {
    icon: IconHammer,
    number: '500+',
    label: 'Sản Phẩm',
    desc: 'Hoàn thiện thủ công',
  },
  {
    icon: IconLeaf,
    number: '100%',
    label: 'Tự Nhiên',
    desc: 'Gỗ tuyển chọn',
  },
]

const dustParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  size: 1.2 + (i % 6) * 0.7,
  x: (i * 2.9 + 3) % 100,
  y: (i * 6.3 + 4) % 100,
  dur: 5.5 + (i % 8) * 1.8,
  delay: i * 0.22,
  opacity: 0.12 + (i % 5) * 0.1,
}))

/* ─── Component ───────────────────────────────────────────────── */

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(visualRef, { once: true, margin: '-50px' })

  /* Mouse parallax */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 55, damping: 16 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springCfg)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springCfg)

  /* Scroll parallax for main image */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 140])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [mouseX, mouseY],
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <section className={styles.hero} id="hero" ref={heroRef}>
      {/* ── Ambient Blobs ── */}
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.blob1} />
        <span className={styles.blob2} />
        <span className={styles.blob3} />
      </div>

      {/* ── Gold Dust Particles ── */}
      <div className={styles.dustLayer} aria-hidden="true">
        {dustParticles.map((p) => (
          <span
            key={p.id}
            className={styles.dust}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Grain Texture ── */}
      <svg className={styles.grain} aria-hidden="true">
        <filter id="hero-grain-luxury">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain-luxury)" />
      </svg>

      {/* ── Bottom Fade ── */}
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* ── Main Grid ── */}
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ═══════════ LEFT: Copy ═══════════ */}
        <div className={styles.copy}>
          {/* Brand Mark */}
          <motion.div className={styles.brandMark} variants={fadeUp}>
            <span className={styles.brandDot} />
            <span className={styles.brandName}>Việt Giai Hân Studio</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className={styles.headline} variants={fadeUp}>
            <span className={styles.line1}>Nghệ thuật từ</span>
            <span className={styles.line2}>gỗ Việt Nam</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p className={styles.subhead} variants={fadeUp}>
            Chế tác thủ công tinh hoa, kết nối truyền thống với đương đại
          </motion.p>

          {/* Gold Divider */}
          <motion.div className={styles.divider} variants={scaleLine}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerDiamond} />
            <span className={styles.dividerLine} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className={styles.actions} variants={fadeUp}>
            <a className={styles.btnPrimary} href="#products">
              <span className={styles.btnLabel}>Xem Bộ Sưu Tập</span>
              <span className={styles.btnIconWrap}>
                <IconArrowRight size={16} stroke={2} />
              </span>
            </a>
            <a className={styles.btnSecondary} href="#contact">
              Nhận Tư Vấn
            </a>
          </motion.div>

          {/* Trust Bento Cards */}
          <motion.div
            className={styles.trustGrid}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {trustCards.map((card) => (
              <motion.div
                className={styles.trustCard}
                key={card.label}
                variants={cardReveal}
                whileHover={{ y: -4, transition: { duration: 0.35, ease: cubicSmooth } }}
              >
                <div className={styles.trustCardAccent} />
                <div className={styles.trustCardIcon}>
                  <card.icon size={20} stroke={1.5} />
                </div>
                <span className={styles.trustCardNumber}>{card.number}</span>
                <span className={styles.trustCardLabel}>{card.label}</span>
                <span className={styles.trustCardDesc}>{card.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══════════ RIGHT: Visual ═══════════ */}
        <motion.div
          className={styles.visualWrap}
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.95, ease: cubicSmooth, delay: 0.4 }}
        >
          <motion.div
            ref={visualRef}
            className={styles.visual}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }}
          >
            {/* Main image container */}
            <motion.div className={styles.imageContainer} style={{ y: imageY }}>
              <div className={styles.imageShimmer} />
              <img
                src={heroWood}
                alt="Đồ gỗ mỹ nghệ Việt Giai Hân — Chế tác thủ công tinh xảo"
                className={styles.heroImg}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        <IconChevronDown size={18} stroke={1.5} />
      </div>
    </section>
  )
}
