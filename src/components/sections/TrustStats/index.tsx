import { motion } from 'framer-motion'
import styles from './index.module.css'

const stats = [
  ['2000+', 'Khách hàng hài lòng'],
  ['10+', 'Năm hoạt động'],
  ['95%', 'Đánh giá xuất sắc'],
  ['500+', 'Sản phẩm hoàn thiện'],
]

export function TrustStats() {
  return (
    <section className={styles.section} id="trust">
      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className={styles.label}>Những con số ấn tượng</p>
          <h2 className={styles.heading}>Được lựa chọn bởi khách hàng yêu giá trị thủ công</h2>
        </motion.div>

        <div className={styles.grid}>
          {stats.map(([number, label], index) => (
            <motion.div
              className={styles.stat}
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <span className={styles.number}>{number}</span>
              <span className={styles.text}>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
