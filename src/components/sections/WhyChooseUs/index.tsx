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

export function WhyChooseUs() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className={styles.label}>Vì sao chọn chúng tôi</p>
          <h2 className={styles.heading}>Giữ chất thủ công trong từng chi tiết hoàn thiện</h2>
        </motion.div>

        <div className={styles.grid}>
          {reasons.map((reason, index) => (
            <motion.article
              className={styles.card}
              key={reason.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className={styles.icon}>
                <reason.icon size={28} stroke={1.4} />
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
