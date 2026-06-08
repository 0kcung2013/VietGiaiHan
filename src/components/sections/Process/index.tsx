import { motion } from 'framer-motion'
import { IconBrush, IconHammer, IconPackageExport, IconTrees } from '@tabler/icons-react'
import styles from './index.module.css'

const steps = [
  { number: '01', title: 'Tuyển chọn vật liệu', text: 'Kiểm tra vân gỗ, độ ổn định và sắc độ trước khi đưa vào xưởng.', icon: IconTrees },
  { number: '02', title: 'Tạo dáng thủ công', text: 'Định hình sản phẩm theo công năng, tỉ lệ và yêu cầu hoàn thiện.', icon: IconHammer },
  { number: '03', title: 'Chạm khắc chi tiết', text: 'Hoàn thiện các đường nét bằng tay để giữ chiều sâu tự nhiên của vật liệu.', icon: IconBrush },
  { number: '04', title: 'Xử lý bề mặt', text: 'Chà nhám, phủ bảo vệ và kiểm tra chất lượng trước khi bàn giao.', icon: IconPackageExport },
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
          {steps.map((step, index) => (
            <motion.article
              className={styles.step}
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className={styles.icon}>
                <step.icon size={30} stroke={1.35} />
              </div>
              <span className={styles.number}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
