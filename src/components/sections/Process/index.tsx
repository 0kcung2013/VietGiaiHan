import { motion } from 'framer-motion'
import styles from './index.module.css'

const steps = [
  ['01', 'Tuyển chọn vật liệu', 'Kiểm tra vân gỗ, độ ổn định và sắc độ trước khi đưa vào xưởng.'],
  ['02', 'Tạo dáng thủ công', 'Định hình sản phẩm theo công năng, tỉ lệ và yêu cầu hoàn thiện.'],
  ['03', 'Chạm khắc chi tiết', 'Hoàn thiện các đường nét bằng tay để giữ chiều sâu tự nhiên của vật liệu.'],
  ['04', 'Xử lý bề mặt', 'Chà nhám, phủ bảo vệ và kiểm tra chất lượng trước khi bàn giao.'],
]

export function Process() {
  return (
    <section className={styles.section} id="process">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.label}>Quy trình</p>
          <h2 className={styles.heading}>Từ thớ gỗ đến tác phẩm hoàn thiện</h2>
        </motion.div>

        <div className={styles.timeline}>
          {steps.map(([number, title, text], index) => (
            <motion.article
              className={styles.step}
              key={number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span className={styles.number}>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
