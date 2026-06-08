import { motion } from 'framer-motion'
import styles from './index.module.css'

const testimonials = [
  {
    quote: 'Bề mặt gỗ hoàn thiện rất kỹ, màu sắc ấm và sang hơn ảnh tư vấn ban đầu. Sản phẩm đặt trong phòng khách rất hợp.',
    name: 'Khách hàng nội thất',
    role: 'TP.HCM',
  },
  {
    quote: 'Đội ngũ tư vấn rõ ràng về chất liệu, kích thước và thời gian. Món quà doanh nghiệp được làm đúng tinh thần chúng tôi cần.',
    name: 'Đơn vị quà tặng',
    role: 'Bình Dương',
  },
  {
    quote: 'Tôi thích cách sản phẩm giữ được nét thủ công nhưng vẫn gọn gàng, hiện đại. Các chi tiết chạm khắc rất có chiều sâu.',
    name: 'Khách hàng decor',
    role: 'Đồng Nai',
  },
]

export function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className={styles.label}>Khách hàng nói gì</p>
          <h2 className={styles.heading}>Sự tin tưởng đến từ trải nghiệm sử dụng thật</h2>
        </motion.div>

        <div className={styles.grid}>
          {testimonials.map((item, index) => (
            <motion.article
              className={styles.card}
              key={item.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
            >
              <div className={styles.mark}>“</div>
              <p>{item.quote}</p>
              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
