import { useRef, useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { IconAward, IconHeart, IconLeaf, IconRulerMeasure } from '@tabler/icons-react'
import aboutMain from '../../../assets/images/about-main.jpg'
import aboutSecond from '../../../assets/images/about-second.jpg'
import styles from './index.module.css'

const points = [
  {
    icon: IconLeaf,
    color: '#4A9E6B',
    title: 'Vật liệu chọn lọc',
    text: 'Ưu tiên gỗ tự nhiên, tre nứa và vật liệu bền vững có vân sắc ấm, ổn định.',
  },
  {
    icon: IconRulerMeasure,
    color: '#B8860B',
    title: 'Chế tác tỉ mỉ',
    text: 'Mỗi chi tiết được xử lý bằng kỹ thuật thủ công, cân bằng độ bền và thẩm mỹ.',
  },
  {
    icon: IconAward,
    color: '#7B6FAE',
    title: 'Hoàn thiện cao cấp',
    text: 'Bề mặt mịn, sắc độ trầm ấm và cảm giác sử dụng phù hợp không gian sống hiện đại.',
  },
  {
    icon: IconHeart,
    color: '#E07B4A',
    title: 'Tâm huyết người thợ',
    text: 'Mỗi sản phẩm là tâm huyết của người thợ lành nghề, gắn bó với nghề truyền thống.',
  },
]

const stats = [
  { end: 500, suffix: '+', label: 'Sản phẩm' },
  { end: 10, suffix: '+', label: 'Năm kinh nghiệm' },
  { end: 100, suffix: '%', label: 'Tận tâm' },
]

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    const controls = animate(0, end, {
      duration: 1.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      onUpdate: (v) => {
        if (!cancelled) setDisplay(`${Math.round(v)}`)
      },
    })
    return () => {
      cancelled = true
      controls.stop()
    }
  }, [inView, end])

  return (
    <span ref={ref} className={styles.statNum}>
      {display}{suffix}
    </span>
  )
}

function ProgressRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg className={styles.progressRing} viewBox="0 0 44 44">
      <circle
        className={styles.progressRingBg}
        cx="22"
        cy="22"
        r="18"
        fill="none"
        strokeWidth="2.5"
      />
      <circle
        className={styles.progressRingFill}
        cx="22"
        cy="22"
        r="18"
        fill="none"
        strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function About() {
  const imageRef = useRef<HTMLDivElement>(null)
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 })

  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className={styles.label}>Câu chuyện thương hiệu</p>
          <h2 className={styles.heading}>Di sản nghề gỗ được gìn giữ bằng đôi tay người thợ</h2>
          <p className={styles.description}>
            Tại Việt Giai Hân, mỗi tác phẩm là kết tinh của tình yêu với gỗ và sự tôn vinh di sản thủ công truyền thống.
            Chúng tôi tin vẻ đẹp thật đến từ chất liệu tự nhiên, tay nghề bền bỉ và những chi tiết được hoàn thiện để đồng hành lâu dài.
          </p>

          <div className={styles.stats}>
            {stats.map((stat, i) => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statRingWrap}>
                  <ProgressRing progress={stat.end} />
                  <div className={styles.statContent}>
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
                {i < stats.length - 1 && <div className={styles.statDivider} />}
              </div>
            ))}
          </div>

          <div className={styles.imageGrid} ref={imageRef}>
            <motion.div
              className={styles.imageMain}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={imageInView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img src={aboutMain} alt="Xưởng chế tác gỗ Việt Giai Hân" className={`${styles.img} ${styles.kenBurns}`} />
            </motion.div>
            <motion.div
              className={styles.imageSecond}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={imageInView ? { clipPath: 'inset(0 0 0% 0)' } : {}}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            >
              <img src={aboutSecond} alt="Sản phẩm gỗ thủ công" className={styles.img} />
              <motion.div
                className={styles.imageBadge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={imageInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className={styles.badgeNumber}>10+</span>
                <span className={styles.badgeText}>Năm gìn nghề</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.panel}>
          {points.map((point, index) => (
            <motion.article
              className={styles.point}
              key={point.title}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
              }}
            >
              <span className={styles.pointIndex}>{String(index + 1).padStart(2, '0')}</span>
              <div
                className={styles.icon}
                style={{
                  background: `${point.color}14`,
                  borderColor: `${point.color}40`,
                  color: point.color,
                }}
              >
                <point.icon size={22} stroke={1.5} />
              </div>
              <div className={styles.pointText}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
