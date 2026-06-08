import { motion } from 'framer-motion'
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

export function About() {
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
            <div className={styles.stat}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Sản phẩm</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Tận tâm</span>
            </div>
          </div>

          <div className={styles.imageGrid}>
            <div className={styles.imageMain}>
              <img src={aboutMain} alt="Xưởng chế tác gỗ Việt Giai Hân" className={styles.img} />
            </div>
            <div className={styles.imageSecond}>
              <img src={aboutSecond} alt="Sản phẩm gỗ thủ công" className={styles.img} />
              <div className={styles.imageBadge}>
                <span className={styles.badgeNumber}>10+</span>
                <span className={styles.badgeText}>Năm gìn nghề</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {points.map((point) => (
            <article className={styles.point} key={point.title}>
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
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
