import { useRef, useCallback, type MouseEvent, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, type Variants } from 'framer-motion'
import { IconChevronDown, IconHammer, IconLeaf, IconPackage, IconArrowRight } from '@tabler/icons-react'
import heroWood from '../../../assets/images/123.png'
import aboutMain from '../../../assets/images/about-main.jpg'
import aboutSecond from '../../../assets/images/about-second.jpg'
import styles from './index.module.css'

/* ─── Variants ────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const cubicSmooth: [number, number, number, number] = [0.23, 1, 0.32, 1]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: cubicSmooth },
  },
}

const scaleLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.75, ease: cubicSmooth, delay: 0.55 },
  },
}

const ringContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.65 } },
}

const ringReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: cubicSmooth },
  },
}

/* ─── Data ────────────────────────────────────────────────────── */
/* Three growth rings of the timber slice — heart (years of mastery),
   heartwood (finished pieces), bark (the natural material holding it all). */

const ringStats = [
  {
    id: 'years',
    number: '10+',
    label: 'Năm Kinh Nghiệm',
    color: 'var(--wood-honey)',
    icon: IconHammer,
    posClass: styles.ringStat1,
  },
  {
    id: 'products',
    number: '500+',
    label: 'Sản Phẩm',
    color: 'var(--wood-lacquer)',
    icon: IconPackage,
    posClass: styles.ringStat2,
  },
  {
    id: 'natural',
    number: '100%',
    label: 'Gỗ Tự Nhiên',
    color: 'var(--wood-jade)',
    icon: IconLeaf,
    posClass: styles.ringStat3,
  },
]

