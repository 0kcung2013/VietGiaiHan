import { motion } from 'framer-motion'
import { IconHammer, IconLeaf, IconPencilStar, IconRulerMeasure, IconShieldCheck } from '@tabler/icons-react'
import styles from './index.module.css'

const reasons = [
  {
    icon: IconHammer,
    title: 'Chất lượng thủ công',
    text: 'Mỗi sản phẩm được xử lý bằng tay ở những chi tiết quyết định cảm giác sử dụng.',
  },
  {
    icon: IconRulerMeasure,
    title: 'Kỹ thuật tinh xảo',
    text: 'Tỉ lệ, mối ghép, bề mặt và sắc độ được kiểm tra kỹ trước khi bàn giao.',
  },
  {
    icon: IconPencilStar,
    title: 'Thiết kế riêng biệt',
    text: 'Tư vấn kiểu dáng, kích thước và công năng theo không gian thực tế.',
  },
  {
    icon: IconShieldCheck,
    title: 'Sản xuất theo yêu cầu',
    text: 'Nhận đơn hàng cá nhân, quà tặng, decor và nhu cầu doanh nghiệp.',
  },
  {
    icon: IconLeaf,
    title: 'Phát triển bền vững',
    text: 'Ưu tiên vật liệu tự nhiên, sử dụng lâu dài và vẻ đẹp không lỗi thời.',
  },
]

const cardVariants = [
  styles.cardAmber,
  styles.cardBronze,
  styles.cardGold,
  styles.cardOlive,
  styles.cardSage,
]

export function WhyChooseUs() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>
        <div className={styles.split}>
          <motion.div
            className={styles.intro}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <span className={styles.giantNum} aria-hidden="true">01</span>
            <p className={styles.label}>Vì sao chọn chúng tôi</p>
            <h2 className={styles.heading}>Giữ chất <span className={styles.headingAccent}>thủ công</span> trong từng chi tiết hoàn thiện</h2>
            <p className={styles.introText}>
              Từ vật liệu tự nhiên đến bàn tay thợ lành nghề, mỗi sản phẩm là kết quả
              của quy trình tỉ mỉ, không chạy theo số lượng mà đặt giá trị bền lâu lên hàng đầu.
            </p>
            <a href="#process" className={styles.ctaLink}>
              Tìm hiểu quy trình
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>
            <span className={styles.introAccent} />
          </motion.div>

          <div className={styles.cardGrid}>
            {reasons.map((reason, index) => (
              <motion.article
                className={`${styles.card} ${cardVariants[index]}`}
                key={reason.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.icon}>
                    <reason.icon size={26} stroke={1.4} />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardNum}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </div>
                </div>
              </motion.article>
            ))}

            <motion.article
              className={`${styles.card} ${styles.ctaCard}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: reasons.length * 0.06 }}
            >
              <div className={styles.ctaCardInner}>
                <span className={styles.ctaCardLabel}>Tư vấn & thiết kế</span>
                <h3>Tư vấn chất liệu & thiết kế riêng</h3>
                <a href="#contact" className={styles.ctaCardLink}>
                  Liên hệ ngay
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  )
}