/* ─── Component ───────────────────────────────────────────────── */

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInView = useInView(visualRef, { once: true, margin: '-50px' })

  /* ── Loading Splash ── */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 700)
    return () => clearTimeout(timer)
  }, [])

  /* ── Mouse parallax (subtle — this is furniture, not glass) ── */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 60, damping: 18 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springCfg)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springCfg)

  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  /* ── Progress Bar ── */
  const { scrollYProgress: globalScroll } = useScroll()
  const progressBar = useTransform(globalScroll, [0, 0.3], ['0%', '100%'])

  /* ── Event handlers ── */
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
    <div className={styles.root}>
      {/* ─── Loading Splash ─── */}
      {!isLoaded && (
        <motion.div
          className={styles.splash}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.55 }}
          style={{ pointerEvents: 'none' }}
        >
          <svg className={styles.splashRings} viewBox="0 0 56 56" aria-hidden="true">
            <circle cx="28" cy="28" r="10" />
            <circle cx="28" cy="28" r="17" />
            <circle cx="28" cy="28" r="24" />
          </svg>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={styles.splashText}
          >
            Việt Giai Hân Studio
          </motion.p>
        </motion.div>
      )}

      {/* ─── Progress Bar ─── */}
      <motion.div className={styles.progressBar} style={{ scaleX: progressBar }} />

      {/* ─── Section ─── */}
      <section className={styles.hero} id="hero" ref={heroRef}>
        {/* ── Ambient Growth-Ring Motif ── */}
        <svg className={styles.bgMotif} viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="60" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="100" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="140" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="175" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="198" strokeWidth="2.5" />
        </svg>

        {/* ── Grain Texture ── */}
        <svg className={styles.grain} aria-hidden="true">
          <filter id="hero-grain-wood">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain-wood)" />
        </svg>

        {/* ── Main Grid ── */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: opacityProgress }}
        >
          {/* ═══════════ LEFT: Copy ═══════════ */}
          <div className={styles.copy}>
            {/* Brand Mark — a maker's seal, like a stamp on a finished piece */}
            <motion.div className={styles.brandMark} variants={fadeUp}>
              <svg className={styles.brandSeal} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="1.6" />
              </svg>
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

            {/* Divider */}
            <motion.div className={styles.divider} variants={scaleLine}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerRing} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className={styles.actions} variants={fadeUp}>
              <motion.a
                className={styles.btnPrimary}
                href="#products"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Xem Bộ Sưu Tập</span>
                <span className={styles.btnIconWrap}>
                  <IconArrowRight size={16} stroke={2} />
                </span>
              </motion.a>
              <motion.a
                className={styles.btnSecondary}
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Nhận Tư Vấn
              </motion.a>
            </motion.div>

            {/* Growth-Ring Stat Diagram — vòng tuổi gỗ */}
            <motion.div
              className={styles.ringDiagram}
              variants={ringContainer}
              initial="hidden"
              animate="visible"
            >
              <svg className={styles.ringSvg} viewBox="0 0 300 300" aria-hidden="true">
                <circle className={styles.texture} cx="150" cy="150" r="14" opacity="0.12" />
                <circle className={styles.texture} cx="150" cy="150" r="24" opacity="0.12" />
                <circle className={styles.texture} cx="150" cy="150" r="34" opacity="0.1" />
                <circle className={styles.texture} cx="150" cy="150" r="60" opacity="0.1" />
                <circle className={styles.texture} cx="150" cy="150" r="84" opacity="0.08" />
                <circle className={styles.texture} cx="150" cy="150" r="110" opacity="0.06" />

                <motion.circle
                  variants={ringReveal}
                  cx="150"
                  cy="150"
                  r="46"
                  fill="none"
                  stroke="var(--wood-honey)"
                  strokeWidth="7"
                />
                <motion.circle
                  variants={ringReveal}
                  cx="150"
                  cy="150"
                  r="72"
                  fill="none"
                  stroke="var(--wood-lacquer)"
                  strokeWidth="7"
                />
                <motion.circle
                  variants={ringReveal}
                  cx="150"
                  cy="150"
                  r="98"
                  fill="none"
                  stroke="var(--wood-jade)"
                  strokeWidth="7"
                />

                <circle className={styles.pith} cx="150" cy="150" r="5" />

                <line className={styles.leader} x1="150" y1="104" x2="150" y2="52" stroke="var(--wood-honey)" opacity="0.55" />
                <line className={styles.leader} x1="201" y1="201" x2="246" y2="234" stroke="var(--wood-lacquer)" opacity="0.55" />
                <line className={styles.leader} x1="70" y1="206" x2="40" y2="238" stroke="var(--wood-jade)" opacity="0.55" />
              </svg>

              {ringStats.map((stat) => (
                <motion.div className={`${styles.ringStat} ${stat.posClass}`} key={stat.id} variants={ringReveal}>
                  <div className={styles.ringStatRow} style={{ color: stat.color }}>
                    <stat.icon size={14} stroke={1.75} />
                    <span className={styles.ringStatNumber}>{stat.number}</span>
                  </div>
                  <span className={styles.ringStatLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ═══════════ RIGHT: Visual ═══════════ */}
          <motion.div
            className={styles.visualWrap}
            initial={{ opacity: 0, x: 36 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 36 }}
            transition={{ duration: 0.9, ease: cubicSmooth, delay: 0.4 }}
          >
            <div
              ref={visualRef}
              className={styles.collage}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
            >
              <motion.div className={styles.imgMain} style={{ y: imageY }}>
                <img
                  src={heroWood}
                  alt="Đồ gỗ mỹ nghệ Việt Giai Hân — Chế tác thủ công tinh xảo"
                  className={styles.heroImg}
                  draggable={false}
                  loading="eager"
                />
              </motion.div>
              <motion.div
                className={styles.imgSecond}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: cubicSmooth, delay: 0.7 }}
              >
                <img
                  src={aboutMain}
                  alt="Chi tiết sản phẩm đồ gỗ thủ công"
                  className={styles.heroImg}
                  draggable={false}
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className={styles.imgThird}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: cubicSmooth, delay: 0.9 }}
              >
                <img
                  src={aboutSecond}
                  alt="Không gian trưng bày đồ gỗ mỹ nghệ"
                  className={styles.heroImg}
                  draggable={false}
                  loading="lazy"
                />
                <div className={styles.imgOverlay}>
                  <span className={styles.imgOverlayText}>Mộc Thủ Công</span>
                  <span className={styles.imgOverlaySub}>Bình Dương</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Scroll Indicator ── */}
        <motion.div
          className={styles.scrollCue}
          aria-hidden="true"
          animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className={styles.scrollLine} />
          <IconChevronDown size={18} stroke={1.5} />
        </motion.div>
      </section>
    </div>
  )
}